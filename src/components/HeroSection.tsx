import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Problem Cards ─── */

const problems = [
  { emoji: "😬", text: "Tvoj komšija otvorio biznis — već ima sajt. Ti imaš vizit kartu." },
  { emoji: "📵", text: "Klijent te gugla. Ne nalazi te. Zove konkurenciju." },
  { emoji: "😤", text: '"Imate li sajt?" — pita svaki drugi klijent.' },
  { emoji: "🫣", text: "Tvoj Facebook profil radi posao sajta. 2009. je zvalo." },
  { emoji: "💸", text: "Platiš reklamu. Nema gde da kliknu. Novac ode." },
  { emoji: "😴", text: "Konkurencija je na prvoj strani Googlea. Ti si na petoj." },
];

function RotatingProblems() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % problems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-28 sm:h-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center gap-4 rounded-xl border border-red-500/30 bg-red-950/20 px-5 py-4"
        >
          <span className="text-3xl shrink-0">{problems[index].emoji}</span>
          <p className="text-sm sm:text-base text-foreground/90 leading-snug">
            {problems[index].text}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Count-Up ─── */

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1800;
          const start = performance.now();
          function step(now: number) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─── Stat Card ─── */

function StatCard({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-2"
    >
      <span className="text-3xl md:text-4xl font-extrabold text-primary">
        <CountUp target={value} suffix={suffix} />
      </span>
      <p className="text-muted-foreground text-sm">{label}</p>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: delay + 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Ticker ─── */

const tickerItems = [
  "Web Dizajn",
  "SEO Optimizacija",
  "Google Ads",
  "Social Media",
  "Od 199€",
  "14 Dana Isporuka",
];

function Ticker() {
  const items = [...tickerItems, ...tickerItems, ...tickerItems];
  return (
    <div className="w-full overflow-hidden border-y border-border/40 bg-background/80 py-3">
      <motion.div
        className="flex whitespace-nowrap gap-0"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="text-sm font-semibold text-muted-foreground uppercase tracking-wide shrink-0 px-4"
          >
            {item} <span className="text-primary mx-2">★</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Grid Dot Pattern (CSS) ─── */

function GridDots() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(181,240,0,0.07) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

/* ─── Hero Section ─── */

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: "#060b07" }}>
      {/* Background effects */}
      <GridDots />
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(181,240,0,0.06) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            <motion.span
              className="text-primary text-xs font-semibold uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              Full-Service Digitalna Agencija
            </motion.span>

            <RotatingProblems />

            <motion.div
              className="flex flex-col items-start gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ArrowDown className="w-5 h-5 text-primary animate-bounce" />

              <div className="rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 w-full">
                <p className="text-lg font-bold text-primary">
                  Radenon te pokriva. Od 199€.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Web dizajn, SEO i digitalni marketing — sve iz jednog mesta.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4 pt-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <a
                href="#kontakt"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Zakaži konsultaciju <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#paketi"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3.5 rounded-lg font-semibold hover:bg-secondary transition-colors"
              >
                Pogledaj pakete
              </a>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8 lg:pt-8">
            <StatCard value={67} suffix="%" label='Malih biznisa u Srbiji nema sajt' delay={0.2} />
            <StatCard value={14} suffix="" label="Dana do tvog novog sajta" delay={0.4} />
            <StatCard value={100} suffix="%" label="Podrška — uvek dostupni" delay={0.6} />
          </div>
        </div>
      </div>

      {/* Ticker */}
      <Ticker />
    </section>
  );
}
