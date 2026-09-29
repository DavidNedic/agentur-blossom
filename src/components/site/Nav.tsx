import { useState } from "react";
import { useLang, type Lang } from "@/lib/i18n";
import { Action } from "./ui";
import { cn } from "@/lib/utils";

export function Wordmark() {
  return <a href="#top" className="flex items-center gap-2 font-semibold" aria-label="Radenon Digital"><span>Radenon</span><span className="text-sm font-normal text-muted-foreground">Digital</span></a>;
}

export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return <div className={cn("flex items-center gap-1 font-mono text-xs", className)} role="group" aria-label="Language">{(["sr", "en"] as Lang[]).map((l) => <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} className={cn("px-2 py-2 uppercase transition-colors", lang === l ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>{l}</button>)}</div>;
}

export function Nav() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background/95 backdrop-blur-sm">
    <div className="container-grid grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:grid-cols-[auto_1fr_auto]">
      <Wordmark />
      <nav className="hidden justify-center gap-7 lg:flex">{t.nav.links.map(([label, href]) => <a key={href} href={href} className="nav-link">{label}</a>)}</nav>
      <div className="flex shrink-0 items-center gap-2"><LangSwitch /><Action href="#kontakt" tone="ink" className="hidden h-10 px-4 md:inline-flex">{t.nav.cta}</Action><button type="button" className="font-mono text-xs lg:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? t.nav.close : t.nav.menu}</button></div>
    </div>
    {open && <nav className="border-t border-hairline bg-background px-6 py-5 lg:hidden">{t.nav.links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-hairline py-4 text-xl font-medium">{label}</a>)}<Action href="#kontakt" tone="lime" className="mt-6 w-full justify-between" onClick={() => setOpen(false)}>{t.nav.cta}</Action></nav>}
  </header>;
}