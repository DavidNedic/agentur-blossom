import { Link } from "@tanstack/react-router";
import { Booking } from "./Booking";
import { DeskLanguageProvider, LanguageSwitch, useDeskLang } from "./language";
import { CONTACT } from "@/lib/i18n";

const TALK: [string, string][] = [
  ["Šta radiš", "Tvoj posao, tvoji proizvodi ili usluge, i kako danas dolaze kupci."],
  ["Ko su tvoji kupci", "Ko kupuje, šta traže i gde te nalaze: Instagram, Google, preporuka."],
  ["Koji su tvoji ciljevi", "Više upita, online prodaja, manje posla oko rezervacija, novi kupci u Nemačkoj. Šta tačno treba da se promeni."],
  ["Šta je sledeći korak", "Posle sastanka dobijaš jasan plan i rok. Cena po dogovoru, bez obaveze."],
];

const STEPS: [string, string][] = [
  ["Sastanak", "Pričamo o tvom poslu, kupcima i ciljevima. Uživo ili online."],
  ["Plan i dogovor", "Šta pravimo, zašto i kad je gotovo. Cenu dogovaramo pre nego što išta počne."],
  ["Dizajn i izrada", "Sajt po meri tvoje firme, ne šablon. Vidiš ga u toku izrade i daješ povratne informacije."],
  ["Online za 14 dana", "Testiramo sve i puštamo. Domen, kod i podaci su tvoji."],
];

const num = (i: number) => String(i + 1).padStart(2, "0");

function Pointer() {
  return (
    <svg viewBox="-110 40 1550 1960" aria-hidden="true" focusable="false">
      <polygon points="420,560 507,1805 791,1504 1017,1941 1213,1842 996,1419 1370,1393" fill="#EDEEF0" stroke="#EDEEF0" strokeWidth="257" strokeLinejoin="round" />
      <polygon points="420,560 507,1805 791,1504 1017,1941 1213,1842 996,1419 1370,1393" fill="#3DDCFF" stroke="#3DDCFF" strokeWidth="70" strokeLinejoin="round" />
      <line x1="377" y1="314" x2="333" y2="68" stroke="#EDEEF0" strokeWidth="101" strokeLinecap="round" />
      <line x1="216" y1="417" x2="11" y2="274" stroke="#EDEEF0" strokeWidth="101" strokeLinecap="round" />
      <line x1="174" y1="603" x2="-72" y2="647" stroke="#EDEEF0" strokeWidth="101" strokeLinecap="round" />
    </svg>
  );
}

function PageBody() {
  const { t, lang } = useDeskLang();
  const waText = lang === "de" ? "Hallo, ich möchte einen Termin buchen." : "Zdravo, hteo bih da zakažem sastanak.";
  const wa = `https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(waText)}`;

  return (
    <div className="desk-root book-page">
      <header className="bp-top">
        <Link to="/" className="bp-brand" aria-label={t("Promet Digital")}>
          <Pointer />
          <b>promet</b>
          <i>Digital</i>
        </Link>
        <LanguageSwitch />
      </header>

      <main>
        <section className="bp-hero">
          <div className="bp-pitch">
            <p className="bp-kicker">{t("Prvi sastanak je besplatan.")}</p>
            <h1>{t("Zakaži sastanak.")}</h1>
            <p className="bp-lead">{t("30 minuta preko Zooma. Pričamo o tvom poslu, kupcima i ciljevima, bez obaveze.")}</p>
            <ul className="bp-facts">
              <li>{t("30 min")}</li>
              <li>{t("Zoom ili uživo")}</li>
              <li>{t("bez obaveze")}</li>
            </ul>
            <p className="bp-help">
              {t("Ne odgovara ti termin?")}{" "}
              <a href={wa} target="_blank" rel="noopener noreferrer">{t("Piši na WhatsApp")}</a>
            </p>
          </div>
          <div className="bp-planner">
            <Booking headingId="bp-planner-title" />
          </div>
        </section>

        <section className="bp-section">
          <div className="bp-inner">
            <h2 className="bp-h">{t("O čemu pričamo.")}</h2>
            <p className="bp-sub">{t("Pola sata, uživo u Zrenjaninu ili Beogradu, ili online. Prvi sastanak je besplatan.")}</p>
            <div className="bp-list">
              {TALK.map(([head, body], i) => (
                <div className="bp-row" key={head}>
                  <b>{num(i)}</b>
                  <div>
                    <h3>{t(head)}</h3>
                    <p>{t(body)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bp-section">
          <div className="bp-inner">
            <h2 className="bp-h">{t("Kako radimo.")}</h2>
            <div className="bp-steps">
              {STEPS.map(([head, body], i) => (
                <div className="bp-step" key={head}>
                  <span>{num(i)}</span>
                  <h3>{t(head)}</h3>
                  <p>{t(body)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bp-section">
          <div className="bp-inner bp-trust">
            <div>
              <span>{t("STRUČNO ZVANJE, NEMAČKA")}</span>
              <b>Kaufmann für E-Commerce (IHK)</b>
            </div>
            <div>
              <span>{t("od sastanka do lansiranja")}</span>
              <b>{t("Online za 14 dana")}</b>
            </div>
            <div>
              <span>{t("kod i domen")}</span>
              <b>{t("tvoje")}</b>
            </div>
          </div>
        </section>

        <footer className="bp-foot">
          <div className="bp-inner">
            <h2 className="bp-h">{t("Javi se.")}</h2>
            <div className="bp-contact">
              <div>
                <span>{t("WhatsApp i telefon")}</span>
                <b><a href={wa} target="_blank" rel="noopener noreferrer">{CONTACT.phone}</a></b>
              </div>
              <div>
                <span>{t("E-mail")}</span>
                <b><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></b>
              </div>
              <div>
                <span>{t("Gde smo")}</span>
                <b>{t("Zrenjanin / Beograd")}</b>
              </div>
            </div>
            <Link to="/" className="bp-back">
              {t("Nazad na sto")} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

export function BookingPage() {
  return (
    <DeskLanguageProvider>
      <PageBody />
    </DeskLanguageProvider>
  );
}
