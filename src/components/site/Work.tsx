import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { SectionHead } from "./ui";

export function Work() {
  const { t } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>(".wk-card", trackRef.current).forEach((card) => {
        const frame = card.querySelector(".wk-frame");
        gsap.fromTo(
          frame,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
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
    <section id="radovi" className="relative z-10">
      <div className="overflow-hidden py-24 md:py-40">
        <div className="container-grid">
          <SectionHead label={t.work.label} right={t.work.count} />
        </div>
        <div
          ref={trackRef}
          className="container-grid grid gap-x-8 gap-y-20 pt-10 md:grid-cols-2"
        >
          <h2 className="font-expanded text-[clamp(4rem,16vw,18rem)] uppercase md:col-span-2">
            {t.work.title}
            <span className="text-primary">.</span>
          </h2>
          {projects.map((p, i) => (
            <article key={p.name} className="wk-card group w-full">
              <div className="wk-frame relative aspect-video overflow-hidden border border-hairline bg-card">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  className="wk-img absolute inset-0 h-full w-full object-contain object-center transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                />
              </div>
              <div className="grid grid-cols-12 gap-x-4 border-b border-hairline pt-5 pb-5">
                <span className="meta col-span-2 text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="meta col-span-3 text-muted-foreground">{p.year}</span>
                <span className="meta col-span-7 text-right text-muted-foreground">{p.type}</span>
              </div>
              <h3 className="mt-4 font-expanded text-[clamp(2.25rem,5vw,5.5rem)] uppercase"><span className="link-draw">{p.name}</span></h3>
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
