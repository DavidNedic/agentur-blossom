import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { Roll } from "./ui";
import { MaskedTitle } from "./SiteMotion";

export function Process() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const root = ref.current;
      if (!root) return;
      const path = root.querySelector(".pr-path");
      const number = root.querySelector(".pr-current");
      gsap.fromTo(
        path,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: listRef.current, start: "top 60%", end: "bottom 60%", scrub: true },
        },
      );
      gsap.utils.toArray<HTMLElement>(".pr-step", ref.current).forEach((step) => {
        gsap.set(step, { opacity: 0.3 });
        gsap.to(step, {
          opacity: 1,
          duration: 0.4,
           ease: "power2.out",
          scrollTrigger: {
            trigger: step,
            start: "top 60%",
             once: true,
             onEnter: () => step.querySelector(".pr-dot")?.classList.add("bg-primary"),
              onToggle: (self) => {
                if (self.isActive && number) number.textContent = String(Number(step.dataset.index) + 1).padStart(2, "0");
              },
          },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="proces" ref={ref} className="relative z-10 border-t border-hairline py-24 md:py-40">
      <div className="container-grid grid grid-cols-12 gap-x-4 md:gap-x-8">
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-24">
            <span className="meta">{t.process.label}</span>
            <h2 className="mt-6 font-expanded text-[clamp(3rem,7.5vw,8rem)] uppercase"><MaskedTitle>{t.process.title}</MaskedTitle></h2>
            <span className="pr-current mt-10 hidden font-mono text-[clamp(5rem,10vw,10rem)] leading-none text-primary md:block">01</span>
            <div className="mt-10">
              <Roll href="#kontakt">{t.nav.cta}</Roll>
            </div>
          </div>
        </div>
        <ol ref={listRef} className="relative col-span-12 mt-16 pl-10 md:col-span-6 md:col-start-7 md:mt-0 md:pl-16">
          <svg aria-hidden className="absolute top-2 bottom-2 left-[5px] h-[calc(100%-1rem)] w-[2px] overflow-visible" preserveAspectRatio="none" viewBox="0 0 2 100">
            <line x1="1" y1="0" x2="1" y2="100" stroke="var(--hairline)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line className="pr-path" x1="1" y1="0" x2="1" y2="100" pathLength={1} stroke="var(--primary)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </svg>
          {t.process.steps.map((s, i) => (
            <li key={i} data-index={i} className="pr-step relative pb-20 last:pb-0">
              <span className="pr-dot absolute top-1.5 -left-10 h-3 w-3 border border-primary bg-background transition-colors md:-left-16" />
              <span className="meta text-primary">[ {s.d} ]</span>
              <h3 className="mt-3 font-semi-expanded text-3xl font-extrabold uppercase tracking-tight md:text-5xl">{s.t}</h3>
              <p className="mt-4 max-w-md text-muted-foreground">{s.x}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
