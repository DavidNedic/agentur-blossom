import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PricingCard } from "@/components/PricingCard";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Web Studio – Vaš Pouzdan Digitalni Partner" },
      { name: "description", content: "Profesionalna izrada sajtova, SEO optimizacija i digitalni marketing. 5+ paketa, 100% podrška." },
    ],
  }),
});

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

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.slice(0, 4).map((pkg) => (
            <PricingCard key={pkg.number} {...pkg} />
          ))}
        </div>
        {/* Package 05 centered below */}
        <div className="mt-6 max-w-md mx-auto">
          <PricingCard {...packages[4]} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
