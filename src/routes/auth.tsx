import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Prijava | Promet Digital" },
      { name: "description", content: "Prijava za administraciju termina Promet Digital." },
      { property: "og:title", content: "Prijava | Promet Digital" },
      { property: "og:description", content: "Prijava za administraciju termina Promet Digital." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message); else nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth` } });
      setMsg(error ? error.message : "Proveri e-mail i potvrdi nalog, pa se prijavi.");
    }
    setBusy(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm border border-border bg-card p-8 flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold">{mode === "in" ? "Prijava" : "Napravi nalog"}</h1>
        <label className="flex flex-col gap-1 font-mono text-xs text-muted-foreground">E-mail
          <input className="bg-background border border-border px-3 py-2 text-base text-foreground font-sans" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label className="flex flex-col gap-1 font-mono text-xs text-muted-foreground">Lozinka
          <input className="bg-background border border-border px-3 py-2 text-base text-foreground font-sans" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "in" ? "current-password" : "new-password"} />
        </label>
        {msg && <p className="text-sm text-muted-foreground" role="status">{msg}</p>}
        <button disabled={busy} className="bg-primary text-primary-foreground font-bold py-3 hover:bg-foreground hover:text-background disabled:opacity-50">{mode === "in" ? "Prijavi se" : "Registruj se"}</button>
        <button type="button" className="font-mono text-xs text-muted-foreground underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "Nemaš nalog? Registruj se" : "Imaš nalog? Prijavi se"}
        </button>
      </form>
    </main>
  );
}
