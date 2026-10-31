import { BASE_TZ } from "./booking-slots";

export const SITE_URL = "https://promet.digital";
export const OWNER_EMAIL = "davidnedic@web.de";

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

