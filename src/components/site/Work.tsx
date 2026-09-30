import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { SectionHead } from "./ui";
import { MaskedTitle } from "./SiteMotion";

export function Work() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const travel = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const horizontal = gsap.to(track, {
        x: () => -travel(),
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: () => `+=${travel()}`, pin: true, scrub: 0.5, invalidateOnRefresh: true },
      });
      gsap.utils.toArray<HTMLElement>(".wk-card", track).forEach((card) => {
        const image = card.querySelector(".wk-img");
        if (!image) return;
        gsap.fromTo(image, { xPercent: -2 }, {
          xPercent: 2,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: horizontal, start: "left right", end: "right left", scrub: 0.5 },
        });
      });
    });
    mm.add(`${MOTION_OK} and (max-width: 767px)`, () => {
      gsap.utils.toArray<HTMLElement>(".wk-card", trackRef.current).forEach((card) => {
        const reveal = card.querySelector(".wk-reveal");
        gsap.fromTo(
          reveal,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 82%", once: true },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  const projects = t.work.projects;
  return (
    <section id="radovi" ref={sectionRef} className="relative z-10 overflow-hidden">
      <div className="py-24 md:flex md:h-screen md:flex-col md:py-16">
        <div className="container-grid">
          <SectionHead label={t.work.label} right={t.work.count} />
        </div>
        <h2 className="velocity-type container-grid mt-6 shrink-0 origin-left font-expanded text-[clamp(4rem,16vw,13rem)] uppercase">
          <MaskedTitle>{t.work.title}<span className="text-primary">.</span></MaskedTitle>
        </h2>
        <div ref={trackRef} className="container-grid grid gap-y-20 pt-10 md:flex md:min-w-max md:flex-1 md:gap-8">
          {projects.map((p, i) => (
            <article key={p.name} className="wk-card group w-full md:grid md:w-[min(78vw,1120px)] md:shrink-0 md:grid-cols-12 md:gap-x-8">
              <div className="wk-frame relative aspect-video overflow-hidden border border-hairline bg-card md:col-span-8">
                <picture className="wk-reveal absolute inset-0 block overflow-hidden">
                  <source srcSet={p.image.avif} type="image/avif" />
                  <img src={p.image.webp} alt={p.name} width={p.image.width} height={p.image.height} loading="lazy" decoding="async" className="wk-img h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:scale-[1.02] motion-reduce:transition-none" />
                </picture>
              </div>
              <div className="md:col-span-4 md:flex md:flex-col">
              <div className="grid grid-cols-12 gap-x-4 border-b border-hairline py-5">
                <span className="meta col-span-2 text-muted-foreground transition-colors group-hover:text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="meta col-span-3 text-muted-foreground">{p.year}</span>
                <span className="meta col-span-7 text-right text-muted-foreground">{p.type}</span>
              </div>
              <h3 className="mt-4 overflow-wrap-anywhere font-expanded text-[clamp(2rem,2.5vw,3.5rem)] uppercase"><span className="link-draw">{p.name}</span></h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-8">
                <p className="max-w-md text-muted-foreground">{p.desc}</p>
                <p className="meta text-muted-foreground md:text-right">
                  {p.stack}
                  <br />
                  {p.url}
                </p>
              </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
