import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { SectionHead } from "./ui";

export function Manifesto() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const root = ref.current;
      if (!root) return;
      gsap.fromTo(
        root.querySelector(".manifesto-copy"),
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="relative z-10 py-24 md:py-40">
      <div className="container-grid">
        <SectionHead label={t.manifesto.label} right="Promet" />
        <div className="grid grid-cols-12 pt-12 md:pt-20">
          <div className="col-span-12 overflow-hidden md:col-span-11 lg:col-span-10 lg:col-start-3">
            <p className="manifesto-copy text-[clamp(1.75rem,4.2vw,4.25rem)] font-semibold leading-[1.08] tracking-[-0.02em]">{t.manifesto.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
