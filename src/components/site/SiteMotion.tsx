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

      const canSmooth = window.matchMedia("(pointer: fine)").matches && navigator.maxTouchPoints === 0;
      if (canSmooth) {
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
        const update = () => ScrollTrigger.update();
        const raf = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", update);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        cleanups.push(() => {
          lenis.off("scroll", update);
          gsap.ticker.remove(raf);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.destroy();
        });
      }

      // Never recalculate triggers while the user is scrolling: wait until scrolling has been idle.
      let refreshTimer: ReturnType<typeof setTimeout> | undefined;
      let lastScroll = 0;
      const onScroll = () => { lastScroll = performance.now(); };
      window.addEventListener("scroll", onScroll, { passive: true });
      const scheduleRefresh = () => {
        if (refreshTimer) clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => {
          if (performance.now() - lastScroll < 300) {
            scheduleRefresh();
            return;
          }
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        }, 250);
      };
      document.fonts.ready.then(scheduleRefresh);
      window.addEventListener("load", scheduleRefresh, { once: true });
      let lastHeight = document.body.offsetHeight;
      const observer = new ResizeObserver(() => {
        const height = document.body.offsetHeight;
        if (Math.abs(height - lastHeight) < 2) return;
        lastHeight = height;
        scheduleRefresh();
      });
      observer.observe(document.body);
      cleanups.push(() => {
        window.removeEventListener("load", scheduleRefresh);
        window.removeEventListener("scroll", onScroll);
        observer.disconnect();
        if (refreshTimer) clearTimeout(refreshTimer);
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