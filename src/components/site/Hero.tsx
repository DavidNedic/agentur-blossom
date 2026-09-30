import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { Roll } from "./ui";

export function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const [intro, setIntro] = useState(true);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(root);
    mm.add(MOTION_OK, () => {
      const firstVisit = sessionStorage.getItem("radenon-intro") !== "seen";
      const timeline = gsap.timeline();
      if (firstVisit) {
        sessionStorage.setItem("radenon-intro", "seen");
        const counter = { value: 0 };
        timeline
          .to(counter, { value: 100, duration: 0.35, ease: "power2.out", onUpdate: () => {
            const el = root.querySelector(".intro-count");
            if (el) el.textContent = String(Math.round(counter.value)).padStart(3, "0");
          } })
          .to(q(".intro-screen"), { yPercent: -100, duration: 0.3, ease: "power2.out", onComplete: () => setIntro(false) }, 0.3);
      } else setIntro(false);
      gsap.set(q(".hl-in"), { yPercent: 115 });
      gsap.set(q(".hero-fade"), { opacity: 0 });
      timeline
        .to(q(".hl-in"), { yPercent: 0, duration: 0.5, ease: "power2.out", stagger: 0.04 }, firstVisit ? 0.38 : 0)
        .to(q(".hero-fade"), { opacity: 1, duration: 0.45, ease: "power2.out", stagger: 0.04 }, "-=0.35");
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden pt-16">
      {intro && <div className="intro-screen fixed inset-0 z-[80] bg-background"><span className="intro-count meta absolute bottom-6 left-6 text-primary">000</span></div>}
      <div className="container-grid relative flex h-full flex-col">
        <div className="hero-fade grid grid-cols-2 gap-4 border-b border-hairline py-4 md:grid-cols-12">
          <span className="meta md:col-span-4">{t.hero.meta[0]}</span>
          <span className="meta text-primary md:col-span-4">{t.hero.meta[1]}</span>
          <span className="meta hidden text-muted-foreground md:col-span-4 md:block md:text-right">{t.hero.meta[2]}</span>
        </div>

        <h1 className="relative z-10 mt-auto max-w-[1500px] pb-6 font-expanded text-[clamp(2.5rem,min(10.5vw,15svh),15rem)] md:text-[clamp(2.5rem,min(7.8vw,14svh),11rem)] md:pb-8">
          {t.hero.lines.map((line, i) => (
            <span key={i} className="hl line-mask">
              <span className="hl-in block md:whitespace-nowrap">
                {i === t.hero.lines.length - 1 ? (
                  <>
                    {line.split(" ").slice(0, -1).join(" ")} <span className="text-primary">{line.split(" ").slice(-1)}</span>
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>

        <div className="hero-fade relative z-30 grid grid-cols-1 gap-6 border-t border-hairline py-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7"><p className="max-w-2xl text-base text-muted-foreground md:text-lg">{t.hero.sub}</p><p className="meta mt-4 text-foreground">{t.hero.trust}</p></div>
          <div className="flex items-center gap-6 md:col-span-5 md:justify-end">
            <span className="meta hidden text-muted-foreground md:inline">[ {t.hero.scroll} ]</span>
            <Roll href="#kontakt" variant="solid">
              {t.nav.cta}
            </Roll>
          </div>
        </div>
      </div>

    </section>
  );
}
