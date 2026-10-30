import { useEffect, useMemo, useState } from "react";
import { createBooking, getSlots } from "@/lib/booking.functions";

type Lang = "sr" | "de";
const T = {
  sr: {
    h: "Besplatan sastanak.", lead: "30 minuta preko Zooma. Pričamo o tvom poslu i ciljevima, bez obaveze.",
    s1: "1  dan i termin", s2: "2  o tebi", s3: "3  potvrda",
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
    s1: "1  Tag und Uhrzeit", s2: "2  über dich", s3: "3  Bestätigung",
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
  const [lang, setLang] = useState<Lang>("sr");
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
    try { if (localStorage.getItem("promet-booking-lang") === "de") setLang("de"); } catch { /* ignore */ }
    load();
  }, []);
  const switchLang = (l: Lang) => { setLang(l); try { localStorage.setItem("promet-booking-lang", l); } catch { /* ignore */ } };

  const days = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const s of slots ?? []) { const k = dayKey(new Date(s)); map.set(k, [...(map.get(k) ?? []), s]); }
    const out: { key: string; date: Date; slots: string[] }[] = [];
    const base = new Date(); base.setHours(12, 0, 0, 0);
    for (let i = 0; i < 22; i++) { const d = new Date(base); d.setDate(base.getDate() + i); const k = dayKey(d); out.push({ key: k, date: d, slots: map.get(k) ?? [] }); }
    return out.filter((d, i) => i < 21 || d.slots.length);
  }, [slots]);
  const daySlots = days.find((d) => d.key === day)?.slots ?? [];

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
        <button type="button" aria-pressed={lang === "sr"} onClick={() => switchLang("sr")}>SR</button>
        <button type="button" aria-pressed={lang === "de"} onClick={() => switchLang("de")}>DE</button>
      </div>
      <h2 id={headingId}>{step === 3 ? t.done : t.h}</h2>
      <p className="lead">{step === 3 ? t.doneLead : t.lead}</p>
      <ol className="bk-steps" aria-label="Koraci">
        {[t.s1, t.s2, t.s3].map((s, i) => <li key={s} aria-current={step === i + 1 ? "step" : undefined}>{s}</li>)}
      </ol>

      {step === 1 && (
        <div className="bk-pick">
          <p className="bk-note">{t.tz(tz)}</p>
          {slots === null ? <p className="bk-note">{t.loading}</p>
            : loadErr ? <p className="bk-err">{t.err}</p>
            : slots.length === 0 ? <p className="bk-err">{t.none}</p>
            : (
              <>
                <div className="bk-days" role="listbox" aria-label={t.pickDay}>
                  {days.map((d) => (
                    <button type="button" key={d.key} role="option" aria-selected={day === d.key} disabled={!d.slots.length}
                      onClick={() => { setDay(d.key); setSlot(null); }}>
                      <small>{fmtDay(d.date)}</small><b>{d.date.getDate()}.{d.date.getMonth() + 1}.</b>
                      <i>{d.slots.length ? t.slots(d.slots.length) : t.noSlots}</i>
                    </button>
                  ))}
                </div>
                {day ? (
                  <div className="bk-times">
                    {daySlots.map((s) => (
                      <button type="button" key={s} aria-pressed={slot === s} onClick={() => { setSlot(s); setStep(2); setErr(null); }}>{fmtTime(s)}</button>
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
          <p className="bk-when"><b>{fmtLong(slot)}</b> <span>({tz})</span></p>
          <label>{t.name}<input required minLength={2} maxLength={100} value={form.name} onChange={set("name")} autoComplete="name" /></label>
          <label>{t.company}<input required maxLength={120} value={form.company} onChange={set("company")} autoComplete="organization" /></label>
          <label>{t.email}<input required type="email" maxLength={200} value={form.email} onChange={set("email")} autoComplete="email" /></label>
          <label>{t.phone}<input type="tel" maxLength={40} value={form.phone} onChange={set("phone")} autoComplete="tel" /></label>
          <label className="wide">{t.msg}<textarea required minLength={5} maxLength={1000} rows={3} value={form.message} onChange={set("message")} /></label>
          <label className="wide chk"><input type="checkbox" required checked={form.privacy} onChange={set("privacy")} /><span>{t.privacy}</span></label>
          {err && <p className="bk-err wide" role="alert">{err}</p>}
          <div className="wide bk-act">
            <button type="button" className="bk-back" onClick={() => setStep(1)}>{t.back}</button>
            <button type="submit" className="btn" disabled={busy || !form.privacy}>{busy ? t.sending : t.book}</button>
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
