import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { MaskedTitle } from "./SiteMotion";

export function Services() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const items = t.services.items;

  useEffect(() => {
    const root = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>(".sv-line", root).forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: line, start: "top 90%", once: true } },
        );
      });
    });
    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section id="usluge" ref={ref} className="relative z-10 py-24 md:py-40">
      <div className="container-grid">
        <div className="grid grid-cols-12 gap-x-4 border-b border-hairline pb-16 md:gap-x-8">
          <div className="col-span-12 md:col-span-7">
            <span className="meta">{t.services.label}</span>
            <h2 className="mt-6 font-expanded text-[clamp(3rem,7vw,7rem)]"><MaskedTitle>{t.services.title}</MaskedTitle></h2>
          </div>
          <p className="col-span-12 mt-8 max-w-md text-lg text-muted-foreground md:col-span-4 md:col-start-9 md:mt-0 md:self-end">{t.services.intro}</p>
        </div>

        <ol>
          {items.map((s, i) => {
            const isOpen = open === i;
            return (
              <li
                key={i}
                className="sv-row relative"
                onPointerMove={(e) => {
                  // Only open on a real mouse movement, not when the page scrolls under a resting cursor.
                  if (e.pointerType !== "mouse" || (e.movementX === 0 && e.movementY === 0)) return;
                  if (open !== i) setOpen(i);
                }}
                onMouseLeave={() => setOpen(null)}
              >
                <span className="sv-line absolute inset-x-0 top-0 h-px origin-left bg-hairline" />
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  onFocus={() => setOpen(i)}
                  className="group grid w-full grid-cols-12 items-start gap-x-4 py-8 text-left md:gap-x-8 md:py-12"
                >
                   <span className="meta col-span-2 pt-2 text-muted-foreground md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="col-span-9 font-expanded text-[clamp(2rem,4.3vw,4.75rem)] leading-[0.96] md:col-span-6">
                    {s.t}
                  </span>
                  <span className="col-span-12 mt-5 text-muted-foreground md:col-span-3 md:mt-0">{s.d}</span>
                  <span className="meta col-span-10 col-start-3 mt-4 text-muted-foreground md:col-span-1 md:col-start-auto md:mt-1">{t.services.example}<br /><span className="text-foreground">{s.example}</span></span>
                  <span
                    aria-hidden
                    className={cn("absolute right-0 top-8 justify-self-end font-mono text-xl transition-transform duration-300 md:static", isOpen && "rotate-45")}
                  >
                    +
                  </span>
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-500 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-12 gap-x-4 pb-10 md:gap-x-8">
                      <div className="col-span-10 col-start-3 md:col-span-10 md:col-start-2">
                        <span className="meta text-muted-foreground">{t.services.deliverables}</span>
                        <ul className="mt-4 grid md:grid-cols-4">
                          {s.del.map((d) => (
                            <li key={d} className="border-t border-hairline py-3 text-sm md:pr-6">
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
