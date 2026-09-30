import { useLang } from "@/lib/i18n";
import { MaskedTitle } from "./SiteMotion";

export function GermanStandard() {
  const { t } = useLang();
  const [kind, qualification, country, markets] = t.standard.certificate;

  return (
    <section className="relative z-10 bg-paper py-24 text-ink md:py-40">
      <div className="container-grid">
        <div className="flex items-center justify-between border-t border-paper-hairline py-4">
          <span className="meta">{t.standard.label}</span>
          <span className="meta text-ink-muted">DE / RS</span>
        </div>
        <div className="grid grid-cols-12 gap-x-4 pt-12 md:gap-x-8 md:pt-20">
          <div className="col-span-12 md:col-span-7">
            <h2 className="font-expanded text-[clamp(2.75rem,6.5vw,7rem)] leading-[0.92]"><MaskedTitle>{t.standard.title}</MaskedTitle></h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted md:text-xl">{t.standard.intro}</p>
          </div>
          <div className="col-span-12 mt-12 border border-paper-hairline p-6 md:col-span-4 md:col-start-9 md:mt-0 md:p-8">
            <div className="flex items-start justify-between border-b border-paper-hairline pb-8">
              <span className="meta text-ink-muted">{kind}</span>
              <span className="h-3 w-3 bg-deep-cyan" />
            </div>
            <strong className="mt-12 block font-expanded text-3xl leading-tight md:text-4xl">{qualification}</strong>
            <div className="meta mt-16 flex justify-between border-t border-paper-hairline pt-4 text-ink-muted"><span>{country}</span><span>{markets}</span></div>
          </div>
        </div>
        <div className="mt-16 grid border-t border-paper-hairline md:mt-24 md:grid-cols-2">
          {t.standard.points.map(([n, title, text]) => (
            <article key={n} className="grid grid-cols-12 gap-4 border-b border-paper-hairline py-8 md:px-6 md:first:pl-0 md:even:border-l">
              <span className="meta col-span-2 text-ink-muted">{n}</span>
              <div className="col-span-10"><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 max-w-md text-ink-muted">{text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}