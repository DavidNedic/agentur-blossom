import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import unearthed from "@/assets/portfolio-unearthed.png";
import adriaticum from "@/assets/portfolio-adriaticum.png";
import crowdplay from "@/assets/portfolio-crowdplay.png";
import tippr from "@/assets/portfolio-tippr.png";
import trebami from "@/assets/portfolio-trebami.png";
import neural from "@/assets/portfolio-neural.png";
import sara from "@/assets/portfolio-sara.png";
import fakeescape from "@/assets/portfolio-fakeescape.png";

export type Lang = "sr" | "en";

export const CONTACT = {
  phone: "+381 62 101 5707",
  tel: "+381621015707",
  wa: "381621015707",
  email: "davidnedic@web.de",
};

export const IMAGES = { unearthed, adriaticum, crowdplay, tippr, trebami, neural, sara, fakeescape };

type Bi<T> = { sr: T; en: T };

const projects = [
  { name: "Unearthed Samples", url: "unearthed-samples.com", image: unearthed, year: "2025", stack: "Shopify · Stripe · Meta Pixel",
    type: { sr: "Online prodavnica", en: "Online store" },
    desc: { sr: "Prodavnica sa integrisanim plaćanjem, brza na mobilnom i građena za konverziju.", en: "Store with integrated checkout, fast on mobile and built for conversion." } },
  { name: "Adriaticum", url: "adriaticum.rentals", image: adriaticum, year: "2026", stack: "React · Booking · WhatsApp",
    type: { sr: "Booking platforma", en: "Booking platform" },
    desc: { sr: "Iznajmljivanje opreme za događaje. Vođeni upitnik u nekoliko koraka, katalog i direktna rezervacija.", en: "Event equipment rental. A guided multi-step request flow, catalogue and direct booking." } },
  { name: "CrowdPlay", url: "crowdplay.eu", image: crowdplay, year: "2025", stack: "React · Node · Integracije",
    type: { sr: "Web aplikacija", en: "Web application" },
    desc: { sr: "Kompletna web aplikacija sa integracijama, skalabilna i građena po meri klijenta.", en: "Full web application with integrations, scalable and built to the client's spec." } },
  { name: "Tippr", url: "tippr.app", image: tippr, year: "2026", stack: "React · Realtime · Supabase",
    type: { sr: "Real-time aplikacija", en: "Real-time app" },
    desc: { sr: "Dinamična aplikacija sa real-time funkcijama koja angažuje zajednicu.", en: "Dynamic app with real-time features that keeps a community engaged." } },
  { name: "Treba.mi", url: "treba.mi", image: trebami, year: "2025", stack: "React · Platforma · Auth",
    type: { sr: "Platforma", en: "Platform" },
    desc: { sr: "Platforma koja povezuje korisnike kroz jasan interfejs i pouzdan sistem.", en: "Platform connecting people through a clear interface and a reliable system." } },
  { name: "Neural.live", url: "neural.live", image: neural, year: "2025", stack: "React · WebGL · API",
    type: { sr: "Interaktivna aplikacija", en: "Interactive app" },
    desc: { sr: "Interaktivna web aplikacija sa naprednom tehnologijom i čistim iskustvom.", en: "Interactive web app with advanced tech and a clean experience." } },
  { name: "Sarastra", url: "sarastra-marketing.com", image: sara, year: "2024", stack: "Web · SEO · Brending",
    type: { sr: "Poslovni sajt", en: "Business site" },
    desc: { sr: "Poslovni sajt optimizovan za SEO, koji predstavlja brend jasno i brzo.", en: "Business site optimised for SEO that presents the brand clearly and fast." } },
  { name: "The Fake Escape", url: "thefakeescape.app", image: fakeescape, year: "2025", stack: "iOS · UI/UX · Swift",
    type: { sr: "Mobilna aplikacija", en: "Mobile app" },
    desc: { sr: "Mobilna aplikacija sa modernim UI/UX dizajnom. Jednostavna, brza, intuitivna.", en: "Mobile app with modern UI/UX. Simple, fast, intuitive." } },
];

const dict = {
  nav: {
    links: { sr: [["Radovi", "#radovi"], ["Usluge", "#usluge"], ["Proces", "#proces"], ["Paketi", "#paketi"], ["FAQ", "#faq"]], en: [["Work", "#radovi"], ["Services", "#usluge"], ["Process", "#proces"], ["Packages", "#paketi"], ["FAQ", "#faq"]] } as Bi<[string, string][]>,
    cta: { sr: "Zakaži konsultaciju", en: "Book a call" },
    menu: { sr: "Meni", en: "Menu" },
    close: { sr: "Zatvori", en: "Close" },
  },
  hero: {
    lines: { sr: ["Pravimo", "online", "prodavnice", "koje prodaju."], en: ["We build", "online", "stores", "that sell."] },
    meta: { sr: ["01 / E-commerce agencija", "[ Live za 14 dana ]", "Zrenjanin / Beograd"], en: ["01 / E-commerce agency", "[ Live in 14 days ]", "Zrenjanin / Belgrade"] },
    sub: { sr: "Shop, plaćanje, dostava i oglasi. Jedan tim, jedan rok, jedna cena.", en: "Store, payments, shipping and ads. One team, one deadline, one price." },
    scroll: { sr: "Skroluj", en: "Scroll" },
  },
  marquee: { sr: ["E-commerce", "Web dizajn", "SEO", "Google Ads", "Meta Ads", "Aplikacije"], en: ["E-commerce", "Web design", "SEO", "Google Ads", "Meta Ads", "Apps"] },
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
    count: { sr: "8 projekata", en: "8 projects" },
    projects,
  },
  services: {
    label: { sr: "04 / Usluge", en: "04 / Services" },
    title: { sr: "Šta radimo", en: "What we do" },
    intro: { sr: "E-commerce je srce. Sve ostalo ga hrani saobraćajem.", en: "E-commerce is the core. Everything else feeds it traffic." },
    items: {
      sr: [
        { t: "E-commerce i shop sistemi", d: "Kompletne online prodavnice, od plaćanja i korpe do oglašavanja i analitike. Spremno za prodaju od prvog dana.", del: ["Katalog i filteri", "Checkout sa plaćanjem", "Kurirske integracije", "Praćenje konverzija"] },
        { t: "Web dizajn", d: "Profesionalan, responzivan dizajn prilagođen tvom biznisu, sa SSL-om i SEO osnovama.", del: ["Dizajn po meri", "Do 7 stranica", "SSL, domen, hosting", "Mobile first"] },
        { t: "SEO optimizacija", d: "On-page SEO, istraživanje ključnih reči i mesečni izveštaji za bolji rang na Google-u.", del: ["Tehnički audit", "Ključne reči", "Link building", "Mesečni izveštaj"] },
        { t: "Google Ads", d: "Performance kampanje sa landing stranicama optimizovanim za konverziju i jasnim ROI.", del: ["Search i Shopping", "Landing stranice", "Praćenje konverzija", "ROI izveštaj"] },
        { t: "Digitalni marketing", d: "Sajt, sadržaj i oglasi povezani u jedan sistem koji donosi upite.", del: ["Meta Ads", "Sadržaj", "Remarketing", "E-mail"] },
        { t: "Mobilne aplikacije", d: "Custom iOS i Android aplikacije za lojalnost, narudžbine i komunikaciju sa klijentima.", del: ["iOS i Android", "UI/UX dizajn", "Push notifikacije", "Objava u store-u"] },
        { t: "Konsultacije", d: "Besplatna analiza tvoje digitalne situacije i konkretna strategija za sledećih 90 dana.", del: ["15 minuta", "Besplatno", "Plan za 90 dana", "Bez obaveza"] },
      ],
      en: [
        { t: "E-commerce and shop systems", d: "Complete online stores, from payments and cart to advertising and analytics. Ready to sell on day one.", del: ["Catalogue and filters", "Checkout with payments", "Courier integrations", "Conversion tracking"] },
        { t: "Web design", d: "Professional, responsive design tailored to your business, with SSL and SEO basics.", del: ["Custom design", "Up to 7 pages", "SSL, domain, hosting", "Mobile first"] },
        { t: "SEO", d: "On-page SEO, keyword research and monthly reports for better Google rankings.", del: ["Technical audit", "Keywords", "Link building", "Monthly report"] },
        { t: "Google Ads", d: "Performance campaigns with landing pages built for conversion and a clear ROI.", del: ["Search and Shopping", "Landing pages", "Conversion tracking", "ROI report"] },
        { t: "Digital marketing", d: "Site, content and ads connected into one system that brings enquiries.", del: ["Meta Ads", "Content", "Remarketing", "E-mail"] },
        { t: "Mobile apps", d: "Custom iOS and Android apps for loyalty, orders and client communication.", del: ["iOS and Android", "UI/UX design", "Push notifications", "Store release"] },
        { t: "Consulting", d: "A free analysis of your digital situation and a concrete strategy for the next 90 days.", del: ["15 minutes", "Free", "90 day plan", "No obligation"] },
      ],
    },
    deliverables: { sr: "Isporučujemo", en: "Deliverables" },
  },
  caps: {
    label: { sr: "05 / E-commerce", en: "05 / E-commerce" },
    title: { sr: "Kompletan shop. Od nule do prodaje.", en: "A complete store. From zero to sales." },
    items: {
      sr: [
        { k: "Plaćanje", t: "Stripe, PayPal, kartice, pouzeće.", d: "Sve metode koje tvoji kupci očekuju, uključujući gotovinu i plaćanje pouzećem.", tags: ["Stripe", "PayPal", "Kartice", "Pouzeće"] },
        { k: "Pametna korpa", t: "Napuštene korpe se vraćaju.", d: "Automatski podsetnici, popusti i up-sell logika koja podiže prosečnu vrednost porudžbine.", tags: ["Recovery e-mail", "Popusti", "Up-sell", "Kuponi"] },
        { k: "Dostava", t: "Kurir, praćenje, zalihe.", d: "Integracija sa kurirskim službama, automatsko praćenje pošiljki i upravljanje zalihama.", tags: ["Kurirske službe", "Tracking", "Zalihe", "Obaveštenja"] },
        { k: "Oglasi i analitika", t: "Znaš šta prodaje.", d: "Meta Pixel, Google Ads konverzije i analitika, da znaš gde da uložiš sledeći dinar.", tags: ["Meta Pixel", "Google Ads", "GA4", "Izveštaji"] },
      ],
      en: [
        { k: "Payments", t: "Stripe, PayPal, cards, cash on delivery.", d: "Every method your customers expect, including cash and pay on delivery.", tags: ["Stripe", "PayPal", "Cards", "COD"] },
        { k: "Smart cart", t: "Abandoned carts come back.", d: "Automatic reminders, discounts and up-sell logic that lift average order value.", tags: ["Recovery e-mail", "Discounts", "Up-sell", "Coupons"] },
        { k: "Shipping", t: "Courier, tracking, stock.", d: "Courier integrations, automatic shipment tracking and inventory management.", tags: ["Couriers", "Tracking", "Inventory", "Notifications"] },
        { k: "Ads and analytics", t: "Know what sells.", d: "Meta Pixel, Google Ads conversions and analytics, so you know where to spend next.", tags: ["Meta Pixel", "Google Ads", "GA4", "Reports"] },
      ],
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
