import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { SectionHead } from "./ui";

export function Capabilities() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>(".cap-card", ref.current),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: ref.current, start: "top 72%", once: true } },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="relative z-10 pb-24 md:pb-40">
      <div className="container-grid">
        <SectionHead label={t.caps.label} right="Stripe / PayPal / COD" />
        <h2 className="max-w-5xl pt-10 pb-16 font-expanded text-[clamp(2.5rem,6.5vw,7rem)] uppercase">{t.caps.title}</h2>
        <div className="grid gap-px bg-hairline md:grid-cols-2">
          {t.caps.items.map((c, i) => (
            <div key={i} className="cap-card bg-background">
              <div className="relative h-full overflow-hidden bg-card">
                <div className="grid min-h-[440px] grid-cols-12 gap-x-4 p-6 md:p-10">
                  <div className="col-span-12 flex items-start justify-between md:col-span-3 md:flex-col">
                    <span className="meta text-primary">0{i + 1} / 04</span>
                    <span className="font-expanded text-[clamp(5rem,12vw,12rem)] leading-none text-outline">0{i + 1}</span>
                  </div>
                  <div className="col-span-12 mt-8 flex flex-col justify-between md:col-span-8 md:col-start-5 md:mt-0">
                    <div>
                      <span className="meta text-muted-foreground">{c.k}</span>
                      <h3 className="mt-4 font-semi-expanded text-[clamp(2rem,4.5vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight">
                        {c.t}
                      </h3>
                      <p className="mt-6 max-w-xl text-muted-foreground md:text-lg">{c.d}</p>
                    </div>
                    <ul className="mt-10 grid grid-cols-2 border-t border-hairline md:grid-cols-4">
                      {c.tags.map((tag) => (
                        <li key={tag} className="meta border-b border-hairline py-3 pr-4">
                          [ {tag} ]
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
