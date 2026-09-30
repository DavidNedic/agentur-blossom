import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, MOTION_OK, ScrollTrigger } from "@/lib/motion";

export function SiteMotion() {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const cleanups: Array<() => void> = [];

    mm.add(MOTION_OK, () => {
      const progress = progressRef.current;
      if (progress) {
        gsap.set(progress, { scaleX: 0 });
        gsap.to(progress, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: 0.15 },
        });
      }

      gsap.utils.toArray<HTMLElement>(".section-title-line").forEach((line) => {
        gsap.fromTo(line, { yPercent: 108 }, {
          yPercent: 0,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: { trigger: line, start: "top 88%", once: true },
        });
      });

      const velocityTargets = gsap.utils.toArray<HTMLElement>(".velocity-type");
      const setters = velocityTargets.map((el) => gsap.quickTo(el, "skewY", { duration: 0.35, ease: "power2.out" }));
      const settle = gsap.delayedCall(0.12, () => setters.forEach((set) => set(0))).pause();
      const velocityTrigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const skew = gsap.utils.clamp(-4, 4, self.getVelocity() / -500);
          setters.forEach((set) => set(skew));
          settle.restart(true);
        },
      });
      cleanups.push(() => { velocityTrigger.kill(); settle.kill(); });

      const canSmooth = window.matchMedia("(pointer: fine)").matches && navigator.maxTouchPoints === 0;
      if (canSmooth) {
        const lenis = new Lenis({ duration: 1, smoothWheel: true, syncTouch: false });
        const update = () => ScrollTrigger.update();
        const raf = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", update);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        cleanups.push(() => {
          lenis.off("scroll", update);
          gsap.ticker.remove(raf);
          lenis.destroy();
        });
      }

      const refresh = () => ScrollTrigger.refresh();
      document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh, { once: true });
      const pendingImages = Array.from(document.images).filter((image) => !image.complete);
      pendingImages.forEach((image) => image.addEventListener("load", refresh, { once: true }));
      cleanups.push(() => {
        window.removeEventListener("load", refresh);
        pendingImages.forEach((image) => image.removeEventListener("load", refresh));
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      mm.revert();
    };
  }, []);

  return <span ref={progressRef} aria-hidden className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-primary" />;
}

export function MaskedTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`line-mask block ${className}`}><span className="section-title-line block">{children}</span></span>;
}