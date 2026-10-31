import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminCancelBooking } from "@/lib/booking.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Termini | Promet Digital admin" },
      { name: "description", content: "Upravljanje dostupnošću i zakazanim sastancima." },
      { property: "og:title", content: "Termini | Promet Digital admin" },
      { property: "og:description", content: "Upravljanje dostupnošću i zakazanim sastancima." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const DAYS = ["Nedelja", "Ponedeljak", "Utorak", "Sreda", "Četvrtak", "Petak", "Subota"];
const ORDER = [1, 2, 3, 4, 5, 6, 0];
type Rule = { id: string; weekday: number; start_time: string; end_time: string };
type Blocked = { id: string; date: string; reason: string | null };
type Booking = { id: string; starts_at: string; name: string; company: string; email: string; phone: string | null; message: string; status: string; zoom_join_url: string | null };

const input = "bg-background border border-border px-2 py-1.5 text-sm text-foreground";
const fmt = (s: string) => new Intl.DateTimeFormat("sr-Latn-RS", { timeZone: "Europe/Belgrade", weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(s));

function AdminPage() {
  const nav = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [blocked, setBlocked] = useState<Blocked[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [newBlock, setNewBlock] = useState({ date: "", reason: "" });
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [r, b, k] = await Promise.all([
      supabase.from("availability_rules").select("*").order("start_time"),
      supabase.from("blocked_dates").select("*").order("date"),
      supabase.from("bookings").select("id,starts_at,name,company,email,phone,message,status,zoom_join_url").order("starts_at", { ascending: false }).limit(300),
    ]);
    setRules(r.data ?? []); setBlocked(b.data ?? []); setBookings(k.data ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      setIsAdmin(!!data);
      if (data) load();
    })();
  }, [load]);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 2500); };
  const addRule = async (weekday: number) => {
    const { error } = await supabase.from("availability_rules").insert({ weekday, start_time: "10:00", end_time: "17:00" });
    if (error) flash(error.message); else load();
  };
  const saveRule = async (r: Rule) => {
    if (r.end_time <= r.start_time) return flash("Kraj mora biti posle početka.");
    const { error } = await supabase.from("availability_rules").update({ start_time: r.start_time, end_time: r.end_time }).eq("id", r.id);
    flash(error ? error.message : "Sačuvano."); load();
  };
  const delRule = async (id: string) => { await supabase.from("availability_rules").delete().eq("id", id); load(); };
  const addBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("blocked_dates").insert({ date: newBlock.date, reason: newBlock.reason || null });
    if (error) flash(error.message); else { setNewBlock({ date: "", reason: "" }); load(); }
  };
  const delBlock = async (id: string) => { await supabase.from("blocked_dates").delete().eq("id", id); load(); };
  const cancel = async (b: Booking) => {
    if (!confirm(`Otkazati sastanak sa ${b.name}? Kupac dobija e-mail, Zoom se briše.`)) return;
    try { await adminCancelBooking({ data: { id: b.id } }); flash("Otkazano."); } catch { flash("Otkazivanje nije uspelo."); }
    load();
  };
  const signOut = async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); };

  if (isAdmin === null) return <main className="min-h-screen bg-background text-muted-foreground p-8 font-mono text-sm">Učitavam...</main>;
  if (!isAdmin) return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-extrabold">Nemaš pristup.</h1>
      <button className="mt-4 underline font-mono text-sm" onClick={signOut}>Odjavi se</button>
    </main>
  );

  const now = Date.now();
  const upcoming = bookings.filter((b) => Date.parse(b.starts_at) >= now).reverse();
  const past = bookings.filter((b) => Date.parse(b.starts_at) < now);

  const List = ({ items, canCancel }: { items: Booking[]; canCancel: boolean }) => (
    <div className="flex flex-col divide-y divide-border border border-border">
      {items.length === 0 && <p className="p-4 text-sm text-muted-foreground">Nema sastanaka.</p>}
      {items.map((b) => (
        <div key={b.id} className={`p-4 grid gap-1 md:grid-cols-[220px_1fr_auto] md:gap-6 ${b.status === "cancelled" ? "opacity-50" : ""}`}>
          <div className="font-mono text-sm">{fmt(b.starts_at)}{b.status === "cancelled" && <span className="block text-xs">otkazan</span>}{b.status === "hold" && <span className="block text-xs">blokirano</span>}</div>
          <div className="text-sm">
            <b>{b.name}</b>, {b.company} <span className="text-muted-foreground">· {b.email}{b.phone ? ` · ${b.phone}` : ""}</span>
            <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{b.message}</p>
            {b.zoom_join_url && b.status === "confirmed" && <a className="font-mono text-xs text-primary underline" href={b.zoom_join_url} target="_blank" rel="noopener noreferrer">Zoom</a>}
          </div>
          {canCancel && b.status === "confirmed" && <button className="self-start border border-foreground px-3 py-1.5 text-sm hover:bg-foreground hover:text-background" onClick={() => cancel(b)}>Otkaži</button>}
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-10 md:px-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        <header className="flex justify-between items-baseline">
          <h1 className="text-4xl font-extrabold">Termini</h1>
          <button className="font-mono text-sm underline" onClick={signOut}>Odjavi se</button>
        </header>
        {msg && <p className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 font-mono text-sm" role="status">{msg}</p>}

        <section>
          <h2 className="text-2xl font-extrabold mb-2">Nedeljna dostupnost</h2>
          <p className="text-sm text-muted-foreground mb-4">Vreme u Beogradu. Sastanak 30 min, 15 min pauze, najmanje 12 h unapred, najviše 4 dnevno.</p>
          <div className="flex flex-col divide-y divide-border border border-border">
            {ORDER.map((wd) => (
              <div key={wd} className="p-3 flex flex-wrap items-center gap-3">
                <span className="w-28 font-mono text-sm">{DAYS[wd]}</span>
                {rules.filter((r) => r.weekday === wd).map((r) => (
                  <RuleRow key={r.id} rule={r} onSave={saveRule} onDelete={delRule} />
                ))}
                {!rules.some((r) => r.weekday === wd) && <span className="text-sm text-muted-foreground">zatvoreno</span>}
                <button className="ml-auto font-mono text-xs underline" onClick={() => addRule(wd)}>+ dodaj vreme</button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold mb-4">Blokirani dani</h2>
          <form onSubmit={addBlock} className="flex flex-wrap gap-2 mb-4">
            <input className={input} type="date" required value={newBlock.date} onChange={(e) => setNewBlock({ ...newBlock, date: e.target.value })} />
            <input className={input} placeholder="razlog (nije obavezno)" value={newBlock.reason} onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })} />
            <button className="bg-primary text-primary-foreground px-4 font-bold hover:bg-foreground hover:text-background">Blokiraj</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {blocked.length === 0 && <p className="text-sm text-muted-foreground">Nema blokiranih dana.</p>}
            {blocked.map((b) => (
              <span key={b.id} className="border border-border px-3 py-1.5 font-mono text-sm flex gap-3">
                {b.date}{b.reason ? ` · ${b.reason}` : ""}
                <button aria-label={`Ukloni ${b.date}`} className="underline" onClick={() => delBlock(b.id)}>ukloni</button>
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold mb-4">Predstojeći sastanci</h2>
          <List items={upcoming} canCancel />
        </section>
        <section>
          <h2 className="text-2xl font-extrabold mb-4">Prošli sastanci</h2>
          <List items={past} canCancel={false} />
        </section>
      </div>
    </main>
  );
}

function RuleRow({ rule, onSave, onDelete }: { rule: Rule; onSave: (r: Rule) => void; onDelete: (id: string) => void }) {
  const [r, setR] = useState({ ...rule, start_time: rule.start_time.slice(0, 5), end_time: rule.end_time.slice(0, 5) });
  return (
    <span className="flex items-center gap-2">
      <input aria-label="Od" className={input} type="time" step={1800} value={r.start_time} onChange={(e) => setR({ ...r, start_time: e.target.value })} />
      <span>do</span>
      <input aria-label="Do" className={input} type="time" step={1800} value={r.end_time} onChange={(e) => setR({ ...r, end_time: e.target.value })} />
      <button className="font-mono text-xs underline" onClick={() => onSave(r)}>sačuvaj</button>
      <button className="font-mono text-xs underline text-muted-foreground" onClick={() => onDelete(r.id)}>obriši</button>
    </span>
  );
}
