import { useLang } from "@/lib/i18n";

export function Marquee() {
  const { t } = useLang();

  return (
    <section aria-label="Services" className="relative z-10 border-y border-hairline bg-background">
      <div className="container-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {t.marquee.map((word, i) => (
          <span key={word} className={`meta py-5 ${i % 2 ? "text-muted-foreground" : "text-foreground"} max-lg:border-b max-lg:border-hairline lg:border-r lg:border-hairline lg:px-5 first:lg:pl-0 last:lg:border-r-0`}>
            {String(i + 1).padStart(2, "0")} / {word}
          </span>
        ))}
      </div>
    </section>
  );
}
