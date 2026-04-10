import { PricingCard } from "./PricingCard";
import { motion } from "framer-motion";

const packages = [
  {
    number: "01",
    title: "Izrada Sajta",
    subtitle: "Profesionalan veb sajt za Vaš biznis",
    price: "200 EUR",
    priceNote: "jednokratno plaćanje",
    features: [
      "Dizajn i razvoj sajta",
      "Prilagođen mobilnim uređajima",
      "Osnovna SEO podešavanja",
      "Predaja za 14 dana",
      "SSL sertifikat uključen",
    ],
  },
  {
    number: "02",
    title: "Izrada + Održavanje",
    subtitle: "Sajt koji uvek radi savršeno",
    price: "200 EUR",
    priceNote: "+ 50 EUR / mesečno",
    features: [
      "Sve iz paketa 01",
      "Mesečno održavanje",
      "Ažuriranje sadržaja",
      "Tehnička podrška",
      "Backup i bezbednost",
    ],
  },
  {
    number: "03",
    title: "Izrada + SEO",
    subtitle: "Budite prvi na Google pretrazi",
    price: "350 EUR",
    priceNote: "+ 50 EUR / mesečno",
    popular: true,
    features: [
      "Sve iz paketa 02",
      "On-page SEO optimizacija",
      "Istraživanje ključnih reči",
      "Mesečni SEO izveštaji",
      "Poboljšanje brzine sajta",
    ],
  },
  {
    number: "04",
    title: "SEO + Social Media",
    subtitle: "Kompletno digitalno prisustvo",
    price: "500 EUR",
    priceNote: "+ 150 EUR / mesečno",
    features: [
      "Sve iz paketa 03",
      "Kreiranje sadržaja za SM",
      "Instagram / Facebook objave",
      "12 objava mesečno",
      "Analitika i izveštavanja",
    ],
  },
  {
    number: "05",
    title: "Kompletni Digitalni Paket",
    subtitle: "Maksimalan rast — SEO, Social & Ads",
    price: "500 EUR",
    priceNote: "+ 300 EUR / mesečno",
    features: [
      "Sve iz paketa 04",
      "Meta Ads kampanje",
      "Google SEA oglašavanje",
      "Upravljanje budžetom oglasa",
      "Nedeljni izveštaji i analiza",
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
          {packages.slice(0, 3).map((pkg, i) => (
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
        <div className="grid sm:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
          {packages.slice(3).map((pkg, i) => (
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
