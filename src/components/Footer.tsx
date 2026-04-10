import logo from "@/assets/radenon-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Radenon" className="h-8 w-auto" loading="lazy" />
          <span className="text-primary font-bold text-sm tracking-wide">DIGITAL</span>
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Kontaktirajte nas za individualne ponude i kombinovane pakete po posebnim cenama
        </p>
        <p className="text-muted-foreground text-xs">
          © 2025 Radenon Digital
        </p>
      </div>
    </footer>
  );
}
