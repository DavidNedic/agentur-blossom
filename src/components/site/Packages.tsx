import { useLang } from "@/lib/i18n";
import { Roll } from "./ui";
import { MaskedTitle } from "./SiteMotion";

export function Packages() {
  const { t } = useLang();
  return (
    <section id="paketi" className="relative z-10 bg-paper py-24 text-ink md:py-40">
      <div className="container-grid">
        <div className="flex items-center justify-between border-t border-paper-hairline py-4">
          <span className="meta">{t.packages.label}</span>
          <span className="meta text-ink-muted">EUR</span>
        </div>
        <div className="grid grid-cols-12 gap-x-4 pt-10 pb-16 md:gap-x-8">
          <h2 className="col-span-12 font-expanded text-[clamp(2.75rem,7vw,8rem)] uppercase md:col-span-9"><MaskedTitle>{t.packages.title}</MaskedTitle></h2>
          <p className="col-span-12 mt-6 max-w-xs text-ink-muted md:col-span-3 md:mt-0 md:self-end">{t.packages.note}</p>
        </div>
        <div className="grid border-t border-paper-hairline md:grid-cols-3">
          {t.packages.items.map((p, i) => (
            <article
              key={p.n}
              className={`flex flex-col border-b border-paper-hairline py-10 md:border-b-0 md:px-8 md:py-12 ${i > 0 ? "md:border-l" : "md:pl-0"} ${i === 2 ? "md:pr-0" : ""}`}
            >
              <span className="meta">{p.n}</span>
              <h3 className="mt-6 font-semi-expanded text-2xl font-extrabold uppercase leading-tight">{p.t}</h3>
              <p className="mt-2 text-ink-muted">{p.s}</p>
              <div className="mt-10 flex items-baseline gap-3">
                <span className="meta text-ink-muted">{t.packages.from}</span>
                <span className="font-expanded text-[clamp(3.5rem,6vw,6rem)]">{p.p}</span>
              </div>
              <span className="meta mt-2 text-ink-muted">{p.pn}</span>
              <ul className="mt-10 flex-1 border-t border-paper-hairline">
                {p.f.map((f) => (
                  <li key={f} className="border-b border-paper-hairline py-3 text-sm">
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Roll href="#kontakt" variant="ink" className="w-full justify-between">
                  {t.nav.cta}
                </Roll>
              </div>
            </article>
          ))}
        </div>
        <p className="meta mt-10 border-t border-paper-hairline pt-6">{t.packages.shop}</p>
      </div>
    </section>
  );
}
