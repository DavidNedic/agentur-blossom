// Server-only booking helpers: Google free/busy, Zoom, Resend, ICS, cancellation.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { BASE_TZ, DAYS_AHEAD, SLOT_MIN, computeSlots, type Interval } from "@/lib/booking-slots";

export const SITE_URL = "https://promet.digital";
export const OWNER_EMAIL = "davidnedic@web.de";
const FROM = "Promet Digital <sastanak@promet.digital>";

function missing(...names: string[]) {
  const m = names.filter((n) => !process.env[n]);
  if (m.length) console.error(`[booking] Missing secret(s): ${m.join(", ")}. Add them in Project Settings > Secrets.`);
  return m.length > 0;
}

const b64url = (buf: ArrayBuffer | Uint8Array | string) => {
  const bytes = typeof buf === "string" ? new TextEncoder().encode(buf) : new Uint8Array(buf as ArrayBuffer);
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const b64utf8 = (str: string) => {
  let s = "";
  new TextEncoder().encode(str).forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s);
};

/* ---------- Google Calendar free/busy ---------- */
async function googleToken(): Promise<string | null> {
  if (missing("GOOGLE_SERVICE_ACCOUNT_JSON", "GOOGLE_CALENDAR_ID")) return null;
  try {
    const sa = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON!) as { client_email: string; private_key: string };
    const now = Math.floor(Date.now() / 1000);
    const unsigned = `${b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64url(JSON.stringify({
      iss: sa.client_email, scope: "https://www.googleapis.com/auth/calendar.readonly",
      aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600,
    }))}`;
    const pem = sa.private_key.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
    const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
    const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned));
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${b64url(sig)}` }),
    });
    if (!res.ok) { console.error(`[booking] Google token failed [${res.status}]: ${await res.text()}`); return null; }
    return ((await res.json()) as { access_token: string }).access_token;
  } catch (e) {
    console.error("[booking] Google service account error:", e);
    return null;
  }
}

async function googleBusy(timeMin: number, timeMax: number): Promise<Interval[]> {
  const token = await googleToken();
  if (!token) { console.warn("[booking] Google Calendar skipped; slots ignore calendar busy times."); return []; }
  const id = process.env.GOOGLE_CALENDAR_ID!;
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin: new Date(timeMin).toISOString(), timeMax: new Date(timeMax).toISOString(), items: [{ id }] }),
  });
  if (!res.ok) { console.error(`[booking] Google freeBusy failed [${res.status}]: ${await res.text()}`); return []; }
  const j = (await res.json()) as { calendars?: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }> };
  const cal = j.calendars?.[id];
  if (cal?.errors?.length) console.error("[booking] Google calendar errors:", JSON.stringify(cal.errors));
  return (cal?.busy ?? []).map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
}

export async function availableSlots(now = Date.now()) {
  const until = now + (DAYS_AHEAD + 2) * 86_400_000;
  const [rules, blocked, bookings, busy] = await Promise.all([
    supabaseAdmin.from("availability_rules").select("weekday,start_time,end_time"),
    supabaseAdmin.from("blocked_dates").select("date"),
    supabaseAdmin.from("bookings").select("starts_at").eq("status", "confirmed")
      .gte("starts_at", new Date(now - 86_400_000).toISOString()).lte("starts_at", new Date(until).toISOString()),
    googleBusy(now, until),
  ]);
  if (rules.error || blocked.error || bookings.error) throw new Error("Could not load availability");
  return computeSlots({
    now,
    rules: rules.data,
    blocked: blocked.data.map((b) => b.date),
    busy,
    bookings: bookings.data.map((b) => Date.parse(b.starts_at)),
  });
}

/* ---------- Zoom ---------- */
export function zoomMissing() { return missing("ZOOM_ACCOUNT_ID", "ZOOM_CLIENT_ID", "ZOOM_CLIENT_SECRET"); }

async function zoomToken() {
  const res = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(process.env.ZOOM_ACCOUNT_ID!)}`, {
    method: "POST",
    headers: { Authorization: `Basic ${btoa(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`)}` },
  });
  if (!res.ok) throw new Error(`Zoom token failed [${res.status}]: ${await res.text()}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

export async function createZoomMeeting(startMs: number, topic: string) {
  const token = await zoomToken();
  const res = await fetch("https://api.zoom.us/v2/users/me/meetings", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      topic, type: 2, start_time: new Date(startMs).toISOString().replace(/\.\d+Z$/, "Z"), duration: SLOT_MIN, timezone: BASE_TZ,
      settings: { join_before_host: false, waiting_room: true },
    }),
  });
  if (!res.ok) throw new Error(`Zoom create failed [${res.status}]: ${await res.text()}`);
  const j = (await res.json()) as { id: number; join_url: string };
  return { id: String(j.id), joinUrl: j.join_url };
}

export async function deleteZoomMeeting(id: string) {
  if (zoomMissing()) return;
  try {
    const token = await zoomToken();
    const res = await fetch(`https://api.zoom.us/v2/meetings/${encodeURIComponent(id)}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok && res.status !== 404) console.error(`[booking] Zoom delete failed [${res.status}]: ${await res.text()}`);
  } catch (e) { console.error("[booking] Zoom delete error:", e); }
}

/* ---------- Email ---------- */
type Mail = { to: string; subject: string; html: string; replyTo?: string; ics?: string };
export async function sendMail(m: Mail) {
  if (missing("RESEND_API_KEY")) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM, to: [m.to], subject: m.subject, html: m.html,
      ...(m.replyTo ? { reply_to: m.replyTo } : {}),
      ...(m.ics ? { attachments: [{ filename: "sastanak.ics", content: b64utf8(m.ics), content_type: "text/calendar" }] } : {}),
    }),
  });
  if (!res.ok) { console.error(`[booking] Resend failed [${res.status}]: ${await res.text()}`); return false; }
  return true;
}

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export type BookingRow = {
  id: string; starts_at: string; ends_at: string; name: string; company: string; email: string; phone: string | null;
  message: string; lang: string; timezone: string; zoom_join_url: string | null; zoom_meeting_id: string | null; cancel_token: string; status: string;
};

export function fmtWhen(iso: string, lang: string, tz: string) {
  let zone = tz;
  try { new Intl.DateTimeFormat("en", { timeZone: tz }); } catch { zone = BASE_TZ; }
  const s = new Intl.DateTimeFormat(lang === "de" ? "de-DE" : "sr-Latn-RS", {
    timeZone: zone, weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(new Date(iso));
  return `${s} (${zone})`;
}

export function buildIcs(b: BookingRow) {
  const f = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const t = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Promet Digital//Sastanak//SR", "METHOD:PUBLISH", "BEGIN:VEVENT",
    `UID:${b.id}@promet.digital`, `DTSTAMP:${f(new Date().toISOString())}`, `DTSTART:${f(b.starts_at)}`, `DTEND:${f(b.ends_at)}`,
    `SUMMARY:${t(b.lang === "de" ? "Kostenloses Erstgespräch, Promet Digital" : "Besplatan sastanak, Promet Digital")}`,
    `DESCRIPTION:${t(`Zoom: ${b.zoom_join_url ?? ""}`)}`, `LOCATION:${t(b.zoom_join_url ?? "Zoom")}`,
    `ORGANIZER;CN=Promet Digital:mailto:sastanak@promet.digital`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

const wrap = (body: string) =>
  `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#17181C;max-width:560px">${body}<p style="color:#6B6F78;font-size:13px;margin-top:28px">Promet Digital, Zrenjanin / Beograd<br>promet.digital</p></div>`;
const btn = (href: string, label: string) =>
  `<p><a href="${href}" style="display:inline-block;background:#3DDCFF;color:#17181C;padding:12px 18px;text-decoration:none;font-weight:bold">${label}</a></p>`;

export function customerConfirmation(b: BookingRow) {
  const de = b.lang === "de";
  const when = esc(fmtWhen(b.starts_at, b.lang, b.timezone));
  const cancel = `${SITE_URL}/otkazi?token=${b.cancel_token}`;
  return {
    to: b.email, replyTo: OWNER_EMAIL, ics: buildIcs(b),
    subject: de ? "Termin bestätigt: kostenloses Erstgespräch" : "Sastanak je zakazan",
    html: wrap(de
      ? `<p>Hallo ${esc(b.name)},</p><p>dein kostenloses Erstgespräch (30 Min., Zoom) ist bestätigt:</p><p><b>${when}</b></p>${btn(b.zoom_join_url ?? "#", "Zoom beitreten")}<p>Den Termin findest du auch im Anhang (.ics).</p><p>Doch keine Zeit? <a href="${cancel}">Termin absagen</a></p><p>Bis bald,<br>David Nedić</p>`
      : `<p>Zdravo ${esc(b.name)},</p><p>tvoj besplatan sastanak (30 min, Zoom) je zakazan:</p><p><b>${when}</b></p>${btn(b.zoom_join_url ?? "#", "Uđi na Zoom")}<p>Termin je i u prilogu (.ics), za tvoj kalendar.</p><p>Ne stižeš? <a href="${cancel}">Otkaži sastanak</a></p><p>Vidimo se,<br>David Nedić</p>`),
  };
}

export function ownerNotification(b: BookingRow) {
  const rows: [string, string][] = [
    ["Termin", fmtWhen(b.starts_at, "sr", BASE_TZ)], ["Ime", b.name], ["Firma", b.company], ["E-mail", b.email],
    ["Telefon", b.phone || "-"], ["Jezik", b.lang.toUpperCase()], ["Vremenska zona posetioca", b.timezone],
    ["Šta radi i šta želi", b.message], ["Zoom", b.zoom_join_url ?? "-"],
  ];
  return {
    to: OWNER_EMAIL, replyTo: b.email, subject: `Novi sastanak: ${b.name}, ${b.company}`,
    html: wrap(`<p><b>Novi zakazan sastanak</b></p><table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="color:#6B6F78;vertical-align:top">${esc(k)}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table>`),
  };
}

export function reminderMail(b: BookingRow) {
  const de = b.lang === "de";
  const when = esc(fmtWhen(b.starts_at, b.lang, b.timezone));
  const cancel = `${SITE_URL}/otkazi?token=${b.cancel_token}`;
  return {
    to: b.email, replyTo: OWNER_EMAIL, ics: buildIcs(b),
    subject: de ? "Erinnerung: Erstgespräch morgen" : "Podsetnik: sastanak sutra",
    html: wrap(de
      ? `<p>Hallo ${esc(b.name)},</p><p>kurze Erinnerung an unser Gespräch:</p><p><b>${when}</b></p>${btn(b.zoom_join_url ?? "#", "Zoom beitreten")}<p><a href="${cancel}">Termin absagen</a></p>`
      : `<p>Zdravo ${esc(b.name)},</p><p>kratak podsetnik za naš sastanak:</p><p><b>${when}</b></p>${btn(b.zoom_join_url ?? "#", "Uđi na Zoom")}<p><a href="${cancel}">Otkaži sastanak</a></p>`),
  };
}

/** Cancels a confirmed booking, removes the Zoom meeting and notifies both sides. */
export async function cancelBookingRow(where: { id?: string; token?: string }, by: "customer" | "admin") {
  let q = supabaseAdmin.from("bookings").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("status", "confirmed");
  q = where.id ? q.eq("id", where.id) : q.eq("cancel_token", where.token!);
  const { data, error } = await q.select("*");
  if (error) throw new Error(error.message);
  const b = data?.[0] as BookingRow | undefined;
  if (!b) return null;
  if (b.zoom_meeting_id) await deleteZoomMeeting(b.zoom_meeting_id);
  const when = esc(fmtWhen(b.starts_at, b.lang, b.timezone));
  const de = b.lang === "de";
  await sendMail({
    to: b.email, replyTo: OWNER_EMAIL,
    subject: de ? "Termin abgesagt" : "Sastanak je otkazan",
    html: wrap(de ? `<p>Hallo ${esc(b.name)},</p><p>der Termin am <b>${when}</b> wurde abgesagt.</p>${btn(SITE_URL + "/#sastanak", "Neuen Termin wählen")}`
      : `<p>Zdravo ${esc(b.name)},</p><p>sastanak <b>${when}</b> je otkazan.</p>${btn(SITE_URL + "/#sastanak", "Izaberi novi termin")}`),
  });
  if (by === "customer") {
    await sendMail({ to: OWNER_EMAIL, subject: `Otkazan sastanak: ${b.name}, ${b.company}`, html: wrap(`<p>${esc(b.name)} (${esc(b.email)}) je otkazao sastanak ${esc(fmtWhen(b.starts_at, "sr", BASE_TZ))}.</p>`) });
  }
  return b;
}
