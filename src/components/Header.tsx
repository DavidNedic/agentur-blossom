import { Mail, Phone, Globe } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-extrabold tracking-tight">
          <span className="text-foreground">WEB</span>{" "}
          <span className="text-primary">STUDIO</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="https://webstudio.rs" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Globe className="w-4 h-4" /> webstudio.rs
          </a>
          <a href="mailto:info@webstudio.rs" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Mail className="w-4 h-4" /> info@webstudio.rs
          </a>
          <a href="tel:+38163000000" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Phone className="w-4 h-4" /> +381 63 000 000
          </a>
        </div>
      </div>
    </header>
  );
}
