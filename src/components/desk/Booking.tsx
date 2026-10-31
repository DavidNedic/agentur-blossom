import { useEffect, useMemo, useState } from "react";
import { createBooking, getSlots } from "@/lib/booking.functions";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/i18n";
import { useDeskLang } from "./language";

const T = {
  sr: {
    h: "Besplatan sastanak.", lead: "30 minuta preko Zooma. Pričamo o tvom poslu i ciljevima, bez obaveze.",
    s1: "01  termin", s2: "02  tvoji podaci", s3: "potvrđeno",
    optional: "Dodaj telefon (nije obavezno)", change: "Promeni termin", next: "Slobodni termini", retry: "Pokušaj ponovo", whatsapp: "Piši na WhatsApp", reassurance: "Besplatno. Bez obaveze. Potvrda stiže e-mailom.",
    tz: (z: string) => `Vremena su u tvojoj vremenskoj zoni (${z}).`, loading: "Učitavam slobodne termine...",
    none: "Trenutno nema slobodnih termina. Javi se na WhatsApp.", err: "Termini trenutno ne mogu da se učitaju.",
    pickDay: "Izaberi dan.", noSlots: "nema termina", slots: (n: number) => `${n} ${n === 1 ? "termin" : "termina"}`,
    name: "Ime i prezime", company: "Firma", email: "E-mail", phone: "Telefon (nije obavezno)",
    msg: "Šta radiš i šta želiš da postigneš?", privacy: "Slažem se da se moji podaci koriste samo za ovaj sastanak.",
    back: "Nazad", book: "Zakaži sastanak", sending: "Zakazujem...",
    done: "Vidimo se.", doneLead: "Potvrda i pozivnica za kalendar su na tvom e-mailu.", zoom: "Uđi na Zoom",
    e: { slot_taken: "Taj termin je upravo zauzet. Izaberi drugi.", rate_limited: "Previše pokušaja. Pokušaj kasnije ili se javi na WhatsApp.", unavailable: "Zakazivanje trenutno ne radi. Javi se na WhatsApp.", invalid: "Proveri polja." },
    locale: "sr-Latn-RS",
  },
  de: {
    h: "Kostenloses Erstgespräch.", lead: "30 Minuten per Zoom. Wir sprechen über dein Geschäft und deine Ziele, unverbindlich.",
    s1: "01  Termin", s2: "02  Deine Angaben", s3: "bestätigt",
    optional: "Telefon hinzufügen (optional)", change: "Termin ändern", next: "Freie Termine", retry: "Erneut versuchen", whatsapp: "Auf WhatsApp schreiben", reassurance: "Kostenlos. Unverbindlich. Bestätigung per E-Mail.",
    tz: (z: string) => `Zeiten in deiner Zeitzone (${z}).`, loading: "Lade freie Termine...",
    none: "Gerade keine freien Termine. Schreib mir auf WhatsApp.", err: "Termine können gerade nicht geladen werden.",
    pickDay: "Wähle einen Tag.", noSlots: "keine Termine", slots: (n: number) => `${n} ${n === 1 ? "Termin" : "Termine"}`,
    name: "Name", company: "Firma", email: "E-Mail", phone: "Telefon (optional)",
    msg: "Was machst du und was willst du erreichen?", privacy: "Ich bin einverstanden, dass meine Daten nur für diesen Termin genutzt werden.",
    back: "Zurück", book: "Termin buchen", sending: "Buche...",
    done: "Bis bald.", doneLead: "Bestätigung und Kalendereinladung sind in deinem Postfach.", zoom: "Zoom beitreten",
    e: { slot_taken: "Dieser Termin wurde gerade vergeben. Bitte wähle einen anderen.", rate_limited: "Zu viele Versuche. Bitte später erneut oder per WhatsApp.", unavailable: "Buchung gerade nicht möglich. Schreib mir auf WhatsApp.", invalid: "Bitte Felder prüfen." },
    locale: "de-DE",
  },
};

const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function Booking({ headingId }: { headingId: string }) {
  const { lang, setLang } = useDeskLang();
  const t = T[lang];
  const [tz, setTz] = useState("Europe/Belgrade");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [loadErr, setLoadErr] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", message: "", privacy: false });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<{ startsAt: string; zoomUrl: string } | null>(null);

  const load = () => {
    setSlots(null); setLoadErr(false);
    getSlots().then((r) => { setSlots(r.slots); setLoadErr(!r.ok); }).catch(() => { setSlots([]); setLoadErr(true); });
  };
  useEffect(() => {
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Belgrade");
    load();
  }, []);

  const days = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of slots ?? []) { const k = dayKey(new Date(s)); map.set(k, [...(map.get(k) ?? []), s]); }
    const out: { key: string; date: Date; slots: string[] }[] = [];
    const base = new Date(); base.setHours(12, 0, 0, 0);
    for (let i = 0; i < 22; i++) { const d = new Date(base); d.setDate(base.getDate() + i); const k = dayKey(d); out.push({ key: k, date: d, slots: map.get(k) ?? [] }); }
    return out.filter((d, i) => i < 21 || d.slots.length);
  }, [slots]);
  const daySlots = days.find((d) => d.key === day)?.slots ?? [];

  useEffect(() => {
    if (!day && slots?.length) setDay(dayKey(new Date(slots[0])));
  }, [slots, day]);

  useEffect(() => {
    if (step === 2) document.querySelector<HTMLInputElement>(".bk-form input[name=name]")?.focus({ preventScroll: true });
  }, [step]);

  const fmtDay = (d: Date) => new Intl.DateTimeFormat(t.locale, { weekday: "short" }).format(d);
  const fmtTime = (s: string) => new Intl.DateTimeFormat(t.locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(s));
  const fmtLong = (s: string) => new Intl.DateTimeFormat(t.locale, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(s));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot || !form.privacy) return;
    setBusy(true); setErr(null);
    try {
      const r = await createBooking({ data: { ...form, privacy: true, slot, lang, timezone: tz } });
      if (r.ok) { setDone(r); setStep(3); }
      else { setErr(t.e[r.error]); if (r.error === "slot_taken") { setSlot(null); setStep(1); load(); } }
    } catch { setErr(t.e.invalid); }
    setBusy(false);
  };
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: k === "privacy" ? (e.target as HTMLInputElement).checked : e.target.value }));

  return (
    <div className="sh paper bk">
      <div className="bk-lang" role="group" aria-label="Jezik / Sprache">
        <Button variant="ghost" type="button" aria-pressed={lang === "sr"} onClick={() => setLang("sr")}>SR</Button>
        <Button variant="ghost" type="button" aria-pressed={lang === "de"} onClick={() => setLang("de")}>DE</Button>
      </div>
      <h2 id={headingId}>{step === 3 ? t.done : t.h}</h2>
      <p className="lead">{step === 3 ? t.doneLead : t.lead}</p>
      {step !== 3 && <ol className="bk-steps" aria-label={lang === "de" ? "Schritte" : "Koraci"}>
        {[t.s1, t.s2].map((s, i) => <li key={s} aria-current={step === i + 1 ? "step" : undefined}>{s}</li>)}
      </ol>}

      {step === 1 && (
        <div className="bk-pick">
          <p className="bk-note">{t.tz(tz)}</p>
          {slots === null ? <p className="bk-note">{t.loading}</p>
            : loadErr ? <div><p className="bk-err" role="alert">{t.err}</p><Button variant="outline" className="bk-back" onClick={load}>{t.retry}</Button><a className="bk-help" href={`https://wa.me/${CONTACT.wa}`} target="_blank" rel="noopener noreferrer">{t.whatsapp}</a></div>
            : slots.length === 0 ? <div><p className="bk-err">{t.none}</p><a className="bk-help" href={`https://wa.me/${CONTACT.wa}`} target="_blank" rel="noopener noreferrer">{t.whatsapp}</a></div>
            : (
              <>
                <div className="bk-days" role="listbox" aria-label={t.pickDay}>
                  {days.map((d) => (
                    <Button variant="ghost" type="button" key={d.key} role="option" aria-label={`${d.date.toLocaleDateString(t.locale, { weekday: "long", day: "numeric", month: "long" })}, ${t.slots(d.slots.length)}`} aria-selected={day === d.key} disabled={!d.slots.length}
                      onClick={() => { setDay(d.key); setSlot(null); }}>
                      <small>{fmtDay(d.date)}</small><b>{d.date.getDate()}.{d.date.getMonth() + 1}.</b>
                    </Button>
                  ))}
                </div>
                {day ? (
                  <div className="bk-times">
                    <p className="bk-time-label">{t.next}</p>
                    {daySlots.map((s) => (
                      <Button variant="ghost" type="button" key={s} aria-pressed={slot === s} onClick={() => { setSlot(s); setStep(2); setErr(null); }}>{fmtTime(s)}</Button>
                    ))}
                  </div>
                ) : <p className="bk-note">{t.pickDay}</p>}
              </>
            )}
          {err && <p className="bk-err" role="alert">{err}</p>}
        </div>
      )}

      {step === 2 && slot && (
        <form className="bk-form" onSubmit={submit}>
          <div className="bk-summary wide"><p className="bk-when"><b>{fmtLong(slot)}</b><span>{tz} / Zoom / 30 min</span></p><Button variant="ghost" type="button" className="bk-change" onClick={() => setStep(1)}>{t.change}</Button></div>
          <label>{t.name}<input name="name" required minLength={2} maxLength={100} value={form.name} onChange={set("name")} autoComplete="name" /></label>
          <label>{t.company}<input required maxLength={120} value={form.company} onChange={set("company")} autoComplete="organization" /></label>
          <label className="wide">{t.email}<input required type="email" maxLength={200} value={form.email} onChange={set("email")} autoComplete="email" /></label>
          <label className="wide">{t.msg}<textarea required minLength={5} maxLength={1000} rows={2} value={form.message} onChange={set("message")} /></label>
          <details className="wide bk-optional"><summary>{t.optional}</summary><label>{t.phone}<input type="tel" maxLength={40} value={form.phone} onChange={set("phone")} autoComplete="tel" /></label></details>
          <label className="wide chk"><input type="checkbox" required checked={form.privacy} onChange={set("privacy")} /><span>{t.privacy}</span></label>
          {err && <p className="bk-err wide" role="alert">{err}</p>}
          <div className="wide bk-act">
            <Button type="submit" className="btn" disabled={busy || !form.privacy}>{busy ? t.sending : t.book}<span aria-hidden="true">↗</span></Button>
            <p className="bk-reassurance">{t.reassurance}</p>
          </div>
        </form>
      )}

      {step === 3 && done && (
        <div className="bk-done">
          <p className="bk-when"><b>{fmtLong(done.startsAt)}</b> <span>({tz})</span></p>
          <p className="bk-note">Zoom: <a href={done.zoomUrl} target="_blank" rel="noopener noreferrer">{done.zoomUrl}</a></p>
          <a className="btn" href={done.zoomUrl} target="_blank" rel="noopener noreferrer">{t.zoom}</a>
        </div>
      )}
    </div>
  );
}
