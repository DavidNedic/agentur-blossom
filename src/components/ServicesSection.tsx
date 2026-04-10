import { Globe, Search, Share2, Megaphone, Code, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Globe,
    title: "Izrada Web Sajtova",
    description: "Profesionalan, responzivan dizajn prilagođen vašem biznisu sa SSL i SEO osnovama.",
  },
  {
    icon: Search,
    title: "SEO Optimizacija",
    description: "On-page SEO, istraživanje ključnih reči i mesečni izveštaji za bolji rang na Google-u.",
  },
  {
    icon: Share2,
    title: "Social Media",
    description: "Kreiranje sadržaja za Instagram i Facebook — 12 objava mesečno sa analitikom.",
  },
  {
    icon: Megaphone,
    title: "Meta & TikTok Ads",
    description: "Performance kampanje zasnovane na podacima sa upravljanjem budžetom i nedeljnim izveštajima.",
  },
  {
    icon: Code,
    title: "Održavanje Sajta",
    description: "Mesečno ažuriranje sadržaja, tehnička podrška, backup i bezbednost.",
  },
  {
    icon: BarChart3,
    title: "Google Ads (SEA)",
    description: "Google oglašavanje sa landing stranicama optimizovanim za konverziju.",
  },
];

export function ServicesSection() {
  return (
    <section id="usluge" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Šta nudimo</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3">Naše usluge.</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Sve iz jednog mesta — sajt, SEO i oglasi strateški povezani.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
