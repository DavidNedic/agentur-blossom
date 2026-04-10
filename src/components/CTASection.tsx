import { ArrowRight, Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setSending(true);

    const text = `*Neue Anfrage von der Website*%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*E-Mail:* ${encodeURIComponent(formData.email)}%0A*Nachricht:* ${encodeURIComponent(formData.message)}`;
    window.open(`https://wa.me/381621015707?text=${text}`, "_blank");

    setSending(false);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="kontakt" className="py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-start">
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

          <div className="bg-card border border-border rounded-xl p-6 mt-8 space-y-4">
            <h3 className="text-lg font-bold text-foreground">Kontakt informacije</h3>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">E-Mail</p>
                <a href="mailto:davidnedic@web.de" className="text-foreground hover:text-primary transition-colors text-sm">
                  davidnedic@web.de
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Telefon / WhatsApp</p>
                <a href="tel:+381621015707" className="text-foreground hover:text-primary transition-colors text-sm">
                  +381 62 101 5707
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Web</p>
                <a href="https://radenon.com" className="text-foreground hover:text-primary transition-colors text-sm">
                  radenon.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-xl p-8"
        >
          <h3 className="text-xl font-bold text-foreground mb-6">Pošaljite nam poruku</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm text-muted-foreground mb-1 block">Ime i prezime *</label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Vaše ime"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm text-muted-foreground mb-1 block">E-Mail</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="vas@email.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm text-muted-foreground mb-1 block">Poruka *</label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Opišite šta vam treba..."
                rows={5}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={sending}>
              <Send className="w-4 h-4 mr-2" />
              Pošaljite preko WhatsApp
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Klikom na dugme otvara se WhatsApp sa vašom porukom
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
