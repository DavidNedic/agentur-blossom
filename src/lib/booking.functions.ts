import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getSlots = createServerFn({ method: "GET" }).handler(async () => {
  const { availableSlots } = await import("@/server/booking.server");
  try {
    const slots = await availableSlots();
    return { ok: true as const, slots: slots.map((s) => new Date(s).toISOString()) };
  } catch (e) {
    console.error("[booking] getSlots failed:", e);
    return { ok: false as const, slots: [] as string[] };
  }
});

const BookingInput = z.object({
  slot: z.string().datetime(),
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(5).max(1000),
  privacy: z.literal(true),
  lang: z.enum(["sr", "de"]),
  timezone: z.string().max(64),
});

export type BookingResult =
  | { ok: true; startsAt: string; zoomUrl: string }
  | { ok: false; error: "slot_taken" | "rate_limited" | "unavailable" | "invalid" };

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => BookingInput.parse(d))
  .handler(async ({ data }): Promise<BookingResult> => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const srv = await import("@/server/booking.server");

    // Ad-hoc rate limit: per client IP (hashed) and per email.
    const req = getRequest();
    const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`promet:${ip}`));
    const clientKey = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
    const hourAgo = new Date(Date.now() - 3_600_000).toISOString();
    const [byIp, byEmail] = await Promise.all([
      supabaseAdmin.from("bookings").select("id", { count: "exact", head: true }).eq("client_key", clientKey).gte("created_at", hourAgo),
      supabaseAdmin.from("bookings").select("id", { count: "exact", head: true }).ilike("email", data.email).eq("status", "confirmed").gte("starts_at", new Date().toISOString()),
    ]);
    if ((byIp.count ?? 0) >= 3 || (byEmail.count ?? 0) >= 2) {
      console.warn("[booking] Rate limit hit", { clientKey, email: data.email });
      return { ok: false, error: "rate_limited" };
    }

    if (srv.zoomMissing()) return { ok: false, error: "unavailable" };

    // Re-check the slot server-side.
    const start = Date.parse(data.slot);
    const slots = await srv.availableSlots();
    if (!slots.includes(start)) return { ok: false, error: "slot_taken" };

    let tz = data.timezone;
    try { new Intl.DateTimeFormat("en", { timeZone: tz }); } catch { tz = "Europe/Belgrade"; }

    const { data: row, error } = await supabaseAdmin.from("bookings").insert({
      starts_at: new Date(start).toISOString(), ends_at: new Date(start + 30 * 60_000).toISOString(),
      name: data.name, company: data.company, email: data.email, phone: data.phone || null, message: data.message,
      lang: data.lang, timezone: tz, client_key: clientKey,
    }).select("*").single();
    if (error || !row) {
      if (error?.code === "23505") return { ok: false, error: "slot_taken" };
      console.error("[booking] insert failed:", error);
      return { ok: false, error: "unavailable" };
    }

    let zoom: { id: string; joinUrl: string };
    try {
      zoom = await srv.createZoomMeeting(start, `Promet Digital: ${data.name}, ${data.company}`);
    } catch (e) {
      console.error("[booking]", e);
      await supabaseAdmin.from("bookings").delete().eq("id", row.id);
      return { ok: false, error: "unavailable" };
    }
    const { data: full } = await supabaseAdmin.from("bookings")
      .update({ zoom_join_url: zoom.joinUrl, zoom_meeting_id: zoom.id }).eq("id", row.id).select("*").single();
    const b = (full ?? { ...row, zoom_join_url: zoom.joinUrl, zoom_meeting_id: zoom.id }) as import("@/server/booking.server").BookingRow;

    await Promise.all([srv.sendMail(srv.customerConfirmation(b)), srv.sendMail(srv.ownerNotification(b))]);
    return { ok: true, startsAt: b.starts_at, zoomUrl: zoom.joinUrl };
  });

export const cancelByToken = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ token: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { cancelBookingRow } = await import("@/server/booking.server");
    const b = await cancelBookingRow({ token: data.token }, "customer");
    return b ? { ok: true as const, startsAt: b.starts_at, lang: b.lang } : { ok: false as const };
  });

export const adminCancelBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { cancelBookingRow } = await import("@/server/booking.server");
    const b = await cancelBookingRow({ id: data.id }, "admin");
    return { ok: !!b };
  });
