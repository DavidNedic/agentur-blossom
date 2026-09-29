import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/motion";

let lenisRef: Lenis | null = null;

export function scrollToHash(hash: string) {
  if (hash === "#" || hash === "#top") {
    if (lenisRef) lenisRef.scrollTo(0);
    else window.scrollTo({ top: 0 });
    return;
  }
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;
  if (lenisRef) lenisRef.scrollTo(el, { offset: -64 });
  else el.scrollIntoView();
}

export function SmoothScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const h = a.getAttribute("href");
      if (!h) return;
      e.preventDefault();
      scrollToHash(h);
      if (h.length > 1) history.replaceState(null, "", h);
    };
    document.addEventListener("click", onClick);

    let raf: ((t: number) => void) | null = null;
    if (window.matchMedia(MOTION_OK).matches) {
      const lenis = new Lenis({ lerp: 0.075 });
      lenisRef = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      raf = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }
    return () => {
      document.removeEventListener("click", onClick);
      if (raf) gsap.ticker.remove(raf);
      lenisRef?.destroy();
      lenisRef = null;
    };
  }, []);
  return null;
}
