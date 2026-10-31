import React from 'react';
import { Html, Head, Body, Container, Text, Button, Link, Preview, Section } from '@react-email/components';
import type { TemplateEntry } from './registry';
import { fmtWhen, SITE_URL, OWNER_EMAIL, type BookingRow } from '../booking-email-data';
import { BASE_TZ } from '../booking-slots';

type Kind = 'confirmation' | 'notification' | 'reminder' | 'cancellation' | 'owner-cancellation';
interface Props { booking?: BookingRow; kind?: Kind }
export function bookingSubject(b: BookingRow | undefined, kind: Kind) {
  const de = b?.lang === 'de';
  if (kind === 'confirmation') return de ? 'Termin bestätigt: kostenloses Erstgespräch' : 'Sastanak je zakazan';
  if (kind === 'reminder') return de ? 'Erinnerung: Erstgespräch morgen' : 'Podsetnik: sastanak sutra';
  if (kind === 'cancellation') return de ? 'Termin abgesagt' : 'Sastanak je otkazan';
  return `${kind === 'notification' ? (de ? 'Neuer Termin' : 'Novi sastanak') : (de ? 'Termin abgesagt' : 'Otkazan sastanak')}: ${b?.name ?? ''}, ${b?.company ?? ''}`;
}
function BookingEmail({ booking: b, kind = 'confirmation' }: Props) {
  const de = b?.lang === 'de';
  const when = b ? fmtWhen(b.starts_at, b.lang, b.timezone) : '';
  const cancel = `${SITE_URL}/otkazi?token=${encodeURIComponent(b?.cancel_token ?? '')}`;
  const calendar = `${SITE_URL}/api/public/booking/calendar?token=${encodeURIComponent(b?.cancel_token ?? '')}`;
  const owner = kind === 'notification' || kind === 'owner-cancellation';
  const rows = b ? [
    [de ? 'Termin' : 'Termin', fmtWhen(b.starts_at, b.lang, BASE_TZ)],
    [de ? 'Name' : 'Ime', b.name], [de ? 'Firma' : 'Firma', b.company], ['E-mail', b.email],
    [de ? 'Telefon' : 'Telefon', b.phone || '-'], [de ? 'Sprache' : 'Jezik', b.lang.toUpperCase()],
    [de ? 'Zeitzone des Besuchers' : 'Vremenska zona posetioca', b.timezone],
    [de ? 'Tätigkeit und Anliegen' : 'Šta radi i šta želi', b.message], ['Zoom', b.zoom_join_url ?? '-'],
  ] : [];
  return <Html lang={de ? 'de' : 'sr-Latn'}><Head /><Preview>{bookingSubject(b, kind)}</Preview>
    <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Arial,sans-serif', margin: 0 }}>
      <Container style={{ maxWidth: 560, padding: '28px 24px', color: '#17181C', fontSize: 15, lineHeight: '1.6' }}>
        {owner ? <>
          <Text><strong>{kind === 'notification' ? (de ? 'Neuer bestätigter Termin' : 'Novi zakazan sastanak') : bookingSubject(b, kind)}</strong></Text>
          {kind === 'notification' ? <Section><table cellPadding={6} style={{ borderCollapse: 'collapse' }}><tbody>{rows.map(([label, value]) => <tr key={label}><td style={{ color: '#6B6F78', verticalAlign: 'top' }}>{label}</td><td style={{ whiteSpace: 'pre-wrap' }}>{value}</td></tr>)}</tbody></table></Section> : <Text>{b?.name} ({b?.email}) {de ? 'hat den Termin abgesagt' : 'je otkazao sastanak'} {b ? fmtWhen(b.starts_at, b.lang, BASE_TZ) : ''}.</Text>}
        </> : <>
          <Text>{de ? 'Hallo' : 'Zdravo'} {b?.name},</Text>
          <Text>{kind === 'confirmation' ? (de ? 'dein kostenloses Erstgespräch (30 Min., Zoom) ist bestätigt:' : 'tvoj besplatan sastanak (30 min, Zoom) je zakazan:') : kind === 'reminder' ? (de ? 'kurze Erinnerung an unser Gespräch:' : 'kratak podsetnik za naš sastanak:') : (de ? 'Der folgende Termin wurde abgesagt:' : 'Sledeći sastanak je otkazan:')}</Text>
          <Text><strong>{when}</strong></Text>
          {kind === 'cancellation' ? <Button href={SITE_URL + '/#sastanak'} style={button}>{de ? 'Neuen Termin wählen' : 'Izaberi novi termin'}</Button> : <>
            <Button href={b?.zoom_join_url ?? SITE_URL} style={button}>{de ? 'Zoom beitreten' : 'Uđi na Zoom'}</Button>
            <Text><Link href={calendar}>{de ? 'Termin für deinen Kalender herunterladen (.ics)' : 'Preuzmi termin za svoj kalendar (.ics)'}</Link></Text>
            <Text>{kind === 'confirmation' ? (de ? 'Doch keine Zeit? ' : 'Ne stižeš? ') : ''}<Link href={cancel}>{de ? 'Termin absagen' : 'Otkaži sastanak'}</Link></Text>
            {kind === 'confirmation' && <Text>{de ? 'Bis bald,' : 'Vidimo se,'}<br />David Nedić</Text>}
          </>}
        </>}
        <Text style={{ color: '#6B6F78', fontSize: 13, marginTop: 28 }}>Promet Digital, Zrenjanin / Beograd<br />promet.digital</Text>
      </Container>
    </Body></Html>;
}
const button = { display: 'inline-block', backgroundColor: '#3DDCFF', color: '#17181C', padding: '12px 18px', textDecoration: 'none', fontWeight: 'bold' } as const;
const entry = (kind: Kind, to?: string): TemplateEntry => ({
  component: (props: Props) => <BookingEmail {...props} kind={kind} />,
  subject: (data) => bookingSubject(data.booking, kind),
  displayName: `Promet: ${kind}`, ...(to ? { to } : {}),
});
export const template = entry('confirmation');
export const notification = entry('notification', OWNER_EMAIL);
export const reminder = entry('reminder');
export const cancellation = entry('cancellation');
export const ownerCancellation = entry('owner-cancellation', OWNER_EMAIL);