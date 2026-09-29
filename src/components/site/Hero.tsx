import { useEffect, useRef, useState } from "react";
import { useLang, IMAGES } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { Action } from "./ui";
import headphones from "@/assets/hero-headphones.jpg";

export function Hero() {
  const { t, lang } = useLang();
  const ref = useRef<HTMLElement>(null);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      gsap.set(q(".build-part"), { opacity: 0, y: 12 });
      gsap.set(q(".product-reveal"), { clipPath: "inset(100% 0 0)" });
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(q(".hero-wire"), { opacity: 0, duration: .4 })
        .to(q(".product-reveal"), { clipPath: "inset(0% 0 0)", duration: .65 }, "<")
        .to(q(".build-part"), { opacity: 1, y: 0, duration: .45, stagger: .08 }, "-=.25");
    });
    return () => mm.revert();
  }, [lang]);

  useEffect(() => {
    let id: number | undefined;
    const start = () => { if (!id) id = window.setInterval(() => setOrder((n) => (n + 1) % 3), 4200); };
    const stop = () => { if (id) window.clearInterval(id); id = undefined; };
    const visibility = () => document.hidden ? stop() : start();
    visibility(); document.addEventListener("visibilitychange", visibility);
    return () => { stop(); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  return <section id="top" ref={ref} className="relative z-10 pt-28 md:pt-36">
    <div className="container-grid grid grid-cols-12 items-center gap-x-4 gap-y-14 md:min-h-[660px] md:gap-x-8">
      <div className="col-span-12 md:col-span-5">
        <div className="meta text-muted-foreground">{t.hero.eyebrow}</div>
        <h1 className="mt-5 max-w-2xl text-[clamp(2.75rem,6vw,6rem)] font-semibold leading-[.98]">{t.hero.title}</h1>
        <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">{t.hero.sub}</p>
        <div className="mt-9 flex flex-wrap gap-3"><Action href="#kontakt" tone="lime">{t.nav.cta}</Action><Action href="#radovi" tone="outline">{t.hero.secondaryCta}</Action></div>
      </div>
      <div className="col-span-12 md:col-span-6 md:col-start-7">
        <div className="relative border border-hairline bg-card shadow-[0_24px_80px_oklch(0.16_0.006_250/0.12)]">
          <div className="flex h-10 items-center gap-3 border-b border-hairline px-4"><span className="browser-dots h-3"/><span className="mx-auto font-mono text-[10px] text-muted-foreground">shop.radenon.rs/product</span></div>
          <div className="grid min-h-[430px] grid-cols-2 gap-5 p-5 md:min-h-[500px] md:p-8">
            <div className="relative overflow-hidden bg-muted"><div className="hero-wire absolute inset-0 z-10 bg-muted p-5"><span className="block h-full bg-secondary" /></div><img src={headphones} alt={t.hero.mockup.product} width={1200} height={1200} className="product-reveal h-full w-full object-cover object-center" /></div>
            <div className="flex min-w-0 flex-col py-3">
              <span className="build-part meta text-muted-foreground">{t.hero.mockup.category}</span>
              <h2 className="build-part mt-4 text-2xl font-semibold md:text-4xl">{t.hero.mockup.product}</h2>
              <p className="build-part mt-4 font-mono text-lg">4.890 RSD</p>
              <div className="build-part mt-6 space-y-1 text-sm leading-relaxed text-muted-foreground"><p>{t.hero.mockup.description[0]}</p><p>{t.hero.mockup.description[1]}</p></div>
              <button type="button" className="build-part mt-auto min-h-12 bg-foreground px-3 font-semibold text-background transition-transform active:scale-[.98]">{t.hero.mockup.add}</button>
            </div>
          </div>
          <div key={`${lang}-${order}`} className="absolute -right-2 top-full z-20 mt-3 w-[calc(100%+1rem)] animate-[slide-in-right_.45s_cubic-bezier(.16,1,.3,1)] border border-hairline bg-card px-4 py-3 shadow-lg sm:right-0 sm:w-72 md:-right-6"><div className="flex items-center gap-2"><span className="h-2 w-2 shrink-0 rounded-full bg-primary"/><span className="font-mono text-[11px]">{t.hero.mockup.orders[order]}</span></div></div>
        </div>
      </div>
    </div>
    <div className="container-grid mt-16 grid border-y border-hairline sm:grid-cols-2 lg:grid-cols-4">{t.hero.metrics.map((m, i) => <div key={m} className="flex min-h-20 items-center border-b border-hairline px-4 font-mono text-xs sm:border-r lg:border-b-0 first:pl-0 last:border-r-0"><span className="mr-3 text-muted-foreground">0{i + 1}</span>{m}</div>)}</div>
  </section>;
}