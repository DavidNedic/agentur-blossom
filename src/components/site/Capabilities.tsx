import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { SectionHead } from "./ui";
import { MaskedTitle } from "./SiteMotion";

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
        <h2 className="max-w-5xl pt-10 pb-16 font-expanded text-[clamp(2.5rem,6.5vw,7rem)]"><MaskedTitle>{t.caps.title}</MaskedTitle></h2>
        <div className="grid border-t border-hairline md:grid-cols-2">
          {t.caps.items.map((c, i) => (
            <div key={i} className={`cap-card border-b border-hairline py-10 md:p-12 ${i % 2 ? "md:border-l" : ""}`}>
                <div className="grid h-full grid-cols-12 gap-x-4">
                  <div className="col-span-12 flex items-start justify-between md:col-span-2">
                    <span className="meta text-primary">0{i + 1}</span>
                  </div>
                  <div className="col-span-12 mt-8 flex flex-col justify-between md:col-span-9 md:col-start-4 md:mt-0">
                    <div>
                      <span className="meta text-muted-foreground">{c.k}</span>
                      <h3 className="mt-4 font-semi-expanded text-[clamp(2rem,3.5vw,3.5rem)] font-extrabold leading-[1.02]">
                        {c.t}
                      </h3>
                      <p className="mt-6 max-w-xl text-muted-foreground md:text-lg">{c.d}</p>
                    </div>
                    <ul className="mt-10 grid grid-cols-2 border-t border-hairline">
                      {c.tags.map((tag) => (
                        <li key={tag} className="meta border-b border-hairline py-3 pr-4">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
