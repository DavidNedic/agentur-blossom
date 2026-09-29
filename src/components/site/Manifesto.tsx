import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { SectionHead } from "./ui";

export function Manifesto() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const words = gsap.utils.toArray<HTMLElement>(".mw", ref.current);
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 65%", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, [lang]);

  return (
    <section ref={ref} className="relative z-10 py-24 md:py-40">
      <div className="container-grid">
        <SectionHead label={t.manifesto.label} right="Radenon" />
        <div className="grid grid-cols-12 pt-12 md:pt-20">
          <p className="col-span-12 text-[clamp(1.75rem,4.2vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.02em] md:col-span-11 lg:col-span-10 lg:col-start-3">
            {t.manifesto.text.split(" ").map((w, i) => (
              <span key={`${lang}-${i}`} className="mw">
                {w}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
