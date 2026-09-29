import { useEffect, useRef } from "react";
import { useLang, IMAGES } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { Roll } from "./ui";

const floats = [
  { src: IMAGES.adriaticum, cls: "right-10 top-32 hidden w-[min(20vw,320px)] md:block", shift: 24 },
];

export function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(root);
    mm.add(MOTION_OK, () => {
      gsap.set(q(".hl-in"), { yPercent: 115 });
      gsap.set(q(".hero-fade"), { opacity: 0 });
      gsap
        .timeline()
        .to(q(".hl-in"), { yPercent: 0, duration: 0.6, ease: "power2.out", stagger: 0.06 })
        .to(q(".hero-fade"), { opacity: 1, duration: 0.45, ease: "power2.out", stagger: 0.04 }, "-=0.35");
      q(".float").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 0 },
          { y: floats[i]?.shift ?? 0, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden pt-16">
      <div className="container-grid relative flex h-full flex-col">
        <div className="hero-fade grid grid-cols-2 gap-4 border-b border-hairline py-4 md:grid-cols-12">
          <span className="meta md:col-span-4">{t.hero.meta[0]}</span>
          <span className="meta text-primary md:col-span-4">{t.hero.meta[1]}</span>
          <span className="meta hidden text-muted-foreground md:col-span-4 md:block md:text-right">{t.hero.meta[2]}</span>
        </div>

        <h1 className="relative z-10 mt-auto pb-6 font-expanded text-[clamp(2.5rem,min(10.5vw,15svh),15rem)] md:text-[clamp(2.5rem,min(8.1vw,15svh),14rem)] uppercase md:pb-10">
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

        <div className="hero-fade relative z-30 grid grid-cols-1 gap-6 border-t border-hairline py-6 md:grid-cols-12 md:items-center">
          <p className="max-w-md text-base text-muted-foreground md:col-span-6 md:text-lg">{t.hero.sub}</p>
          <div className="flex items-center gap-6 md:col-span-6 md:justify-end">
            <span className="meta hidden text-muted-foreground md:inline">[ {t.hero.scroll} ]</span>
            <Roll href="#kontakt" variant="solid">
              {t.nav.cta}
            </Roll>
          </div>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
        {floats.map((f, i) => (
          <img
            key={i}
            src={f.src}
            alt=""
            fetchPriority={i === 0 ? "high" : "auto"}
            className={`float absolute aspect-video border border-hairline object-contain object-center will-change-transform ${f.cls}`}
          />
        ))}
      </div>
    </section>
  );
}
