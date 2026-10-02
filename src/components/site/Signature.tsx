import { PointerMark } from "@/components/Logo";
import { useLang } from "@/lib/i18n";
import { MaskedTitle } from "./SiteMotion";
import { Roll, SectionHead } from "./ui";

export function Signature() {
  const { t } = useLang();

  return (
    <section className="relative z-10 py-24 md:py-40">
      <div className="container-grid">
        <SectionHead label={t.signature.label} right="Promet" />

        <div className="grid grid-cols-12 gap-x-4 pt-12 md:gap-x-8 md:pt-20">
          <div className="col-span-12 md:col-span-8">
            <h2 className="font-expanded text-[clamp(2.75rem,6.5vw,7rem)]">
              <MaskedTitle>{t.signature.title}</MaskedTitle>
            </h2>
          </div>
          <p className="col-span-12 mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:col-span-4 md:mt-0 md:self-end md:text-xl">
            {t.signature.intro}
          </p>
        </div>

        <ol className="mt-16 grid border-t border-hairline md:mt-24 md:grid-cols-3">
          {t.signature.steps.map(([title, text], index) => (
            <li key={title} className="border-b border-hairline py-8 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <span className="meta text-primary">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-8 font-semi-expanded text-2xl font-bold md:text-3xl">{title}</h3>
              <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 md:mt-28">
          <div className="meta grid grid-cols-12 gap-x-4 border-y border-hairline py-4 text-muted-foreground md:gap-x-8">
            <span className="col-span-12 md:col-span-4 md:pl-10">{t.signature.exampleHead[0]}</span>
            <span className="hidden md:col-span-8 md:block">{t.signature.exampleHead[1]}</span>
          </div>
          <ul>
            {t.signature.examples.map(([industry, signature]) => (
              <li key={industry} className="group relative grid grid-cols-12 gap-x-4 border-b border-hairline py-6 md:gap-x-8 md:py-7">
                <PointerMark
                  aria-hidden
                  className="absolute left-0 top-1/2 hidden h-6 w-6 -translate-x-2 -translate-y-1/2 opacity-0 transition-[opacity,transform] duration-300 motion-reduce:transition-none md:block md:group-hover:translate-x-0 md:group-hover:opacity-100"
                />
                <h3 className="col-span-12 font-semi-expanded text-xl font-bold md:col-span-4 md:pl-10 md:text-2xl">{industry}</h3>
                <p className="col-span-12 mt-3 max-w-3xl leading-relaxed text-muted-foreground transition-colors duration-300 motion-reduce:transition-none md:col-span-8 md:mt-0 md:group-hover:text-primary">
                  {signature}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 grid grid-cols-12 gap-x-4 border-t border-hairline pt-10 md:mt-24 md:gap-x-8">
          <p className="col-span-12 max-w-2xl font-semi-expanded text-2xl font-bold leading-tight md:col-span-7 md:text-4xl">
            {t.signature.closing}
          </p>
          <div className="col-span-12 mt-8 md:col-span-4 md:col-start-9 md:mt-0 md:self-end">
            <Roll href="#kontakt" variant="solid" className="w-full justify-between">
              {t.nav.cta}
            </Roll>
          </div>
        </div>
      </div>
    </section>
  );
}