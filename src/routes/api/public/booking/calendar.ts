import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { buildIcs, type BookingRow } from '@/lib/booking-email-data';

export const Route = createFileRoute('/api/public/booking/calendar')({
  server: { handlers: { GET: async ({ request }) => {
    const token = z.string().uuid().safeParse(new URL(request.url).searchParams.get('token'));
    if (!token.success) return new Response('Invalid link', { status: 400 });
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data, error } = await supabaseAdmin.from('bookings').select('*').eq('cancel_token', token.data).eq('status', 'confirmed').maybeSingle();
    if (error || !data) return new Response('Calendar unavailable', { status: 404 });
    return new Response(buildIcs(data as BookingRow), { headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="sastanak.ics"',
      'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer',
    } });
  } } },
});