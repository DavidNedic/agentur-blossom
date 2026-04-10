import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    title: "Sajt bez konverzija",
    description: "Web stranica postoji, ali posetioci ne zakazuju termine niti šalju upite.",
  },
  {
    title: "Sadržaj bez efekta",
    description: "Proizvodite sadržaj, ali on ne donosi ni doseg ni nove klijente.",
  },
  {
    title: "Oglasi bez strategije",
    description: "Budžet se troši, ali bez sistema i merenja svaki euro nestaje.",
  },
];

export function ProblemsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Da li vam je ovo poznato?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <AlertTriangle className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">{p.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="#paketi"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            Vreme je za promenu →
          </a>
        </div>
      </div>
    </section>
  );
}
