export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xl font-extrabold">
          <span className="text-foreground">WEB</span>{" "}
          <span className="text-primary">STUDIO</span>
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Kontaktirajte nas za individualne ponude i kombinovane pakete po posebnim cenama
        </p>
        <p className="text-muted-foreground text-xs">
          © 2025 Web Studio
        </p>
      </div>
    </footer>
  );
}
