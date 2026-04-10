import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const rows = [
  {
    criteria: "Kvalitet sadržaja",
    standard: "Stock fotografije i generički dizajn",
    ours: "Individualni dizajn prilagođen vašem brendu",
  },
  {
    criteria: "Strategija web stranice",
    standard: "Dizajn bez fokusa na konverziju",
    ours: "Zakazivanje termina i generisanje kontakata od početka",
  },
  {
    criteria: "Sve iz jednog mesta",
    standard: "3+ različite agencije za koordinaciju",
    ours: "Sajt + SEO + Social + Oglasi = jedna agencija",
  },
  {
    criteria: "Podrška",
    standard: "E-mail sa odgovorom za 48h",
    ours: "100% podrška sa mesečnim izveštajima",
  },
];

export function ComparisonSection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
          Zašto izabrati nas.
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-muted-foreground font-medium">Kriterijum</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-medium">Tržišni standard</th>
                <th className="text-left py-4 px-4 text-primary font-bold">Radenon Digital</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.criteria} className="border-b border-border/50">
                  <td className="py-4 px-4 font-medium text-foreground">{r.criteria}</td>
                  <td className="py-4 px-4 text-muted-foreground">
                    <span className="flex items-start gap-2">
                      <X className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                      {r.standard}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-foreground">
                    <span className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {r.ours}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
