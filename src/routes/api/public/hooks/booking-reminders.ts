import { createFileRoute } from "@tanstack/react-router";

// Hourly cron. Idempotent: each booking gets at most one reminder (reminder_sent flag is claimed before sending).
export const Route = createFileRoute("/api/public/hooks/booking-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendMail, reminderMail } = await import("@/server/booking.server");
        const now = Date.now();
        const { data, error } = await supabaseAdmin.from("bookings")
          .update({ reminder_sent: true })
          .eq("status", "confirmed").eq("reminder_sent", false)
          .gte("starts_at", new Date(now + 20 * 3_600_000).toISOString())
          .lte("starts_at", new Date(now + 25 * 3_600_000).toISOString())
          .select("*");
        if (error) { console.error("[booking] reminder query failed:", error); return Response.json({ ok: false }, { status: 500 }); }
        let sent = 0;
        for (const b of data ?? []) if (await sendMail(reminderMail(b as never))) sent++;
        return Response.json({ ok: true, due: data?.length ?? 0, sent });
      },
    },
  },
});
