import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section id="kontakt" className="py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Daj nam <span className="text-primary">30 minuta.</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md">
            Analiziramo zašto sajt ne konvertuje, sadržaj ne donosi upite ili
            oglasi troše budžet — i dajemo ti jasnu procenu.
          </p>
          <ul className="space-y-3 mt-6 text-foreground text-sm">
            <li>• Analiza tvoje situacije</li>
            <li>• Identifikacija brzih pobeda</li>
            <li>• Konkretna strategija</li>
            <li>• 100% besplatno i neobavezujuće</li>
          </ul>
          <a
            href="mailto:info@radenon.com"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold mt-8 hover:opacity-90 transition-opacity"
          >
            Zakažite konsultaciju <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-xl p-8 space-y-6"
        >
          <h3 className="text-xl font-bold text-foreground">Kontakt informacije</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">E-Mail</p>
                <a href="mailto:info@radenon.com" className="text-foreground hover:text-primary transition-colors">
                  info@radenon.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Telefon</p>
                <a href="tel:+38163000000" className="text-foreground hover:text-primary transition-colors">
                  +381 63 000 000
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Web</p>
                <a href="https://radenon.com" className="text-foreground hover:text-primary transition-colors">
                  radenon.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
