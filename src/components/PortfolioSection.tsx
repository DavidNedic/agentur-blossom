import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import portfolioUnearthed from "@/assets/portfolio-unearthed.png";
import portfolioCrowdplay from "@/assets/portfolio-crowdplay.png";
import portfolioSara from "@/assets/portfolio-sara.png";
import portfolioTrebami from "@/assets/portfolio-trebami.png";

interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
  url?: string;
}

const projects: Project[] = [
  {
    title: "Unearthed Samples",
    description: "E-commerce platforma za muzičke producente sa prodajom sample paketa i digitalnih proizvoda.",
    tags: ["E-Commerce", "Web dizajn", "Shopify"],
    image: portfolioUnearthed,
    url: "unearthed-samples.com",
  },
  {
    title: "CrowdPlay",
    description: "SaaS platforma za interaktivne igre na Twitch i YouTube strimovima sa chat integracijama.",
    tags: ["SaaS", "Streaming", "Web aplikacija"],
    image: portfolioCrowdplay,
    url: "crowdplay.eu",
  },
  {
    title: "Sarastra Marketing",
    description: "Web sajt za marketing agenciju sa fokusom na društvene mreže, SEO i digitalno oglašavanje.",
    tags: ["Marketing", "Brending", "Web dizajn"],
    image: portfolioSara,
    url: "sarastra-marketing.com",
  },
  {
    title: "Treba.mi",
    description: "Online marketplace za pronalaženje i angažovanje majstora i zanatlija u vašem kraju.",
    tags: ["Marketplace", "Platforma", "Web aplikacija"],
    image: portfolioTrebami,
    url: "treba.mi",
  },
];

export function PortfolioSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const navigate = useCallback(
    (dir: number) => {
      setDirection(dir);
      setCurrent((prev) => (prev + dir + projects.length) % projects.length);
    },
    []
  );

  useEffect(() => {
    const timer = setInterval(() => navigate(1), 6000);
    return () => clearInterval(timer);
  }, [navigate]);

  const project = projects[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 600 : -600, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -600 : 600, opacity: 0, scale: 0.95 }),
  };

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
    setTouchStart(null);
  };

  return (
    <section id="portfolio" className="py-20 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-3">
            Naši radovi.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Uvid u projekte koji donose rezultate.
          </p>
        </div>

        {/* ====== MOBILE LAYOUT (stacked card) ====== */}
        <div className="md:hidden relative">
          <div
            className="relative"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Browser mockup */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border bg-card shadow-xl shadow-primary/5">
              <div className="absolute top-0 inset-x-0 h-8 bg-secondary/80 backdrop-blur-sm border-b border-border flex items-center px-3 z-10">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-destructive/60" />
                  <div className="w-2 h-2 rounded-full bg-chart-4/60" />
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="bg-muted/50 rounded h-4 px-2 flex items-center">
                    <span className="text-muted-foreground text-[10px] truncate">
                      {project.url || "www.primer.rs"}
                    </span>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0 pt-8"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Info card below image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="mt-4 rounded-xl border border-border bg-card/60 backdrop-blur p-5"
              >
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                  {project.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile controls: counter + arrows */}
          <div className="flex items-center justify-between mt-5">
            <button
              onClick={() => navigate(-1)}
              className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center text-foreground active:scale-95 active:border-primary/50 transition-all"
              aria-label="Prethodni projekat"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {String(current + 1).padStart(2, "0")}
              </span>
              <div className="flex gap-1.5">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > current ? 1 : -1);
                      setCurrent(i);
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current
                        ? "w-6 bg-primary"
                        : "w-1.5 bg-muted-foreground/30"
                    }`}
                    aria-label={`Projekat ${i + 1}`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={() => navigate(1)}
              className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center text-foreground active:scale-95 active:border-primary/50 transition-all"
              aria-label="Sledeći projekat"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ====== DESKTOP LAYOUT (original browser hero) ====== */}
        <div className="hidden md:block relative">
          <div className="relative aspect-[16/9] max-w-5xl mx-auto rounded-2xl overflow-hidden border border-border bg-card">
            {/* Browser Chrome */}
            <div className="absolute top-0 inset-x-0 h-10 bg-secondary/80 backdrop-blur-sm border-b border-border flex items-center px-4 z-10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-chart-4/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="ml-4 flex-1 max-w-md">
                <div className="bg-muted/50 rounded-md h-5 px-3 flex items-center">
                  <span className="text-muted-foreground text-xs truncate">
                    {project.url || "www.primer.rs"}
                  </span>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 pt-10"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background/90 to-transparent z-10" />

            <div className="absolute bottom-0 inset-x-0 p-8 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-lg">
                    {project.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:border-primary/50 hover:text-primary transition-colors z-30"
            aria-label="Prethodni projekat"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:border-primary/50 hover:text-primary transition-colors z-30"
            aria-label="Sledeći projekat"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > current ? 1 : -1);
                  setCurrent(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Projekat ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
