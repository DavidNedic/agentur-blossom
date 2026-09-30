import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import unearthed from "@/assets/portfolio-unearthed.webp";
import unearthedAvif from "@/assets/portfolio-unearthed.avif";
import adriaticum from "@/assets/portfolio-adriaticum.webp";
import adriaticumAvif from "@/assets/portfolio-adriaticum.avif";
import crowdplay from "@/assets/portfolio-crowdplay.webp";
import crowdplayAvif from "@/assets/portfolio-crowdplay.avif";
import sara from "@/assets/portfolio-sara.webp";
import saraAvif from "@/assets/portfolio-sara.avif";

export type Lang = "sr" | "en";

export const CONTACT = {
  phone: "+381 62 101 5707",
  tel: "+381621015707",
  wa: "381621015707",
  email: "davidnedic@web.de",
};

export const IMAGES = {
  unearthed: { webp: unearthed, avif: unearthedAvif, width: 1366, height: 768 },
  adriaticum: { webp: adriaticum, avif: adriaticumAvif, width: 1600, height: 900 },
  crowdplay: { webp: crowdplay, avif: crowdplayAvif, width: 1600, height: 769 },
  sara: { webp: sara, avif: saraAvif, width: 1600, height: 733 },
};

type Bi<T> = { sr: T; en: T };

const projects = [
  { name: "Unearthed Samples", url: "unearthed-samples.com", image: IMAGES.unearthed, year: "2025", stack: "Shopify · Stripe · Meta Pixel",
    type: { sr: "Online prodavnica", en: "Online store" },
    desc: { sr: "Prodavnica sa integrisanim plaćanjem, brza na mobilnom i građena za konverziju.", en: "Store with integrated checkout, fast on mobile and built for conversion." } },
  { name: "Adriaticum", url: "adriaticum.rentals", image: IMAGES.adriaticum, year: "2026", stack: "React · Booking · WhatsApp",
    type: { sr: "Booking platforma", en: "Booking platform" },
    desc: { sr: "Iznajmljivanje opreme za događaje. Vođeni upitnik u nekoliko koraka, katalog i direktna rezervacija.", en: "Event equipment rental. A guided multi-step request flow, catalogue and direct booking." } },
  { name: "CrowdPlay", url: "crowdplay.eu", image: IMAGES.crowdplay, year: "2025", stack: "React · Node · Integracije",
    type: { sr: "Web aplikacija", en: "Web application" },
    desc: { sr: "Kompletna web aplikacija sa integracijama, skalabilna i građena po meri klijenta.", en: "Full web application with integrations, scalable and built to the client's spec." } },
  { name: "Sarastra", url: "sarastra-marketing.com", image: IMAGES.sara, year: "2024", stack: "Web · SEO · Brending",
    type: { sr: "Poslovni sajt", en: "Business site" },
    desc: { sr: "Poslovni sajt optimizovan za SEO, koji predstavlja brend jasno i brzo.", en: "Business site optimised for SEO that presents the brand clearly and fast." } },
];

const dict = {
  nav: {
    links: { sr: [["Radovi", "#radovi"], ["Usluge", "#usluge"], ["Proces", "#proces"], ["Paketi", "#paketi"], ["FAQ", "#faq"]], en: [["Work", "#radovi"], ["Services", "#usluge"], ["Process", "#proces"], ["Packages", "#paketi"], ["FAQ", "#faq"]] } as Bi<[string, string][]>,
    cta: { sr: "Zakaži konsultaciju", en: "Book a call" },
    menu: { sr: "Meni", en: "Menu" },
    close: { sr: "Zatvori", en: "Close" },
  },
  hero: {
    lines: { sr: ["Od SaaS", "sistema do", "e-commerce", "prodaje."], en: ["From SaaS", "systems to", "e-commerce", "sales."] },
    meta: { sr: ["01 / Digitalni partner", "Kaufmann für E-Commerce · DE / RS", "Zrenjanin / Beograd"], en: ["01 / Digital partner", "Kaufmann für E-Commerce · DE / RS", "Zrenjanin / Belgrade"] },
    sub: { sr: "Razvijamo softver, online prodavnice, sajtove i prodajne sisteme. Od prve specifikacije do merljivog rezultata.", en: "We build software, online stores, websites and sales systems. From the first specification to measurable results." },
    trust: { sr: "Nemačka stručna kvalifikacija. Iskustvo na nemačkom i srpskom tržištu.", en: "German vocational qualification. Experience in the German and Serbian markets." },
    scroll: { sr: "Skroluj", en: "Scroll" },
  },
  marquee: { sr: ["SaaS sistemi", "E-commerce", "Online prodaja", "Sajtovi", "SEO", "Automatizacija"], en: ["SaaS systems", "E-commerce", "Online sales", "Websites", "SEO", "Automation"] },
  manifesto: {
    label: { sr: "02 / Manifest", en: "02 / Manifesto" },
    text: {
      sr: "Lep sajt koji ne prodaje je trošak. Mi gradimo prodavnice koje mere svaki klik, vraćaju napuštene korpe i pune kalendar porudžbinama. Ti poseduješ sve: kod, domen, podatke. Bez avansa, bez skrivenih troškova, sa direktnom linijom preko WhatsApp-a.",
      en: "A beautiful site that does not sell is a cost. We build stores that measure every click, recover abandoned carts and fill your calendar with orders. You own everything: code, domain, data. No upfront payment, no hidden fees, a direct line over WhatsApp.",
    },
  },
  work: {
    label: { sr: "03 / Izabrani radovi", en: "03 / Selected work" },
    title: { sr: "Radovi", en: "Work" },
    count: { sr: "4 projekta", en: "4 projects" },
    projects,
  },
  services: {
    label: { sr: "04 / Usluge", en: "04 / Services" },
    title: { sr: "Šta radimo", en: "What we do" },
    intro: { sr: "Jedan partner za softver, prodaju i svakodnevni digitalni rad.", en: "One partner for software, sales and everyday digital operations." },
    items: {
      sr: [
        { t: "SaaS i softverski sistemi", d: "Booking i rental sistemi, CRM rešenja, interni alati i dashboard-i napravljeni prema stvarnom procesu firme.", example: "Adriaticum · CrowdPlay", del: ["Specifikacija i UX", "Korisničke uloge", "Integracije i automatizacija", "Održavanje i razvoj"] },
        { t: "E-commerce izrada", d: "Shopify i custom prodavnice sa katalogom, korpom, plaćanjem, dostavom i povezanim poslovnim alatima.", example: "Unearthed Samples", del: ["Shopify ili custom", "Unos proizvoda", "Plaćanje i dostava", "ERP i CRM integracije"] },
        { t: "E-commerce prodaja", d: "Vodimo i razvijamo online prodaju kroz oglase, optimizaciju konverzije, marketplace kanale i preciznu analitiku.", example: "Prodajni sistemi", del: ["Google i Meta Ads", "CRO i A/B testovi", "Marketplace kanali", "GA4 i izveštaji"] },
        { t: "Sajtovi i landing stranice", d: "Brzi poslovni sajtovi i landing stranice sa jasnom ponudom. Standardni sajt od 199 €, isporuka do 14 dana.", example: "Sarastra", del: ["Dizajn po meri", "Mobile first", "SEO osnova", "Domen, SSL i hosting"] },
        { t: "SEO, automatizacija i marketing", d: "Tehnički SEO, sadržaj, automatizovani tokovi i kampanje povezani sa konkretnim poslovnim ciljem.", example: "Kontinuirani rast", del: ["Tehnički SEO", "Automatizovani tokovi", "Sadržaj i kampanje", "Mesečna analiza"] },
      ],
      en: [
        { t: "SaaS and software systems", d: "Booking and rental systems, CRMs, internal tools and dashboards built around the company's actual workflow.", example: "Adriaticum · CrowdPlay", del: ["Specification and UX", "User roles", "Integrations and automation", "Maintenance and development"] },
        { t: "E-commerce builds", d: "Shopify and custom stores with catalogue, cart, payments, shipping and connected business tools.", example: "Unearthed Samples", del: ["Shopify or custom", "Product setup", "Payments and shipping", "ERP and CRM integrations"] },
        { t: "E-commerce sales", d: "We run and grow online sales through ads, conversion optimisation, marketplaces and precise analytics.", example: "Sales systems", del: ["Google and Meta Ads", "CRO and A/B tests", "Marketplace channels", "GA4 and reporting"] },
        { t: "Websites and landing pages", d: "Fast business websites and landing pages with a clear offer. Standard website from €199, delivered within 14 days.", example: "Sarastra", del: ["Custom design", "Mobile first", "SEO foundation", "Domain, SSL and hosting"] },
        { t: "SEO, automation and marketing", d: "Technical SEO, content, automated flows and campaigns tied to a specific business objective.", example: "Continuous growth", del: ["Technical SEO", "Automated flows", "Content and campaigns", "Monthly analysis"] },
      ],
    },
    deliverables: { sr: "Isporučujemo", en: "Deliverables" },
    example: { sr: "Primer", en: "Example" },
  },
  caps: {
    label: { sr: "05 / Sistem", en: "05 / System" },
    title: { sr: "Sve što digitalni posao mora da poveže.", en: "Everything a digital business needs connected." },
    items: {
      sr: [
        { k: "Softver", t: "Sistem prati način na koji firma radi.", d: "Radni tokovi, korisničke uloge, dashboard-i i automatizacije bez suvišnih koraka.", tags: ["Booking", "CRM", "Dashboard", "Automatizacija"] },
        { k: "Prodavnica", t: "Proizvod, korpa i plaćanje rade zajedno.", d: "Shopify ili custom izrada sa pouzdanim checkout-om, dostavom i upravljanjem proizvodima.", tags: ["Shopify", "Custom", "Plaćanje", "Dostava"] },
        { k: "Prodaja", t: "Svaki kanal ima jasan rezultat.", d: "Oglasi, marketplace kanali i optimizacija konverzije vode se prema prihodu, ne prema klikovima.", tags: ["Meta", "Google", "CRO", "Marketplace"] },
        { k: "Podaci", t: "Odluke se zasnivaju na tačnim podacima.", d: "Analitika, praćenje konverzija i dokumentovani izveštaji pokazuju šta radi i šta menjamo.", tags: ["GA4", "Tracking", "Izveštaji", "GDPR"] },
      ],
      en: [
        { k: "Software", t: "The system follows how the company works.", d: "Workflows, user roles, dashboards and automations without unnecessary steps.", tags: ["Booking", "CRM", "Dashboard", "Automation"] },
        { k: "Store", t: "Product, cart and payment work together.", d: "Shopify or custom builds with reliable checkout, shipping and product management.", tags: ["Shopify", "Custom", "Payments", "Shipping"] },
        { k: "Sales", t: "Every channel has a clear outcome.", d: "Ads, marketplaces and conversion optimisation are managed against revenue, not clicks.", tags: ["Meta", "Google", "CRO", "Marketplace"] },
        { k: "Data", t: "Decisions rely on accurate data.", d: "Analytics, conversion tracking and documented reports show what works and what we change.", tags: ["GA4", "Tracking", "Reports", "GDPR"] },
      ],
    },
  },
  standard: {
    label: { sr: "03 / Kvalifikacija", en: "03 / Qualification" },
    title: { sr: "Nemački standard. Za srpski biznis.", en: "German standard. For Serbian business." },
    intro: { sr: "Osnivač David Nedić ima nemačku stručnu kvalifikaciju Kaufmann für E-Commerce. Školovao se i radio u Nemačkoj, a danas to iskustvo primenjuje za firme u Srbiji i Nemačkoj.", en: "Founder David Nedić holds the German vocational qualification Kaufmann für E-Commerce. He trained and worked in Germany and now applies that experience for businesses in Serbia and Germany." },
    certificate: { sr: ["STRUČNA KVALIFIKACIJA", "Kaufmann für E-Commerce", "Nemačka", "DE / RS"], en: ["VOCATIONAL QUALIFICATION", "Kaufmann für E-Commerce", "Germany", "DE / RS"] },
    points: {
      sr: [["01", "Fiksni rokovi", "Dogovoreni datumi, jasne faze i odgovornost za isporuku."], ["02", "Jasni ugovori i cene", "Obim posla, cena i uslovi definišu se pre početka."], ["03", "Dokumentovani procesi", "Odluke, pristupi i sledeći koraci ostaju uredno zabeleženi."], ["04", "GDPR nivo rada sa podacima", "Pristupi, podaci kupaca i analitika tretiraju se pažljivo i kontrolisano."]],
      en: [["01", "Fixed deadlines", "Agreed dates, clear stages and accountability for delivery."], ["02", "Clear contracts and pricing", "Scope, price and terms are defined before work begins."], ["03", "Documented processes", "Decisions, access and next steps remain clearly recorded."], ["04", "GDPR-level data handling", "Access, customer data and analytics are handled carefully and with control."]],
    },
  },
  process: {
    label: { sr: "06 / Proces", en: "06 / Process" },
    title: { sr: "Live za 14 dana.", en: "Live in 14 days." },
    steps: {
      sr: [
        { d: "Dan 01", t: "Konsultacija", x: "Razgovaramo o proizvodima, ciljnoj grupi i budžetu." },
        { d: "Dan 02 – 06", t: "Dizajn i izrada", x: "Dizajn shopa sa fokusom na konverziju i mobilni prikaz." },
        { d: "Dan 07 – 10", t: "Integracija", x: "Povezujemo plaćanje, dostavu, porez i zalihe u jedan sistem." },
        { d: "Dan 11 – 13", t: "Testiranje", x: "Provera porudžbina, plaćanja i obaveštenja pre starta." },
        { d: "Dan 14", t: "Lansiranje i marketing", x: "Shop je live. Pokrećemo oglase i pratimo rezultate." },
      ],
      en: [
        { d: "Day 01", t: "Consultation", x: "We talk products, audience and budget." },
        { d: "Day 02 – 06", t: "Design and build", x: "Store design focused on conversion and mobile." },
        { d: "Day 07 – 10", t: "Integration", x: "Payments, shipping, tax and stock connected into one system." },
        { d: "Day 11 – 13", t: "Testing", x: "Orders, payments and notifications checked before launch." },
        { d: "Day 14", t: "Launch and marketing", x: "The store is live. We start ads and track results." },
      ],
    },
  },
  proof: {
    label: { sr: "07 / Brojevi", en: "07 / Numbers" },
    stats: {
      sr: [[14, "", "Dana do isporuke"], [100, "%", "Podrška"], [6, "", "Meseci saradnje"], [5, "+", "Paketa"]],
      en: [[14, "", "Days to delivery"], [100, "%", "Support"], [6, "", "Months partnership"], [5, "+", "Packages"]],
    } as Bi<[number, string, string][]>,
    funnelTitle: { sr: "Sistem, ne slučajnost.", en: "A system, not luck." },
    funnelText: { sr: "Povezujemo sadržaj, sajt i oglase tako da push i pull deluju zajedno duž tvog funnela.", en: "We connect content, site and ads so push and pull work together along your funnel." },
    funnel: {
      sr: [
        { tag: "TOFU", t: "Svesnost", s: "Privlačenje pažnje", i: ["Meta Ads", "Content Creation", "Social Media"] },
        { tag: "MOFU", t: "Interesovanje", s: "Konvertovanje interesovanja", i: ["SEO optimizacija", "Google Ads", "Web sajt"] },
        { tag: "BOFU", t: "Zaključenje", s: "Termin i zaključenje", i: ["Zakazivanje termina", "Remarketing", "E-mail"] },
      ],
      en: [
        { tag: "TOFU", t: "Awareness", s: "Capture attention", i: ["Meta Ads", "Content creation", "Social media"] },
        { tag: "MOFU", t: "Interest", s: "Convert interest", i: ["SEO", "Google Ads", "Website"] },
        { tag: "BOFU", t: "Decision", s: "Booking and closing", i: ["Appointment booking", "Remarketing", "E-mail"] },
      ],
    },
    compTitle: { sr: "Radenon protiv tipične agencije.", en: "Radenon vs a typical agency." },
    compHead: { sr: ["Kriterijum", "Tipična agencija", "Radenon Digital"], en: ["Criteria", "Typical agency", "Radenon Digital"] },
    comp: {
      sr: [
        ["Kvalitet sadržaja", "Stock fotografije i generički dizajn", "Individualni dizajn prilagođen tvom brendu"],
        ["Strategija sajta", "Dizajn bez fokusa na konverziju", "Zakazivanje i generisanje kontakata od početka"],
        ["Sve iz jednog mesta", "3+ agencije za koordinaciju", "Sajt + SEO + Social + Oglasi = jedna agencija"],
        ["Podrška", "E-mail sa odgovorom za 48h", "100% podrška sa mesečnim izveštajima"],
        ["Isporuka", "6 do 12 nedelja", "14 dana"],
      ],
      en: [
        ["Content quality", "Stock photos and generic design", "Custom design tailored to your brand"],
        ["Site strategy", "Design without a conversion focus", "Booking and lead generation from day one"],
        ["One place", "3+ agencies to coordinate", "Site + SEO + Social + Ads = one agency"],
        ["Support", "E-mail replies within 48h", "100% support with monthly reports"],
        ["Delivery", "6 to 12 weeks", "14 days"],
      ],
    },
  },
  packages: {
    label: { sr: "08 / Paketi", en: "08 / Packages" },
    title: { sr: "Jasne cene. Bez avansa.", en: "Clear prices. No upfront payment." },
    note: { sr: "Sve cene su konačne. Važe za period od 6 meseci saradnje.", en: "All prices are final. Valid for a 6 month partnership." },
    from: { sr: "od", en: "from" },
    items: {
      sr: [
        { n: "01", t: "Izrada sajta", s: "Profesionalan sajt, brza isporuka", p: "199 €", pn: "jednokratno", f: ["Moderan responzivan dizajn", "Do 7 stranica sadržaja", "Osnovna SEO optimizacija", "SSL + domen + hosting 1 god.", "Predaja za 14 radnih dana"] },
        { n: "02", t: "Izrada + održavanje", s: "Sajt koji uvek radi", p: "199 €", pn: "+ 49 € / mesečno", f: ["Sve iz paketa 01", "Mesečno tehničko održavanje", "Ažuriranje sadržaja i plugina", "Backup i bezbednost", "Prioritetna podrška"] },
        { n: "03", t: "Izrada + održavanje + SEO", s: "Prva strana Google-a", p: "349 €", pn: "+ 99 € / mesečno", f: ["Sve iz paketa 02", "On-page SEO optimizacija", "Istraživanje ključnih reči", "Link building", "Mesečni izveštaji i analitika"] },
      ],
      en: [
        { n: "01", t: "Website build", s: "Professional site, fast delivery", p: "199 €", pn: "one-time", f: ["Modern responsive design", "Up to 7 content pages", "Basic SEO optimisation", "SSL + domain + hosting 1 yr", "Delivered in 14 working days"] },
        { n: "02", t: "Build + maintenance", s: "A site that always works", p: "199 €", pn: "+ 49 € / month", f: ["Everything in 01", "Monthly technical maintenance", "Content and plugin updates", "Backup and security", "Priority support"] },
        { n: "03", t: "Build + maintenance + SEO", s: "Page one on Google", p: "349 €", pn: "+ 99 € / month", f: ["Everything in 02", "On-page SEO", "Keyword research", "Link building", "Monthly reports and analytics"] },
      ],
    },
    shop: { sr: "Online prodavnica? Ponuda po meri nakon konsultacije.", en: "Online store? Custom quote after a consultation." },
  },
  faq: {
    label: { sr: "09 / FAQ", en: "09 / FAQ" },
    title: { sr: "Pitanja", en: "Questions" },
    items: {
      sr: [
        ["Koliko traje izrada?", "Standardan sajt je gotov za 48h do 14 dana. Online prodavnica je live za 14 dana. Kompleksniji projekti traju 1 do 3 nedelje duže."],
        ["Šta je uključeno u mesečno održavanje?", "Ažuriranje sadržaja, tehnička podrška, redovni backup-ovi, bezbednosne zakrpe i monitoring performansi."],
        ["Da li mogu da promenim paket?", "Da, paket možeš nadograditi u svakom momentu. Za kombinovane pakete pravimo individualne ponude."],
        ["Kako funkcioniše SEO optimizacija?", "Istraživanje ključnih reči, on-page optimizacija, tehnička SEO analiza, brzina sajta i mesečni izveštaji o napretku."],
        ["Da li su cene konačne?", "Da. Nema skrivenih troškova. Cene važe za period od 6 meseci saradnje."],
      ],
      en: [
        ["How long does a build take?", "A standard site is done in 48h to 14 days. An online store is live in 14 days. Complex projects take 1 to 3 weeks longer."],
        ["What does monthly maintenance include?", "Content updates, technical support, regular backups, security patches and performance monitoring."],
        ["Can I change my package?", "Yes, you can upgrade at any time. We make custom offers for combined packages."],
        ["How does SEO work?", "Keyword research, on-page optimisation, technical SEO analysis, site speed and monthly progress reports."],
        ["Are the prices final?", "Yes. No hidden fees. Prices are valid for a 6 month partnership."],
      ],
    } as Bi<[string, string][]>,
  },
  contact: {
    label: { sr: "10 / Kontakt", en: "10 / Contact" },
    big: { sr: ["Hajde da", "pričamo"], en: ["Let's", "talk"] },
    text: { sr: "Daj nam 30 minuta. Analiziramo zašto sajt ne prodaje, oglasi troše budžet ili korpe ostaju prazne, i dajemo ti jasnu procenu.", en: "Give us 30 minutes. We find out why the site does not sell, ads burn budget or carts stay empty, and give you a clear assessment." },
    name: { sr: "Ime i prezime *", en: "Full name *" },
    email: { sr: "E-mail", en: "E-mail" },
    message: { sr: "Poruka *", en: "Message *" },
    namePh: { sr: "Tvoje ime", en: "Your name" },
    msgPh: { sr: "Šta prodaješ i gde želiš da budeš za 90 dana?", en: "What do you sell and where do you want to be in 90 days?" },
    send: { sr: "Pošalji preko WhatsApp-a", en: "Send via WhatsApp" },
    clock: { sr: "Zrenjanin / Beograd", en: "Zrenjanin / Belgrade" },
    rights: { sr: "Deo Radenon Group. Sva prava zadržana.", en: "Part of Radenon Group. All rights reserved." },
  },
};

type Dict = typeof dict;
type Resolve<T> = T extends { sr: infer S; en: unknown } ? S : T extends object ? { [K in keyof T]: Resolve<T[K]> } : T;

function resolve(node: unknown, lang: Lang): unknown {
  if (Array.isArray(node)) return node.map((n) => resolve(n, lang));
  if (node && typeof node === "object") {
    const o = node as Record<string, unknown>;
    if ("sr" in o && "en" in o && Object.keys(o).length === 2) return o[lang];
    const out: Record<string, unknown> = {};
    for (const k in o) out[k] = resolve(o[k], lang);
    return out;
  }
  return node;
}

const cache: Partial<Record<Lang, Resolve<Dict>>> = {};
export function getT(lang: Lang): Resolve<Dict> {
  return (cache[lang] ??= resolve(dict, lang) as Resolve<Dict>);
}

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Resolve<Dict> }>({
  lang: "sr",
  setLang: () => {},
  t: getT("sr"),
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sr");
  useEffect(() => {
    const saved = localStorage.getItem("radenon-lang");
    if (saved === "en" || saved === "sr") setLangState(saved);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("radenon-lang", l);
  };
  return <Ctx.Provider value={{ lang, setLang, t: getT(lang) }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
