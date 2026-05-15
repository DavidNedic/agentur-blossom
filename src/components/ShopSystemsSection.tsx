import { motion } from "framer-motion";
import { CreditCard, ShoppingCart, Truck, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Plaćanje",
    description: "Stripe, PayPal, kartično plaćanje, pouzeće i gotovina — sve metode koje tvoji kupci očekuju.",
  },
  {
    icon: ShoppingCart,
    title: "Pametna korpa",
    description: "Napredna korpa sa oporavom napuštenih porudžbina, popustima i up-sell logikom.",
  },
  {
    icon: Truck,
    title: "Dostava",
    description: "Integracija sa kurirskim službama, automatsko praćenje pošiljki i upravljanje zalihama.",
  },
  {
    icon: BarChart3,
    title: "Oglasi i praćenje",
    description: "Meta Pixel, Google Ads konverzije i analitika — da znaš šta prodaje i gde da ulažeš.",
  },
];

const steps = [
  {
    num: "01",
    title: "Konsultacija",
    desc: "Razgovaramo o tvojim proizvodima, ciljnoj grupi i budžetu.",
  },
  {
    num: "02",
    title: "Dizajn i izrada",
    desc: "Prilagođeni dizajn shopa sa fokusom na konverziju i mobilni prikaz.",
  },
  {
    num: "03",
    title: "Integracija",
    desc: "Povezujemo plaćanje, dostavu, porez i zalihe u jedan sistem.",
  },
  {
    num: "04",
    title: "Testiranje",
    desc: "Provera porudžbina, plaćanja i obaveštenja pre nego što shop krene.",
  },
  {
    num: "05",
    title: "Lansiranje i marketing",
    desc: "Shop je live — pokrećemo oglase i pratimo rezultate.",
  },
];

export function ShopSystemsSection() {
  return (
    <section id="shop-sistemi" className="py-24 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary text-sm font-semibold uppercase tracking-widest"
          >
            E-Commerce rešenja
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold mt-3"
          >
            Kompletan shop. Od nule do prodaje.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg"
          >
            Gradimo online prodavnice koje ne samo da izgledaju dobro — one prodaju. 
            Sa svim alatima koje moderni e-commerce zahteva.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/40 transition-colors group"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/40 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-10"
        >
          <h3 className="text-xl md:text-2xl font-extrabold text-center mb-10">
            Kako izgleda proces?
          </h3>

          <div className="grid md:grid-cols-5 gap-6 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 z-10 relative">
                  <span className="text-primary font-extrabold text-lg">{step.num}</span>
                </div>
                <h4 className="text-base font-bold text-foreground mb-2">{step.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[220px]">{step.desc}</p>

                {/* Arrow between steps (mobile) */}
                {i < steps.length - 1 && (
                  <div className="md:hidden my-3">
                    <ArrowRight className="w-4 h-4 text-primary/40 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              <CheckCircle2 className="w-4 h-4" />
              Zakaži konsultaciju za shop
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
