import { useEffect, useRef, useState } from "react";
import { useLang, CONTACT } from "@/lib/i18n";
import { gsap, MOTION_OK } from "@/lib/motion";
import { Roll, Arrow } from "./ui";
import { Wordmark, LangSwitch } from "./Nav";

function Clock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = () =>
      setTime(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Belgrade" }).format(new Date()));
    fmt();
    const id = setInterval(fmt, 15000);
    return () => clearInterval(id);
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

export function Contact() {
  const { t } = useLang();
  const ref = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        ref.current!.querySelectorAll(".ct-line"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 72%", once: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    const text = `*Nova poruka sa sajta*%0A%0A*Ime:* ${encodeURIComponent(form.name)}%0A*E-mail:* ${encodeURIComponent(form.email)}%0A*Poruka:* ${encodeURIComponent(form.message)}`;
    window.open(`https://wa.me/${CONTACT.wa}?text=${text}`, "_blank");
    setForm({ name: "", email: "", message: "" });
  };

  const field =
    "w-full border-0 border-b border-input bg-transparent py-4 text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary";

  return (
    <section id="kontakt" ref={ref} className="relative z-10 flex min-h-[100svh] flex-col overflow-hidden border-t border-hairline bg-background">
      <div className="container-grid flex flex-1 flex-col pt-10">
        <span className="meta">{t.contact.label}</span>
        <h2 className="ct-big mt-10 font-expanded text-[clamp(3.25rem,14.5vw,18rem)] uppercase">
          <span className="line-mask"><span className="ct-line block">{t.contact.big[0]}</span></span>
          <span className="line-mask"><span className="ct-line block text-primary">{t.contact.big[1]}</span></span>
        </h2>

        <div className="mt-16 grid grid-cols-12 gap-x-4 border-t border-hairline pt-10 md:gap-x-8">
          <div className="col-span-12 md:col-span-6">
            <p className="max-w-md text-muted-foreground md:text-lg">{t.contact.text}</p>
            <ul className="mt-10 border-t border-hairline">
              {[
                ["WhatsApp", CONTACT.phone, `https://wa.me/${CONTACT.wa}`, true],
                ["E-mail", CONTACT.email, `mailto:${CONTACT.email}`, false],
                ["Tel", CONTACT.phone, `tel:${CONTACT.tel}`, false],
              ].map(([k, v, h, ext]) => (
                <li key={k as string} className="border-b border-hairline">
                  <a
                    href={h as string}
                    {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group grid grid-cols-12 items-baseline gap-x-4 py-5"
                  >
                    <span className="meta col-span-3 text-muted-foreground">{k}</span>
                    <span className="col-span-8 truncate font-semi-expanded text-xl font-bold md:text-3xl">
                      <span className="link-draw">{v}</span>
                    </span>
                    <Arrow className="col-span-1 justify-self-end transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={submit} className="col-span-12 mt-16 md:col-span-5 md:col-start-8 md:mt-0">
            <label className="block">
              <span className="meta text-muted-foreground">{t.contact.name}</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder={t.contact.namePh}
                className={field}
              />
            </label>
            <label className="mt-8 block">
              <span className="meta text-muted-foreground">{t.contact.email}</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="ime@firma.rs"
                className={field}
              />
            </label>
            <label className="mt-8 block">
              <span className="meta text-muted-foreground">{t.contact.message}</span>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder={t.contact.msgPh}
                className={`${field} resize-none`}
              />
            </label>
            <div className="mt-10">
              <Roll type="submit" className="w-full justify-between">
                {t.contact.send}
              </Roll>
            </div>
          </form>
        </div>
      </div>

      <footer className="container-grid mt-24 grid grid-cols-2 items-center gap-6 border-t border-hairline py-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <Wordmark />
        </div>
        <span className="meta text-right text-muted-foreground md:col-span-3 md:text-left">
          {t.contact.clock} <Clock />
        </span>
        <span className="meta col-span-2 text-muted-foreground md:col-span-4">
          © {new Date().getFullYear()} Radenon Digital. {t.contact.rights}
        </span>
        <LangSwitch className="col-span-2 md:col-span-2 md:justify-self-end" />
      </footer>
    </section>
  );
}
