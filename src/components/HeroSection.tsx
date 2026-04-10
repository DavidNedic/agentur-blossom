import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Full-Service Digitalna Agencija
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-4">
            Tvoj profesionalni
            <br />
            <span className="text-primary">sajt od 199 €</span>
          </h1>
          <p className="text-muted-foreground text-lg mt-6 max-w-lg">
            Web dizajn, SEO i digitalni marketing — sve iz jednog mesta.
            Bez skrivenih troškova. Rezultati koje možeš da vidiš.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden border border-border">
            <img
              src={heroImage}
              alt="Radenon Digital Marketing"
              className="w-full h-auto"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-5 py-3">
            <span className="text-3xl font-extrabold text-primary">100%</span>
            <p className="text-xs text-muted-foreground">Podrška</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
