// Server-only booking helpers: Google free/busy, Zoom, Lovable email, ICS, cancellation.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { BASE_TZ, DAYS_AHEAD, SLOT_MIN, computeSlots, type Interval } from "@/lib/booking-slots";

export const SITE_URL = "https://promet.digital";
export const OWNER_EMAIL = "davidnedic@web.de";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";
import type { BookingRow } from "@/lib/booking-email-data";
export { buildIcs, fmtWhen, type BookingRow } from "@/lib/booking-email-data";

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
type Mail = { to: string; template: string; booking: BookingRow; replyTo?: string };
export async function sendMail(m: Mail) {
  try {
    const result = await sendTemplateEmail(m.template, m.to, {
      templateData: { booking: m.booking },
      idempotencyKey: `${m.template}-${m.booking.id}`,
      replyTo: m.replyTo,
    });
    if (!result.sent) console.warn(`[booking] ${m.template}: recipient suppressed`);
    return result.sent;
  } catch (error) {
    console.error(`[booking] Lovable email failed (${m.template}):`, error);
    return false;
  }
}
export const customerConfirmation = (b: BookingRow): Mail => ({ to: b.email, replyTo: OWNER_EMAIL, template: "booking-confirmation", booking: b });
export const ownerNotification = (b: BookingRow): Mail => ({ to: OWNER_EMAIL, replyTo: b.email, template: "booking-notification", booking: b });
export const reminderMail = (b: BookingRow): Mail => ({ to: b.email, replyTo: OWNER_EMAIL, template: "booking-reminder", booking: b });

/** Cancels a confirmed booking, removes the Zoom meeting and notifies both sides. */
export async function cancelBookingRow(where: { id?: string; token?: string }, by: "customer" | "admin") {
  let q = supabaseAdmin.from("bookings").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("status", "confirmed");
  q = where.id ? q.eq("id", where.id) : q.eq("cancel_token", where.token!);
  const { data, error } = await q.select("*");
  if (error) throw new Error(error.message);
  const b = data?.[0] as BookingRow | undefined;
  if (!b) return null;
  if (b.zoom_meeting_id) await deleteZoomMeeting(b.zoom_meeting_id);
  await sendMail({ to: b.email, replyTo: OWNER_EMAIL, template: "booking-cancellation", booking: b });
  if (by === "customer") {
    await sendMail({ to: OWNER_EMAIL, template: "booking-owner-cancellation", booking: b });
  }
  return b;
}
