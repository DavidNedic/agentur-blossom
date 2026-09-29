import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function Services() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const items = t.services.items;

  useEffect(() => {
    const root = ref.current!;
    const rows = gsap.utils.toArray<HTMLElement>(".sv-row", root);
    const triggers = rows.map((row, i) =>
      ScrollTrigger.create({
        trigger: row,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(i),
      }),
    );
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>(".sv-line", root).forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: line, start: "top 90%", once: true } },
        );
      });
    });
    return () => {
      triggers.forEach((s) => s.kill());
      mm.revert();
    };
  }, []);

  return (
    <section id="usluge" ref={ref} className="relative z-10 py-24 md:py-40">
      <div className="container-grid grid grid-cols-12 gap-x-4 md:gap-x-8">
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-24">
            <span className="meta">{t.services.label}</span>
            <h2 className="mt-6 font-expanded text-[clamp(3rem,7vw,7.5rem)] uppercase">{t.services.title}</h2>
            <p className="mt-6 max-w-sm text-muted-foreground">{t.services.intro}</p>
            <div className="mt-10 hidden items-baseline gap-3 md:flex" aria-hidden>
              <span className="font-expanded text-[clamp(6rem,14vw,14rem)] tabular-nums text-primary">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="meta text-muted-foreground">/ 0{items.length}</span>
            </div>
          </div>
        </div>

        <ol className="col-span-12 mt-12 md:col-span-7 md:mt-0">
          {items.map((s, i) => {
            const isOpen = open === i;
            return (
              <li key={i} className="sv-row relative">
                <span className="sv-line absolute inset-x-0 top-0 h-px origin-left bg-hairline" />
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group grid w-full grid-cols-12 items-baseline gap-x-4 py-6 text-left md:py-8"
                >
                  <span className={cn("meta col-span-2 transition-colors", active === i ? "text-primary" : "text-muted-foreground")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-9 font-semi-expanded text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
                    {s.t}
                  </span>
                  <span
                    aria-hidden
                    className={cn("col-span-1 justify-self-end font-mono text-xl transition-transform duration-300", isOpen && "rotate-45")}
                  >
                    +
                  </span>
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-500 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-12 gap-x-4 pb-8">
                      <p className="col-span-12 text-muted-foreground md:col-span-6 md:col-start-3">{s.d}</p>
                      <div className="col-span-12 mt-6 md:col-span-4 md:mt-0">
                        <span className="meta text-muted-foreground">{t.services.deliverables}</span>
                        <ul className="mt-3">
                          {s.del.map((d) => (
                            <li key={d} className="border-b border-hairline py-2 text-sm">
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
          <li className="relative">
            <span className="sv-line absolute inset-x-0 top-0 h-px origin-left bg-hairline" />
          </li>
        </ol>
      </div>
    </section>
  );
}
