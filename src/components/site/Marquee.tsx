import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/motion";

export function Marquee() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const words = t.marquee;
  const rows = [words, [...words].reverse()];

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const tracks = gsap.utils.toArray<HTMLElement>(".mq-track", ref.current);
      const xs = tracks.map(() => 0);
      let dir = 1;
      let boost = 0;
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          dir = self.direction;
          boost = Math.min(Math.abs(self.getVelocity()) / 250, 14);
        },
      });
      const tick = () => {
        boost *= 0.93;
        tracks.forEach((tr, i) => {
          const half = tr.scrollWidth / 2;
          const base = i % 2 === 0 ? -1 : 1;
          xs[i] += base * dir * (0.7 + boost);
          if (xs[i] <= -half) xs[i] += half;
          if (xs[i] > 0) xs[i] -= half;
          gsap.set(tr, { x: xs[i] });
        });
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    });
    return () => mm.revert();
  }, [t]);

  return (
    <section ref={ref} aria-label="Services" className="relative z-10 overflow-hidden border-y border-hairline bg-background py-6 md:py-10">
      {rows.map((row, r) => (
        <div key={r} className="overflow-hidden whitespace-nowrap">
          <div className="mq-track inline-flex will-change-transform">
            {[...row, ...row, ...row, ...row].map((w, i) => (
              <span
                key={i}
                className={`font-expanded px-[2vw] text-[clamp(3rem,10vw,11rem)] uppercase ${(i + r) % 2 ? "text-outline" : "text-foreground"}`}
              >
                {w}
                <span className="ml-[4vw] inline-block h-[0.12em] w-[0.12em] -translate-y-[0.3em] bg-primary align-middle" />
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
