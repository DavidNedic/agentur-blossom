import logo from "@/assets/radenon-digital-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={logo} alt="Radenon Digital" className="h-8" loading="lazy" />
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
