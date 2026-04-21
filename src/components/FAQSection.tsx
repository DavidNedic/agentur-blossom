import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Koliko traje izrada web sajta?",
    a: "Standardna izrada sajta traje samo 48h. Za kompleksnije projekte sa više stranica i funkcionalnosti, potrebno je 1-3 nedelje.",
  },
  {
    q: "Šta je uključeno u mesečno održavanje?",
    a: "Mesečno održavanje uključuje ažuriranje sadržaja, tehničku podršku, redovne backup-ove, bezbednosne zakrpe i monitoring performansi sajta.",
  },
  {
    q: "Da li mogu da promenim paket?",
    a: "Da, u svakom momentu možete nadograditi svoj paket. Kontaktirajte nas za individualne ponude i kombinovane pakete po posebnim cenama.",
  },
  {
    q: "Kako funkcioniše SEO optimizacija?",
    a: "Naša SEO optimizacija uključuje istraživanje ključnih reči, on-page optimizaciju, tehničku SEO analizu, poboljšanje brzine sajta i mesečne izveštaje o napretku.",
  },
  {
    q: "Da li su cene konačne?",
    a: "Da, sve navedene cene su konačne. Nema skrivenih troškova. Cene važe za period od 6 meseci saradnje.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Često postavljena pitanja
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border border-border rounded-xl px-5 bg-card"
            >
              <AccordionTrigger className="text-foreground font-semibold text-left hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
