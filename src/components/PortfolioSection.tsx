import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
  url?: string;
}

const projects: Project[] = [
  {
    title: "Beispiel Projekt 1",
    description: "Modernes E-Commerce Design mit responsivem Layout und optimierter Benutzererfahrung.",
    tags: ["Webdesign", "E-Commerce", "SEO"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=700&fit=crop",
    url: "#",
  },
  {
    title: "Beispiel Projekt 2",
    description: "Corporate Website mit starkem Branding und Lead-Generierung-Funnel.",
    tags: ["Corporate", "Branding", "Ads"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop",
    url: "#",
  },
  {
    title: "Beispiel Projekt 3",
    description: "Landing Page für eine Social Media Kampagne mit hoher Conversion Rate.",
    tags: ["Landing Page", "Social Media", "Conversion"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=700&fit=crop",
    url: "#",
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

  return (
    <section id="portfolio" className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mt-3">
            Unsere Arbeiten.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Ein Einblick in Projekte, die Ergebnisse liefern.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
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
                    {project.url && project.url !== "#" ? project.url : "www.beispiel.de"}
                  </span>
                </div>
              </div>
            </div>

            {/* Screenshot */}
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

            {/* Gradient overlay */}
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background/90 to-transparent z-10" />

            {/* Project info overlay */}
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 z-20">
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
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-lg">
                    {project.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:border-primary/50 hover:text-primary transition-colors z-30"
            aria-label="Vorheriges Projekt"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:border-primary/50 hover:text-primary transition-colors z-30"
            aria-label="Nächstes Projekt"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
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
                aria-label={`Projekt ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10">
            <ExternalLink className="w-4 h-4 mr-2" />
            Alle Projekte ansehen
          </Button>
        </div>
      </div>
    </section>
  );
}
