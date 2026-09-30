import { useEffect, useRef } from "react";
import { useLang } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { SectionHead } from "./ui";
import { MaskedTitle } from "./SiteMotion";

export function Proof() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>(".count", ref.current).forEach((el) => {
        const end = Number(el.dataset.to);
        const o = { v: 0 };
        el.textContent = "0";
        gsap.to(o, {
          v: end,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
        });
      });
    });
    return () => mm.revert();
  }, []);

  const [h0, h1, h2] = t.proof.compHead;
  return (
    <section ref={ref} className="relative z-10 py-24 md:py-40">
      <div className="container-grid">
        <SectionHead label={t.proof.label} />
        <div className="grid grid-cols-2 md:grid-cols-4">
          {t.proof.stats.map(([n, suf, label], i) => (
            <div key={i} className="border-b border-hairline py-10 pr-4 md:border-b-0 md:py-16">
              <div className="font-expanded text-[clamp(3.5rem,9vw,9rem)] tabular-nums">
                <span className="count" data-to={n}>
                  {n}
                </span>
                <span className="text-primary">{suf}</span>
              </div>
              <span className="meta mt-3 block text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-12 gap-x-4 border-t border-hairline pt-10 md:mt-32 md:gap-x-8">
          <div className="col-span-12 md:col-span-5">
            <h2 className="font-expanded text-[clamp(2.25rem,5vw,5rem)] uppercase"><MaskedTitle>{t.proof.funnelTitle}</MaskedTitle></h2>
            <p className="mt-6 max-w-sm text-muted-foreground">{t.proof.funnelText}</p>
          </div>
          <div className="col-span-12 mt-10 grid md:col-span-7 md:mt-0 md:grid-cols-3">
            {t.proof.funnel.map((f, i) => (
              <div key={f.tag} className="border-t border-hairline py-6 md:border-t-0 md:border-l md:px-6 md:py-0">
                <span className="meta text-primary">{f.tag}</span>
                <h3 className="mt-3 font-semi-expanded text-2xl font-extrabold uppercase">{f.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.s}</p>
                <ul className="mt-6">
                  {f.i.map((x) => (
                    <li key={x} className="border-b border-hairline py-2 text-sm">
                      <span className="meta mr-2 text-muted-foreground">0{i + 1}</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 md:mt-32">
          <h2 className="max-w-4xl font-expanded text-[clamp(2.25rem,5vw,5rem)] uppercase"><MaskedTitle>{t.proof.compTitle}</MaskedTitle></h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-y border-hairline">
                  <th className="meta w-1/4 py-4 pr-4 font-normal text-muted-foreground">{h0}</th>
                  <th className="meta w-[37.5%] py-4 pr-4 font-normal text-muted-foreground">{h1}</th>
                  <th className="meta w-[37.5%] py-4 font-normal text-primary">{h2}</th>
                </tr>
              </thead>
              <tbody>
                {t.proof.comp.map(([c, a, b]) => (
                  <tr key={c} className="border-b border-hairline align-top">
                    <td className="py-6 pr-4 font-semibold">{c}</td>
                    <td className="py-6 pr-4 text-muted-foreground line-through decoration-hairline">{a}</td>
                    <td className="py-6 text-foreground">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
