import { describe, expect, it, vi } from 'vitest';
import { render } from '@react-email/render';
import React from 'react';
import { buildIcs, type BookingRow } from './booking-email-data';
import { TEMPLATES } from './email-templates/registry';
import { sendTemplateEmail } from './email-templates/send-email';
const send = vi.hoisted(() => vi.fn().mockResolvedValue({}));
vi.mock('@lovable.dev/email-js', () => ({ sendLovableEmail: send, EmailAPIError: class extends Error {} }));
const booking: BookingRow = {
  id: '19b875ac-c421-4ef4-9c73-1c3bc770dcbf', starts_at: '2026-11-03T09:00:00Z', ends_at: '2026-11-03T09:30:00Z',
  name: 'Čedomir Nedić', company: 'Žito', email: 'customer@example.com', phone: '+381620000000', message: 'Prodavnica šćžđ',
  lang: 'sr', timezone: 'Europe/Berlin', zoom_join_url: 'https://zoom.us/j/123', zoom_meeting_id: '123',
  cancel_token: '9c6d1889-cbb8-4f8d-bc39-89f36c81a372', status: 'confirmed',
};
describe('booking email delivery', () => {
  it('sends from Promet at sastanak@promet.digital using appointment.promet.digital', async () => {
    vi.stubEnv('LOVABLE_API_KEY', 'unit-test-only');
    await sendTemplateEmail('booking-confirmation', booking.email, { templateData: { booking }, idempotencyKey: `booking-confirmation-${booking.id}` });
    expect(send.mock.calls.at(-1)?.[0]).toMatchObject({ from: { name: 'Promet', address: 'sastanak@promet.digital' }, sender_domain: 'appointment.promet.digital', idempotency_key: `booking-confirmation-${booking.id}` });
    vi.unstubAllEnvs();
  });
  it('preserves the 30-minute calendar event and Zoom URL', () => {
    const ics = buildIcs(booking);
    expect(ics).toContain('DTSTART:20261103T090000Z');
    expect(ics).toContain('DTEND:20261103T093000Z');
    expect(ics).toContain('LOCATION:https://zoom.us/j/123');
  });
  it('uses the customer timezone and protected calendar and cancellation links', async () => {
    const t = TEMPLATES['booking-confirmation'];
    const html = await render(React.createElement(t.component, { booking }));
    expect(html).toContain('10:00 (Europe/Berlin)');
    expect(html).toContain(`https://promet.digital/otkazi?token=${booking.cancel_token}`);
    expect(html).toContain(`https://promet.digital/api/public/booking/calendar?token=${booking.cancel_token}`);
    expect(html).toContain(booking.zoom_join_url);
  });
  it('localizes customer subjects for Serbian and German', () => {
    const t = TEMPLATES['booking-confirmation'];
    if (typeof t.subject !== 'function') throw new Error('Dynamic subject required');
    expect(t.subject({ booking })).toBe('Sastanak je zakazan');
    expect(t.subject({ booking: { ...booking, lang: 'de' } })).toBe('Termin bestätigt: kostenloses Erstgespräch');
  });
  it('routes the full form notification only to davidnedic@web.de', async () => {
    const t = TEMPLATES['booking-notification'];
    expect(t.to).toBe('davidnedic@web.de');
    const html = await render(React.createElement(t.component, { booking }));
    for (const value of [booking.name, booking.company, booking.email, booking.phone, booking.message, booking.timezone]) expect(html).toContain(value);
  });
});