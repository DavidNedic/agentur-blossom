import { PricingCard } from "./PricingCard";
import { motion } from "framer-motion";

const packages = [
  {
    number: "01",
    title: "Izrada Veb Sajta",
    subtitle: "Profesionalan sajt, brza isporuka",
    price: "199 EUR",
    priceNote: "jednokratno plaćanje",
    features: [
      "Moderan responzivan dizajn",
      "Do 7 stranica sadržaja",
      "Osnovna SEO optimizacija",
      "SSL + domen + hosting 1 god.",
      "Predaja za 14 radnih dana",
    ],
  },
  {
    number: "02",
    title: "Izrada + Održavanje",
    subtitle: "Sajt koji uvek radi besprekorno",
    price: "199 EUR",
    priceNote: "+ 49 EUR / mesečno",
    features: [
      "Sve iz paketa 01",
      "Mesečno tehničko održavanje",
      "Ažuriranje sadržaja i plugina",
      "Backup i bezbednost sajta",
      "Prioritetna tehnička podrška",
    ],
  },
  {
    number: "03",
    title: "Izrada + Održavanje + SEO",
    subtitle: "Budite na prvoj strani Googlea",
    price: "349 EUR",
    priceNote: "+ 99 EUR / mesečno",
    popular: true,
    features: [
      "Sve iz paketa 02",
      "On-page SEO optimizacija",
      "Istraživanje ključnih reči",
      "Izgradnja linkova (link building)",
      "Mesečni izveštaji i analitika",
    ],
  },
];

export function PricingSection() {
  return (
    <section id="paketi" className="py-20 bg-card/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">Paketi</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3">Vaš pouzdan digitalni partner.</h2>
          <p className="text-muted-foreground mt-4">
            Sve cene važe za period od 6 meseci • Bez skrivenih troškova • Individualni paketi dostupni
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <PricingCard {...pkg} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
