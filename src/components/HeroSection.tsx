import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Radial gradient blobs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, #0d2010 0%, transparent 70%)",
          top: "-10%",
          right: "-5%",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, #0b1a0d 0%, transparent 70%)",
          bottom: "-15%",
          left: "10%",
          filter: "blur(80px)",
        }}
        animate={{ x: [0, -30, 25, 0], y: [0, 40, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, #0a0f1e 0%, transparent 70%)",
          top: "30%",
          right: "20%",
          filter: "blur(70px)",
        }}
        animate={{ x: [0, 20, -30, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 4 }}
      />

      {/* Floating green glowing orbs */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(163, 230, 53, 0.15) 0%, transparent 70%)",
          top: "20%",
          right: "25%",
          filter: "blur(30px)",
        }}
        animate={{ y: [0, -25, 15, 0], x: [0, 15, -10, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(163, 230, 53, 0.15) 0%, transparent 70%)",
          bottom: "30%",
          right: "40%",
          filter: "blur(25px)",
        }}
        animate={{ y: [0, 20, -15, 0], x: [0, -20, 10, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute w-20 h-20 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(163, 230, 53, 0.15) 0%, transparent 70%)",
          top: "55%",
          right: "15%",
          filter: "blur(20px)",
        }}
        animate={{ y: [0, -18, 22, 0], x: [0, 12, -18, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1.5 }}
      />
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Full-Service Digitalna Agencija
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mt-4">
            Tvoj profesionalni
            <br />
            <span className="text-primary">sajt od 199 €</span>
          </h1>
          <p className="text-muted-foreground text-lg mt-6 max-w-lg mx-auto">
            Web dizajn, SEO i digitalni marketing — sve iz jednog mesta.
            Bez skrivenih troškova. Rezultati koje možeš da vidiš.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
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
          <div className="mt-6 inline-flex bg-card border border-border rounded-xl px-5 py-3">
            <span className="text-3xl font-extrabold text-primary">100%</span>
            <p className="text-xs text-muted-foreground ml-2 self-center">Podrška</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
