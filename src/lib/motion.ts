import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = "(prefers-reduced-motion: no-preference) and (min-width: 1024px)";
export const MOBILE_MOTION = "(prefers-reduced-motion: no-preference) and (max-width: 1023px)";

declare global {
  interface Window {
    __rdReady?: boolean;
  }
}

/** Runs cb once the preloader has finished (immediately if already done). */
export function onReady(cb: () => void) {
  if (window.__rdReady) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener("rd:ready", h, { once: true });
  return () => window.removeEventListener("rd:ready", h);
}

export function markReady() {
  window.__rdReady = true;
  window.dispatchEvent(new Event("rd:ready"));
}
