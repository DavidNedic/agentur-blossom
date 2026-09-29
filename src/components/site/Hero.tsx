import { useEffect, useRef } from "react";
import { useLang, IMAGES } from "@/lib/i18n";
import { gsap, MOTION_OK, onReady } from "@/lib/motion";
import { Roll } from "./ui";

const floats = [
  { src: IMAGES.unearthed, cls: "left-[4%] top-[58%] w-[46vw] md:w-[26vw]", depth: 70, rot: -4 },
  { src: IMAGES.adriaticum, cls: "right-[6%] top-[46%] w-[40vw] md:w-[22vw]", depth: 110, rot: 3 },
  { src: IMAGES.crowdplay, cls: "left-[38%] top-[72%] w-[42vw] md:w-[20vw]", depth: 150, rot: 2 },
  { src: IMAGES.tippr, cls: "right-[28%] top-[82%] hidden md:block md:w-[16vw]", depth: 190, rot: -3 },
];

export function Hero() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current!;
    const mm = gsap.matchMedia();
    const q = gsap.utils.selector(root);
    let off = () => {};

    mm.add(MOTION_OK, () => {
      gsap.set(q(".hl-in"), { yPercent: 115 });
      gsap.set(q(".hero-fade"), { opacity: 0 });
      off = onReady(() => {
        gsap
          .timeline()
          .to(q(".hl-in"), { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.08 })
          .to(q(".hero-fade"), { opacity: 1, duration: 0.6, stagger: 0.06 }, "-=0.7");
      });
    });

    mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top top", end: "+=110%", scrub: 0.6, pin: true },
      });
      q(".hl").forEach((el, i) => {
        tl.to(el, { yPercent: -60 - i * 45, scale: 0.82, transformOrigin: "left bottom", ease: "none" }, 0);
      });
      q(".float").forEach((el, i) => {
        const f = floats[i];
        tl.fromTo(el, { y: "70vh", rotate: f.rot }, { y: `-${f.depth}vh`, rotate: -f.rot / 2, ease: "none" }, 0);
      });
    });

    mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
      q(".float").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 40 + i * 30, rotate: floats[i].rot },
          { y: -80 - i * 60, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } },
        );
      });
    });

    return () => {
      off();
      mm.revert();
    };
  }, []);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden pt-16">
      <div className="container-grid relative flex h-full flex-col">
        <div className="hero-fade grid grid-cols-2 gap-4 border-b border-hairline py-4 md:grid-cols-12">
          <span className="meta md:col-span-4">{t.hero.meta[0]}</span>
          <span className="meta text-primary md:col-span-4">{t.hero.meta[1]}</span>
          <span className="meta hidden text-muted-foreground md:col-span-4 md:block md:text-right">{t.hero.meta[2]}</span>
        </div>

        <h1 className="relative z-10 mt-auto pb-6 font-expanded text-[clamp(2.75rem,11.5vw,15rem)] uppercase md:pb-10">
          {t.hero.lines.map((line, i) => (
            <span key={i} className="hl line-mask">
              <span className={`hl-in block ${i === 3 ? "text-primary" : ""}`}>{line}</span>
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
            className={`float absolute aspect-[16/10] border border-hairline object-cover object-top will-change-transform ${f.cls}`}
          />
        ))}
      </div>
    </section>
  );
}
