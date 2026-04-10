import { motion } from "framer-motion";

const stats = [
  { value: "5+", label: "Paketa" },
  { value: "6", label: "Meseci saradnje" },
  { value: "100%", label: "Podrška" },
  { value: "14", label: "Dana za isporuku" },
];

export function StatsSection() {
  return (
    <section className="border-y border-border bg-card/50 py-14">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <span className="text-4xl md:text-5xl font-extrabold text-primary">{s.value}</span>
            <p className="text-muted-foreground text-sm mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
