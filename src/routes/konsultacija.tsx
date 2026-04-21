import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  Loader2,
  Phone,
  MessageCircle,
  Lock,
  Star,
  Quote,
} from "lucide-react";
import logo from "@/assets/radenon-logo-digital.png";

export const Route = createFileRoute("/konsultacija")({
  component: KonsultacijaPage,
  head: () => ({
    meta: [
      { title: "Besplatna konsultacija — Radenon Digital" },
      {
        name: "description",
        content:
          "Popuni formu i dobij besplatnu konsultaciju u roku od 24h. Sajt već od 48h, od 199€. Bez rizika.",
      },
      { property: "og:title", content: "Besplatna konsultacija — Radenon Digital" },
      {
        property: "og:description",
        content:
          "Sajt već od 48h. Od 199€. Bez skrivenih troškova. Plaćanje tek nakon isporuke.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
});

const WHATSAPP_NUMBER = "381621015707";

const businessTypes = [
  "Restoran / Kafić",
  "Frizerski / Kozmetički salon",
  "Teretana / Fitness",
  "Auto servis / Vulkanizer",
  "Prodavnica / Butik",
  "Medicinska ordinacija",
  "Drugi tip biznisa",
] as const;

const interesti = [
  { value: "paket", emoji: "📦", label: "Konkretan paket (znam šta hoću)" },
  { value: "info", emoji: "💬", label: "Samo da se informišem" },
  { value: "hitno", emoji: "🚀", label: "Hitno mi treba sajt" },
] as const;

const formSchema = z.object({
  ime: z
    .string()
    .trim()
    .min(2, { message: "Unesi ime i prezime." })
    .max(100, { message: "Maksimalno 100 karaktera." }),
  telefon: z
    .string()
    .trim()
    .min(6, { message: "Unesi validan broj telefona." })
    .max(30, { message: "Maksimalno 30 karaktera." })
    .regex(/^[+0-9\s\-()]+$/, { message: "Samo brojevi, +, razmak i crtice." }),
  biznis: z
    .string()
    .trim()
    .min(2, { message: "Unesi naziv biznisa." })
    .max(100, { message: "Maksimalno 100 karaktera." }),
  tip: z.enum(businessTypes, { message: "Izaberi tip biznisa." }),
  interes: z.enum(["paket", "info", "hitno"], {
    message: "Izaberi šta te zanima.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

function KonsultacijaPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <MinimalHeader />
      <HeroWithForm />
      <TrustMarquee />
      <Testimonials />
      <MiniPackages />
      <BottomCTA />
      <MinimalFooter />
    </div>
  );
}

/* ────────── Header (logo only, no nav) ────────── */

function MinimalHeader() {
  return (
    <header className="border-b border-primary/10 bg-background/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center">
        <img src={logo} alt="Radenon Digital" className="h-14 w-auto" />
      </div>
    </header>
  );
}

/* ────────── Hero + Form ────────── */

function HeroWithForm() {
  return (
    <section className="py-12 md:py-20" id="forma">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">
        <HeroLeft />
        <LeadForm />
      </div>
    </section>
  );
}

function HeroLeft() {
  const trust = [
    "Bez skrivenih troškova",
    "Plaćanje tek nakon isporuke",
    "Besplatna proba dizajna pre potpisivanja",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <span className="text-primary text-xs font-semibold uppercase tracking-[0.2em]">
          Besplatna konsultacija
        </span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mt-6">
        Tvoj sajt već od <span className="text-primary">48h</span>.
        <br />
        Od <span className="text-primary">199 €</span>. Bez rizika.
      </h1>

      <p className="text-muted-foreground text-lg mt-6 max-w-md">
        Popuni formu — javimo se u roku od 24h i zajedno biramo paket koji
        odgovara tvom biznisu.
      </p>

      <ul className="mt-8 space-y-3">
        {trust.map((t) => (
          <li key={t} className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
            </span>
            <span className="text-foreground text-base">{t}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ────────── Form Card ────────── */

function LeadForm() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { interes: "info" },
  });

  const interesValue = watch("interes");
  const tipValue = watch("tip");

  // Allow other sections to pre-fill via ?interes= or scroll-into
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { interes?: FormValues["interes"] };
      if (detail?.interes) setValue("interes", detail.interes);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("radenon:select-interest", handler);
    return () => window.removeEventListener("radenon:select-interest", handler);
  }, [setValue]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const interesLabel =
        interesti.find((i) => i.value === data.interes)?.label ?? data.interes;

      const lines = [
        "🔔 *NOVI ZAHTEV — Radenon Digital*",
        "",
        `👤 Ime: ${data.ime}`,
        `📞 Telefon: ${data.telefon}`,
        `🏢 Biznis: ${data.biznis}`,
        `📂 Tip: ${data.tip}`,
        `💬 Zanima ga: ${interesLabel}`,
        "",
        `⏰ ${new Date().toLocaleString("sr-RS")}`,
      ];
      const msg = encodeURIComponent(lines.join("\n"));
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
      setSuccess(true);
      reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      ref={formRef}
      id="form-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative rounded-2xl bg-card border border-border shadow-2xl shadow-primary/5 overflow-hidden"
    >
      <div className="h-[3px] w-full bg-primary" />
      <div className="p-7 md:p-9">
        <AnimatePresence mode="wait">
          {success ? (
            <SuccessState key="success" onReset={() => setSuccess(false)} />
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
              noValidate
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Zakaži besplatan razgovor
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Traje 15 minuta. Bez obaveza.
                </p>
              </div>

              <Field label="Ime i prezime" error={errors.ime?.message}>
                <input
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Npr. Marko Nikolić"
                  className={inputCls}
                  {...register("ime")}
                />
              </Field>

              <Field label="Broj telefona" error={errors.telefon?.message}>
                <input
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                  placeholder="+381 6X XXX XXXX"
                  className={inputCls}
                  {...register("telefon")}
                />
              </Field>

              <Field label="Naziv biznisa" error={errors.biznis?.message}>
                <input
                  type="text"
                  autoComplete="organization"
                  maxLength={100}
                  placeholder="Npr. Frizerski salon Mia"
                  className={inputCls}
                  {...register("biznis")}
                />
              </Field>

              <Field label="Tip biznisa" error={errors.tip?.message}>
                <select
                  className={`${inputCls} appearance-none cursor-pointer ${
                    tipValue ? "" : "text-muted-foreground"
                  }`}
                  defaultValue=""
                  {...register("tip")}
                >
                  <option value="" disabled>
                    Izaberi tip biznisa…
                  </option>
                  {businessTypes.map((b) => (
                    <option key={b} value={b} className="text-foreground bg-card">
                      {b}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Šta te najviše zanima?" error={errors.interes?.message}>
                <div className="space-y-2 mt-1">
                  {interesti.map((opt) => {
                    const active = interesValue === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                          active
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background/40 hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          className="sr-only"
                          {...register("interes")}
                        />
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="text-sm text-foreground">{opt.label}</span>
                        <span
                          className={`ml-auto w-4 h-4 rounded-full border-2 ${
                            active
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}
                        />
                      </label>
                    );
                  })}
                </div>
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-extrabold text-base py-3.5 rounded-lg hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Šaljem…
                  </>
                ) : (
                  <>
                    Pošalji zahtev <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-3.5 h-3.5" />
                Tvoji podaci su bezbedni. Ne šaljemo spam.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const inputCls =
  "w-full rounded-lg bg-background/60 border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-destructive text-xs mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-20 h-20 mx-auto rounded-full bg-primary/15 flex items-center justify-center"
      >
        <Check className="w-10 h-10 text-primary" strokeWidth={3} />
      </motion.div>
      <h3 className="text-2xl font-extrabold text-foreground mt-6">
        Primili smo tvoj zahtev! 🎉
      </h3>
      <p className="text-muted-foreground mt-3 max-w-sm mx-auto">
        Javiće ti se naš tim u roku od 24 časa na broj koji si ostavio.
      </p>
      <button
        onClick={onReset}
        className="mt-6 text-sm text-primary hover:underline"
      >
        Pošalji još jedan zahtev
      </button>
    </motion.div>
  );
}

/* ────────── Trust Marquee ────────── */

function TrustMarquee() {
  const items = [
    "Restorani",
    "Saloni",
    "Teretane",
    "Auto servisi",
    "Prodavnice",
  ];
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <section className="py-8 border-y border-border/50 bg-card/30 overflow-hidden">
      <div className="relative">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {repeated.map((item, i) => (
            <span
              key={i}
              className="text-muted-foreground text-sm uppercase tracking-[0.25em] font-medium shrink-0"
            >
              {item} <span className="text-primary/40 ml-12">·</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────── Testimonials ────────── */

const testimonials = [
  {
    name: "Vlasnik restorana",
    business: "Restoran",
    city: "Zrenjanin",
    quote:
      "Sajt je bio gotov za 12 dana. Već u prvih mesec dana smo dobili više rezervacija nego ikad ranije.",
  },
  {
    name: "Vlasnica salona",
    business: "Frizerski salon",
    city: "Zrenjanin",
    quote:
      "Sve jasno objašnjeno, bez tehničkog žargona. Komunikacija preko WhatsApp-a — brzo i lako.",
  },
  {
    name: "Vlasnik teretane",
    business: "Fitness centar",
    city: "Zrenjanin",
    quote:
      "Konkretna cena, konkretan rok. Dobio sam tačno ono što su obećali — i još malo više.",
  },
];

function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Šta kažu naši klijenti?
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 relative"
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-primary/30" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="w-4 h-4 fill-primary text-primary"
                  />
                ))}
              </div>
              <p className="text-foreground/90 text-sm leading-relaxed">
                "{t.quote}"
              </p>
              <div className="mt-5 pt-5 border-t border-border/60">
                <p className="text-foreground font-semibold text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {t.business} · {t.city}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── Mini Packages ────────── */

const miniPackages = [
  {
    name: "Starter",
    price: "od 199 €",
    desc: "Landing page",
    duration: "od 48h",
    interes: "info" as const,
  },
  {
    name: "Pro",
    price: "od 399 €",
    desc: "Višestranični sajt",
    duration: "21 dan",
    interes: "paket" as const,
    highlight: true,
  },
  {
    name: "Premium",
    price: "od 699 €",
    desc: "E-commerce",
    duration: "30 dana",
    interes: "paket" as const,
  },
];

function MiniPackages() {
  const choosePackage = (interes: "paket" | "info" | "hitno") => {
    window.dispatchEvent(
      new CustomEvent("radenon:select-interest", { detail: { interes } })
    );
  };

  return (
    <section className="py-20 bg-card/30 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Koji paket je za tebe?
          </h2>
          <p className="text-muted-foreground mt-3">
            Nema skrivenih troškova — cene su fiksne.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {miniPackages.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl bg-card border p-6 flex flex-col ${
                p.highlight ? "border-primary" : "border-border"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Najpopularniji
                </span>
              )}
              <h3 className="text-foreground font-bold text-xl">{p.name}</h3>
              <p className="text-primary font-extrabold text-3xl mt-2">{p.price}</p>
              <ul className="mt-5 space-y-2 text-sm flex-1">
                <li className="flex items-center gap-2 text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {p.desc}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  Isporuka: {p.duration}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  Bez skrivenih troškova
                </li>
              </ul>
              <button
                type="button"
                onClick={() => choosePackage(p.interes)}
                className={`mt-6 w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  p.highlight
                    ? "bg-primary text-primary-foreground hover:scale-[1.02]"
                    : "border border-border text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                Odaberi ovaj →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────── Bottom CTA ────────── */

function BottomCTA() {
  const phone = "+381 62 101 5707";
  const tel = "+381621015707";

  return (
    <section className="relative py-16 border-t border-primary/30">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(181,240,0,0.6)]" />
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold">
          Još uvek nisi siguran? Nazovi nas direktno.
        </h2>
        <p className="text-primary text-2xl md:text-3xl font-bold mt-3 flex items-center justify-center gap-2">
          <Phone className="w-6 h-6" /> {phone}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <a
            href={`tel:${tel}`}
            className="inline-flex items-center gap-2 border border-foreground/30 text-foreground px-6 py-3 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" /> Pozovi
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-foreground/30 text-foreground px-6 py-3 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/* ────────── Footer ────────── */

function MinimalFooter() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <img src={logo} alt="Radenon Digital" className="h-10 w-auto" />
        <p className="text-muted-foreground text-xs">
          © 2025 Radenon Digital
        </p>
        <a
          href="#"
          className="text-muted-foreground text-xs hover:text-primary transition-colors"
        >
          Politika privatnosti
        </a>
      </div>
    </footer>
  );
}
