import { Package, Clock, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Vaš Pouzdan<br />
            <span className="text-primary underline decoration-primary/40 underline-offset-8">Digitalni Partner</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-lg text-lg">
            Sve cene važe za period od 6 meseci • Bez skrivenih troškova • Individualni paketi dostupni
          </p>
        </div>
        <div className="flex gap-10 md:gap-14">
          <div className="text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-secondary mb-2 mx-auto">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-extrabold text-foreground">5+</span>
            <p className="text-sm text-muted-foreground">Paketa</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-secondary mb-2 mx-auto">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-extrabold text-foreground">6</span>
            <p className="text-sm text-muted-foreground">Meseci</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-secondary mb-2 mx-auto">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-extrabold text-foreground">100%</span>
            <p className="text-sm text-muted-foreground">Podrška</p>
          </div>
        </div>
      </div>
    </section>
  );
}
