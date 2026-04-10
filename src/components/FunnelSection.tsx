import { motion } from "framer-motion";

const stages = [
  {
    tag: "TOFU",
    title: "SVESNOST",
    subtitle: "Privlačenje pažnje",
    items: ["Meta Ads", "Content Creation", "Social Media"],
    color: "border-l-primary",
  },
  {
    tag: "MOFU",
    title: "INTERESOVANJE",
    subtitle: "Konvertovanje interesovanja",
    items: ["SEO Optimizacija", "Google Ads", "Web Sajt"],
    color: "border-l-primary/70",
  },
  {
    tag: "BOFU",
    title: "ZAKLJUČENJE",
    subtitle: "Termin & zaključenje",
    items: ["Zakazivanje termina", "Remarketing", "E-Mail"],
    color: "border-l-primary/40",
  },
];

export function FunnelSection() {
  return (
    <section id="pristup" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Naš pristup</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
            Sistem, ne slučajnost.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md">
            Povezujemo sadržaj, web stranicu i oglašavanje tako da push i pull
            deluju zajedno duž vašeg funnel-a.
          </p>
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 text-primary font-semibold mt-6 hover:underline"
          >
            Na konsultaciju →
          </a>
        </div>
        <div className="space-y-4">
          {stages.map((s, i) => (
            <motion.div
              key={s.tag}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`bg-card border border-border ${s.color} border-l-4 rounded-xl p-5`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-primary font-bold text-xs">{s.tag}</span>
                <span className="text-foreground font-bold">{s.title}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-3">{s.subtitle}</p>
              <div className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <span key={item} className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
