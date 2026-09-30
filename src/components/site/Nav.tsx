import { useEffect, useRef, useState } from "react";
import { useLang, type Lang } from "@/lib/i18n";
import { Roll } from "./ui";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

export function Wordmark() {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="Klik Digital">
      <Logo className="h-6 md:h-7" />
      <span className="meta text-muted-foreground">Digital</span>
    </a>
  );
}

export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={cn("meta flex items-center gap-1", className)} role="group" aria-label="Language">
      {(["sr", "en"] as Lang[]).map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-muted-foreground">/</span>}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={cn("px-1 py-2 transition-colors", lang === l ? "text-primary" : "text-muted-foreground hover:text-foreground")}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}

export function Nav() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(t.nav.links[0]?.[0] ?? "");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 8) return;
      header.style.transform = y > 120 && delta > 0 && !open ? "translateY(-100%)" : "translateY(0)";
      lastY = y;
    };

    const sections = t.nav.links.map(([label, href]) => ({ label, node: document.querySelector(href) })).filter((x) => x.node);
    const observer = new IntersectionObserver((entries) => {
      const active = entries.find((entry) => entry.isIntersecting);
      const item = sections.find((section) => section.node === active?.target);
      if (item) setCurrent(item.label);
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(({ node }) => node && observer.observe(node));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [open, t.nav.links]);
  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background transition-transform duration-300 motion-reduce:transition-none">
      <div className="container-grid flex h-16 items-center justify-between">
        <Wordmark />
        <span className="meta hidden text-primary xl:block">[ {current} ]</span>
        <nav className="hidden items-center gap-8 lg:flex">
          {t.nav.links.map(([l, h], i) => (
            <a key={h} href={h} className="meta link-draw py-1 text-foreground">
              <span className="mr-1.5 text-muted-foreground">0{i + 1}</span>
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LangSwitch />
          <Roll href="#kontakt" className="hidden h-10 px-5 md:inline-flex">
            {t.nav.cta}
          </Roll>
          <button
            type="button"
            className="meta py-2 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="h-[calc(100svh-4rem)] border-t border-hairline bg-background lg:hidden">
          <nav className="container-grid flex h-full flex-col justify-between py-8">
            <ul>
              {t.nav.links.map(([l, h], i) => (
                <li key={h} className="border-b border-hairline">
                  <a href={h} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-4">
                    <span className="meta text-muted-foreground">0{i + 1}</span>
                    <span className="font-expanded text-4xl uppercase">{l}</span>
                  </a>
                </li>
              ))}
            </ul>
            <Roll href="#kontakt" variant="solid" onClick={() => setOpen(false)} className="w-full justify-between">
              {t.nav.cta}
            </Roll>
          </nav>
        </div>
      )}
    </header>
  );
}
