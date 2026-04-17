import { Zap, Wallet, Smartphone, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "Brza isporuka",
    description: "Kompletan sajt spreman za 14 radnih dana — bez beskonačnog čekanja.",
  },
  {
    icon: Wallet,
    title: "Bez skrivenih troškova",
    description: "Cena koju vidiš je cena koju plaćaš. Sve uključeno, bez iznenađenja.",
  },
  {
    icon: Smartphone,
    title: "Mobilna optimizacija",
    description: "Svaki sajt savršeno radi na telefonu, tabletu i desktopu — od starta.",
  },
  {
    icon: Wrench,
    title: "Tehnička podrška",
    description: "Direktna komunikacija sa nama preko WhatsApp-a, brzi odgovori.",
  },
];

export function WhyUsSection() {
  return (
    <section id="pristup" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-primary text-sm font-semibold uppercase tracking-widest">
            Zašto mi
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3">
            Naš pristup je drugačiji.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
