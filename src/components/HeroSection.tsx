import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

/* ─── Particle Canvas ─── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);

  const spawnBurst = useCallback((cx: number, cy: number, count: number) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 2 + 1,
        baseAlpha: 0.6,
        alpha: 0.6,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const CONNECTION_DIST = 150;
    const ATTRACT_DIST = 200;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      particlesRef.current = Array.from({ length: 80 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1,
        baseAlpha: 0.6,
        alpha: 0.6,
      }));
    }

    function animate() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const particles = particlesRef.current;

      ctx!.clearRect(0, 0, w, h);

      // cap particles
      if (particles.length > 200) particles.splice(80);

      for (const p of particles) {
        // mouse attraction
        const dmx = mx - p.x;
        const dmy = my - p.y;
        const dMouse = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dMouse < ATTRACT_DIST && dMouse > 1) {
          p.vx += (dmx / dMouse) * 0.015;
          p.vy += (dmy / dMouse) * 0.015;
          p.alpha = Math.min(1, 0.6 + (1 - dMouse / ATTRACT_DIST) * 0.4);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        p.x += p.vx;
        p.y += p.vy;
        // damping
        p.vx *= 0.999;
        p.vy *= 0.999;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }

      // connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx!.strokeStyle = `rgba(181, 240, 0, ${opacity})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }

      // particles
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(181, 240, 0, ${p.alpha})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(animate);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    const handleClick = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      spawnBurst(e.clientX - rect.left, e.clientY - rect.top, 12);
    };

    resize();
    initParticles();
    animate();

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);
    window.addEventListener("resize", () => { resize(); initParticles(); });

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [spawnBurst]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "#0a0f1e" }}
    />
  );
}

/* ─── Animated Words ─── */

function AnimatedWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.15, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Count-Up Number ─── */

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1500;
          const startTime = performance.now();
          function step(now: number) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            start = Math.round(eased * target);
            setCount(start);
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Stats Bar ─── */

const heroStats = [
  { value: 5, suffix: "+", label: "Paketa" },
  { value: 100, suffix: "%", label: "Podrška" },
  { value: 14, suffix: "", label: "Dana isporuka" },
];

function StatsBar() {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-8 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
    >
      {heroStats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-2">
          {i > 0 && (
            <div className="w-px h-8 bg-border/30 mr-4 hidden sm:block" />
          )}
          <div className="text-center">
            <span className="text-2xl md:text-3xl font-extrabold text-primary">
              <CountUp target={s.value} suffix={s.suffix} />
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Hero Section ─── */

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleCanvas />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center py-32">
        <motion.span
          className="text-primary text-sm font-semibold uppercase tracking-widest"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Full-Service Digitalna Agencija
        </motion.span>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mt-6">
          <AnimatedWords text="Tvoj profesionalni" />
          <br />
          <motion.span
            className="text-primary inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{
              textShadow: "0 0 30px rgba(181, 240, 0, 0.3), 0 0 60px rgba(181, 240, 0, 0.15)",
            }}
          >
            sajt od 199 €
          </motion.span>
        </h1>

        <motion.p
          className="text-muted-foreground text-lg md:text-xl mt-6 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          Web dizajn, SEO i digitalni marketing — sve iz jednog mesta.
          Bez skrivenih troškova. Rezultati koje možeš da vidiš.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
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

        <StatsBar />
      </div>
    </section>
  );
}
