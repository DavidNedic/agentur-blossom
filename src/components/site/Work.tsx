import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, ScrollTrigger, DESKTOP_MOTION, MOBILE_MOTION } from "@/lib/motion";
import { SectionHead } from "./ui";

export function Work() {
  const { t } = useLang();
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const track = trackRef.current!;

    mm.add(DESKTOP_MOTION, () => {
      track.classList.add("is-h");
      ScrollTrigger.refresh();
      const dist = () => track.scrollWidth - window.innerWidth + 80;
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: pinRef.current,
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${dist()}`,
          invalidateOnRefresh: true,
        },
      });
      gsap.utils.toArray<HTMLElement>(".wk-card", track).forEach((card) => {
        const frame = card.querySelector(".wk-frame");
        const img = card.querySelector(".wk-img");
        gsap.fromTo(
          frame,
          { clipPath: "inset(14% 10% 14% 10%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 35%", scrub: true },
          },
        );
        gsap.fromTo(
          img,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          },
        );
      });
      return () => track.classList.remove("is-h");
    });

    mm.add(MOBILE_MOTION, () => {
      gsap.utils.toArray<HTMLElement>(".wk-card", track).forEach((card) => {
        gsap.fromTo(
          card.querySelector(".wk-img"),
          { yPercent: -4 },
          { yPercent: 4, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    });

    return () => mm.revert();
  }, []);

  const projects = t.work.projects;
  return (
    <section id="radovi" className="relative z-10">
      <div ref={pinRef} className="overflow-hidden py-16 lg:flex lg:h-[100svh] lg:flex-col lg:py-0 lg:pt-20">
        <div className="container-grid">
          <SectionHead label={t.work.label} right={t.work.count} />
        </div>
        <div
          ref={trackRef}
          className="container-grid flex flex-col gap-20 pt-10 will-change-transform [&.is-h]:my-auto [&.is-h]:w-max [&.is-h]:max-w-none [&.is-h]:flex-row [&.is-h]:items-end [&.is-h]:gap-[5vw] [&.is-h]:pt-0"
        >
          <h2 className="font-expanded text-[clamp(4rem,16vw,18rem)] uppercase [.is-h_&]:self-center [.is-h_&]:pr-[4vw]">
            {t.work.title}
            <span className="text-primary">.</span>
          </h2>
          {projects.map((p, i) => (
            <article key={p.name} className="wk-card w-full [.is-h_&]:w-[min(56vw,92vh)]">
              <div className="wk-frame relative aspect-video overflow-hidden border border-hairline bg-card [.is-h_&]:w-[min(56vw,92vh)]">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="wk-img absolute inset-0 h-full w-full object-contain object-center will-change-transform"
                />
              </div>
              <div className="grid grid-cols-12 gap-x-4 border-b border-hairline pt-5 pb-5">
                <span className="meta col-span-2 text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="meta col-span-3 text-muted-foreground">{p.year}</span>
                <span className="meta col-span-7 text-right text-muted-foreground">{p.type}</span>
              </div>
              <h3 className="mt-4 font-expanded text-[clamp(2.25rem,5vw,5.5rem)] uppercase">{p.name}</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2 md:gap-8">
                <p className="max-w-md text-muted-foreground">{p.desc}</p>
                <p className="meta text-muted-foreground md:text-right">
                  {p.stack}
                  <br />
                  {p.url}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
