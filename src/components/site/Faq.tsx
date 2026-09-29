import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="relative z-10 py-24 md:py-40">
      <div className="container-grid grid grid-cols-12 gap-x-4 md:gap-x-8">
        <div className="col-span-12 md:col-span-4">
          <span className="meta">{t.faq.label}</span>
          <h2 className="mt-6 font-expanded text-[clamp(3rem,7vw,7.5rem)] uppercase">{t.faq.title}</h2>
        </div>
        <ul className="col-span-12 mt-12 border-t border-hairline md:col-span-8 md:mt-0">
          {t.faq.items.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <li key={i} className="border-b border-hairline">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="grid w-full grid-cols-12 items-baseline gap-x-4 py-6 text-left"
                >
                  <span className="meta col-span-2 text-muted-foreground md:col-span-1">0{i + 1}</span>
                  <span className="col-span-9 text-lg font-semibold md:col-span-10 md:text-2xl">{q}</span>
                  <span aria-hidden className={cn("col-span-1 justify-self-end font-mono text-xl transition-transform duration-300", isOpen && "rotate-45 text-primary")}>
                    +
                  </span>
                </button>
                <div id={`faq-${i}`} className={cn("grid transition-[grid-template-rows] duration-500 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-8 text-muted-foreground md:pl-[8.33%]">{a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
