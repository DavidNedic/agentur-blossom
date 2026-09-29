import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK, markReady } from "@/lib/motion";

export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const finish = () => {
      setDone(true);
      markReady();
    };
    if (!window.matchMedia(MOTION_OK).matches) {
      finish();
      return;
    }
    const o = { v: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(o, {
      v: 100,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, "0");
      },
    }).to(ref.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.35, ease: "power3.inOut" });
    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-[100] flex items-end justify-between bg-background px-6 pb-6 md:px-10 md:pb-10"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <span className="meta text-muted-foreground">Radenon Digital</span>
      <span ref={num} className="font-mono text-[18vw] leading-none text-foreground md:text-[10vw]">
        000
      </span>
    </div>
  );
}
