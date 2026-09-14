import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/order")({
  component: OrderPage,
  head: () => ({
    meta: [
      { title: "Zakaži FTTH instalaciju | Radenon — Yettel partner" },
      {
        name: "description",
        content:
          "Zakaži termin FTTH instalacije sam, bez čekanja na poziv dispečera. Nalog ide direktno tehničaru na potvrdu.",
      },
      { property: "og:title", content: "Zakaži FTTH instalaciju | Radenon" },
      {
        property: "og:description",
        content:
          "Unesi adresu, izaberi tip instalacije i termin — tehničar potvrđuje za manje od 24h.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
});

type Tehnicar = { id: string; name: string };

type OrderRow = {
  id: string;
  address: string;
  obj_type: string;
  infra: string;
  date: string;
  name: string;
  phone: string;
  tehnicar_id: string | null;
  status: "pending" | "accepted" | "declined";
  created_at: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "Na čekanju",
  accepted: "Potvrđeno",
  declined: "Odbijeno",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "#B4EC1F",
  accepted: "#4ADE80",
  declined: "#F0654A",
};

function tomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("sr-Latn-RS", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function assignTehnicar(existing: OrderRow[], tehnicari: Tehnicar[]) {
  if (tehnicari.length === 0) return null;
  const counts = tehnicari.map(
    (t) => existing.filter((r) => r.tehnicar_id === t.id).length,
  );
  const min = Math.min(...counts);
  return tehnicari[counts.indexOf(min)]!.id;
}

function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="15" cy="20" r="11.5" stroke="#EDEDE8" strokeWidth="2" strokeDasharray="2.2 2.6" opacity="0.85" />
      <circle cx="26" cy="20" r="9.5" fill="#B4EC1F" />
    </svg>
  );
}

function OrderPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [tehnicari, setTehnicari] = useState<Tehnicar[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [techOpen, setTechOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const load = useCallback(async () => {
    const [{ data: tech }, { data: ord }] = await Promise.all([
      supabase.from("technicians").select("id, name").eq("active", true).order("name"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);
    setTehnicari((tech as Tehnicar[]) ?? []);
    setOrders((ord as OrderRow[]) ?? []);
    setLoaded(true);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const channel = supabase
      .channel("orders-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prev) => {
            if (payload.eventType === "INSERT") {
              const row = payload.new as OrderRow;
              if (prev.some((r) => r.id === row.id)) return prev;
              return [row, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              const row = payload.new as OrderRow;
              return prev.map((r) => (r.id === row.id ? row : r));
            }
            if (payload.eventType === "DELETE") {
              const row = payload.old as OrderRow;
              return prev.filter((r) => r.id !== row.id);
            }
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addOrder = async (req: {
    address: string;
    obj_type: string;
    infra: string;
    date: string;
    name: string;
    phone: string;
  }): Promise<OrderRow | null> => {
    const tehnicar_id = assignTehnicar(orders, tehnicari);
    const { data, error } = await supabase
      .from("orders")
      .insert({ ...req, tehnicar_id, status: "pending" })
      .select()
      .single();

    if (error || !data) {
      showToast("Slanje nije uspelo — proveri internet konekciju.");
      return null;
    }
    const row = data as OrderRow;
    setOrders((prev) => (prev.some((r) => r.id === row.id) ? prev : [row, ...prev]));
    return row;
  };

  const updateStatus = async (id: string, status: "accepted" | "declined") => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      showToast("Izmena nije uspela — pokušaj ponovo.");
      return;
    }
    setOrders((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    showToast(status === "accepted" ? "Termin potvrđen." : "Nalog odbijen.");
  };

  return (
    <div style={styles.page}>
      <style>{`
        .rdn-order * { box-sizing: border-box; }
        .rdn-order input, .rdn-order select, .rdn-order button { font-family: 'IBM Plex Sans', sans-serif; }
        .rdn-order ::placeholder { color: #6B7480; }
        .rdn-order input:focus, .rdn-order select:focus, .rdn-order button:focus-visible {
          outline: 3px solid #B4EC1F; outline-offset: 2px;
        }
        .rdn-order button { touch-action: manipulation; }
      `}</style>

      <div className="rdn-order">
        <div style={styles.hero}>
          <svg style={styles.wave} viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M0,30 C60,10 100,50 160,30 C220,10 260,50 320,25 C350,15 380,35 400,25"
              stroke="#B4EC1F"
              strokeOpacity="0.25"
              strokeWidth="1"
              fill="none"
            />
          </svg>
          <div style={styles.brandRow}>
            <LogoMark />
            <div style={styles.brand}>RADENON</div>
          </div>
          <div style={styles.eyebrow}>FTTH instalacije · ovlašćeni Yettel partner</div>
          <h1 style={styles.heroTitle}>
            Zakaži instalaciju sam,
            <br />
            bez čekanja na poziv dispečera.
          </h1>
          <p style={styles.heroSub}>
            Unesi adresu, izaberi tip instalacije i termin koji tehničaru odgovara — nalog ide direktno njemu na potvrdu.
          </p>
          <div style={styles.statRow}>
            <div>
              <div style={styles.statNum}>2€</div>
              <div style={styles.statLabel}>doplata za samostalno zakazivanje</div>
            </div>
            <div>
              <div style={styles.statNum}>&lt;24h</div>
              <div style={styles.statLabel}>potvrda termina od tehničara</div>
            </div>
          </div>
        </div>

        <main style={styles.main}>
          {!loaded ? (
            <div style={styles.muted}>Učitavanje …</div>
          ) : (
            <KupacView onSubmit={addOrder} tehnicari={tehnicari} />
          )}

          <ProcessExplainer />

          <div style={styles.footer}>Radenon d.o.o. · ovlašćeni instalacioni partner Yettel-a</div>
        </main>

        <button style={styles.techCorner} onClick={() => setTechOpen(true)}>
          Prijava za tehničare
        </button>

        {techOpen && (
          <div style={styles.modalBackdrop} onClick={() => setTechOpen(false)}>
            <div style={styles.modalPanel} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <span style={styles.modalTitle}>Prijava za tehničare</span>
                <button style={styles.modalClose} onClick={() => setTechOpen(false)} aria-label="Zatvori">
                  ✕
                </button>
              </div>
              <div style={styles.modalBody}>
                <TehnicarView orders={orders} tehnicari={tehnicari} onUpdate={updateStatus} />
              </div>
            </div>
          </div>
        )}

        {toast && <div style={styles.toast}>{toast}</div>}
      </div>
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return <div style={styles.stepBadge}>{n}</div>;
}

function KupacView({
  onSubmit,
  tehnicari,
}: {
  onSubmit: (req: {
    address: string;
    obj_type: string;
    infra: string;
    date: string;
    name: string;
    phone: string;
  }) => Promise<OrderRow | null>;
  tehnicari: Tehnicar[];
}) {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [objType, setObjType] = useState("Stan");
  const [infra, setInfra] = useState("Nova instalacija");
  const [date, setDate] = useState(tomorrowISO());
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<OrderRow | null>(null);

  const submit = async () => {
    if (!name.trim() || !phone.trim() || sending) return;
    setSending(true);
    const saved = await onSubmit({
      address: address.trim(),
      obj_type: objType,
      infra,
      date,
      name: name.trim(),
      phone: phone.trim(),
    });
    setSending(false);
    if (saved) setDone(saved);
  };

  const startOver = () => {
    setStep(1);
    setAddress("");
    setObjType("Stan");
    setInfra("Nova instalacija");
    setDate(tomorrowISO());
    setName("");
    setPhone("");
    setDone(null);
  };

  if (done) {
    const tehnicar = tehnicari.find((t) => t.id === done.tehnicar_id);
    return (
      <div style={styles.card}>
        <div style={styles.successIcon}>✓</div>
        <h2 style={styles.cardTitle}>Nalog poslat tehničaru.</h2>
        <p style={styles.bodyText}>
          {tehnicar ? tehnicar.name : "Tehničar"} vidi nalog u svom kalendaru i potvrđuje termin ili predlaže drugi, najkasnije za 24h.
        </p>
        <div style={styles.summaryBox}>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Adresa</span>
            <span>{done.address || "—"}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Tip objekta</span>
            <span>{done.obj_type}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Infrastruktura</span>
            <span>{done.infra}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Željeni termin</span>
            <span>{fmtDate(done.date)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Tehničar</span>
            <span>{tehnicar ? tehnicar.name : "—"}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Status</span>
            <span style={{ color: STATUS_COLOR[done.status], fontWeight: 700 }}>
              {STATUS_LABEL[done.status]}
            </span>
          </div>
          <div
            style={{
              ...styles.summaryRow,
              borderTop: "1px solid #232B3A",
              paddingTop: 10,
              marginTop: 4,
            }}
          >
            <span style={styles.summaryLabel}>Doplata za samostalno zakazivanje</span>
            <span style={{ color: "#B4EC1F", fontWeight: 700 }}>+2,00 €</span>
          </div>
        </div>
        <button onClick={startOver} style={styles.primaryBtn}>
          Novi nalog
        </button>
      </div>
    );
  }

  return (
    <div>
      {step === 1 && (
        <div style={styles.card}>
          <div style={styles.stepRow}>
            <StepBadge n={1} />
            <h2 style={styles.cardTitle}>Adresa i objekat</h2>
          </div>

          <label style={styles.bigLabel} htmlFor="address">
            Adresa instalacije
          </label>
          <input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={styles.bigInput}
            placeholder="Ulica i broj, mesto"
          />

          <label style={styles.bigLabel}>Tip objekta</label>
          <div style={styles.toggleRow}>
            {["Stan", "Kuća"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setObjType(v)}
                style={{ ...styles.toggleBtn, ...(objType === v ? styles.toggleBtnActive : {}) }}
              >
                {v}
              </button>
            ))}
          </div>

          <label style={styles.bigLabel}>Infrastruktura</label>
          <div style={styles.toggleRow}>
            {["Nova instalacija", "Već postoji"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setInfra(v)}
                style={{ ...styles.toggleBtn, ...(infra === v ? styles.toggleBtnActive : {}) }}
              >
                {v}
              </button>
            ))}
          </div>

          <div style={styles.navRow}>
            <button onClick={() => setStep(2)} style={styles.primaryBtn} disabled={!address.trim()}>
              Dalje
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={styles.card}>
          <div style={styles.stepRow}>
            <StepBadge n={2} />
            <h2 style={styles.cardTitle}>Željeni termin</h2>
          </div>
          <label style={styles.bigLabel} htmlFor="date">
            Kada ti odgovara?
          </label>
          <input
            id="date"
            type="date"
            min={tomorrowISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.bigInput}
          />
          <p style={{ ...styles.bodyText, marginTop: 12, marginBottom: 0 }}>
            Ovo je željeni datum — tehničar potvrđuje da li tačno taj termin odgovara ili predlaže drugi.
          </p>
          <div style={styles.navRow}>
            <button onClick={() => setStep(1)} style={styles.backBtn}>
              Nazad
            </button>
            <button onClick={() => setStep(3)} style={styles.primaryBtn}>
              Dalje
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={styles.card}>
          <div style={styles.stepRow}>
            <StepBadge n={3} />
            <h2 style={styles.cardTitle}>Kontakt podaci</h2>
          </div>

          <label style={styles.bigLabel} htmlFor="name">
            Ime i prezime
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.bigInput}
            placeholder="Ime i prezime"
          />

          <label style={styles.bigLabel} htmlFor="phone">
            Telefon
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.bigInput}
            placeholder="06x xxx xxxx"
          />

          <div style={styles.priceBox}>
            <span>Ukupna doplata za samostalno zakazivanje</span>
            <span style={styles.priceNum}>+2,00 €</span>
          </div>

          <div style={styles.navRow}>
            <button onClick={() => setStep(2)} style={styles.backBtn}>
              Nazad
            </button>
            <button
              onClick={submit}
              style={styles.primaryBtn}
              disabled={!name.trim() || !phone.trim() || sending}
            >
              {sending ? "Slanje …" : "Pošalji nalog tehničaru"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProcessExplainer() {
  const steps = [
    {
      n: 1,
      title: "Popuniš nalog",
      body: "Adresa, tip instalacije i termin koji tebi odgovara — traje manje od dva minuta.",
    },
    {
      n: 2,
      title: "Tehničar potvrđuje",
      body: "Nalog stiže direktno u njegov kalendar. Vidi da li je termin slobodan i potvrđuje ili predlaže drugi.",
    },
    {
      n: 3,
      title: "Dolaziš na termin",
      body: "Dobijaš potvrdu SMS-om. Bez čekanja na poziv dispečera.",
    },
  ];
  return (
    <div style={{ ...styles.card, marginTop: 16, padding: 0, overflow: "hidden" }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ padding: "20px 22px", borderTop: i === 0 ? "none" : "1px solid #232B3A" }}>
          <div style={styles.stepBadgeOutline}>{s.n}</div>
          <div style={styles.explainerTitle}>{s.title}</div>
          <div style={styles.explainerBody}>{s.body}</div>
        </div>
      ))}
    </div>
  );
}

function TehnicarView({
  orders,
  tehnicari,
  onUpdate,
}: {
  orders: OrderRow[];
  tehnicari: Tehnicar[];
  onUpdate: (id: string, status: "accepted" | "declined") => void;
}) {
  const [tehnicarId, setTehnicarId] = useState<string | null>(null);

  if (!tehnicarId) {
    return (
      <div style={styles.card}>
        <div style={styles.stepRow}>
          <StepBadge n={1} />
          <h2 style={styles.cardTitle}>Ko si ti?</h2>
        </div>
        <div style={styles.bigChoiceList}>
          {tehnicari.map((t) => (
            <button key={t.id} onClick={() => setTehnicarId(t.id)} style={styles.bigChoice}>
              <span style={styles.bigChoiceName}>{t.name}</span>
              <span style={styles.chevron}>›</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const tehnicar = tehnicari.find((t) => t.id === tehnicarId);
  const mine = orders.filter((r) => r.tehnicar_id === tehnicarId);
  const pending = mine.filter((r) => r.status === "pending");
  const decided = mine
    .filter((r) => r.status !== "pending")
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <button onClick={() => setTehnicarId(null)} style={styles.switchUserBtn}>
        Prijavljen kao {tehnicar?.name} — promeni
      </button>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Novi nalozi ({pending.length})</h2>
        {pending.length === 0 ? (
          <p style={styles.emptyState}>Trenutno nema novih naloga.</p>
        ) : (
          <div style={{ ...styles.ticketList, marginTop: 14 }}>
            {pending.map((r) => (
              <div key={r.id} style={{ ...styles.ticket, borderLeftColor: STATUS_COLOR["pending"] }}>
                <div style={styles.ticketDate}>{fmtDate(r.date)}</div>
                <div style={styles.ticketName}>{r.name}</div>
                <div style={styles.ticketMeta}>
                  {r.address || "Adresa nije uneta"} · {r.obj_type} · {r.infra}
                </div>
                <div style={styles.ticketMeta}>Tel: {r.phone}</div>
                <div style={styles.actionRow}>
                  <button onClick={() => onUpdate(r.id, "accepted")} style={styles.acceptBtn}>
                    Potvrdi termin
                  </button>
                  <button onClick={() => onUpdate(r.id, "declined")} style={styles.declineBtn}>
                    Odbij
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ ...styles.card, marginTop: 16 }}>
        <h2 style={styles.cardTitle}>Rešeno ({decided.length})</h2>
        {decided.length === 0 ? (
          <p style={styles.emptyState}>Još ništa rešeno.</p>
        ) : (
          <div style={{ ...styles.ticketList, marginTop: 14 }}>
            {decided.map((r) => (
              <div key={r.id} style={{ ...styles.ticket, borderLeftColor: STATUS_COLOR[r.status] }}>
                <div style={styles.ticketTop}>
                  <div style={styles.ticketDate}>{fmtDate(r.date)}</div>
                  <span
                    style={{
                      ...styles.statusChip,
                      color: STATUS_COLOR[r.status],
                      borderColor: STATUS_COLOR[r.status],
                    }}
                  >
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>
                <div style={styles.ticketName}>{r.name}</div>
                <div style={styles.ticketMeta}>{r.address || "Adresa nije uneta"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const BG = "#0A0E16";
const SURFACE = "#10151F";
const BORDER = "#232B3A";
const TEXT = "#EDEDE8";
const MUTED = "#8A93A0";
const LIME = "#B4EC1F";
const LIME_TEXT = "#0A0E16";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: BG,
    color: TEXT,
    fontFamily: "'IBM Plex Sans', sans-serif",
    paddingBottom: 60,
  },
  hero: { position: "relative", padding: "22px 20px 30px", overflow: "hidden" },
  wave: { position: "absolute", top: 0, left: 0, width: "100%", height: 60 },
  brandRow: { display: "flex", alignItems: "center", gap: 9, position: "relative", zIndex: 1, marginBottom: 18 },
  brand: { fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: "0.03em", color: TEXT },
  eyebrow: { fontSize: 13, color: LIME, marginBottom: 14, fontWeight: 600, letterSpacing: "0.02em" },
  heroTitle: {
    fontFamily: "'Archivo', sans-serif",
    fontWeight: 700,
    fontSize: 28,
    lineHeight: 1.28,
    margin: "0 0 16px",
    color: TEXT,
  },
  heroSub: { fontSize: 15.5, color: MUTED, lineHeight: 1.6, marginBottom: 26, maxWidth: 480 },
  statRow: { display: "flex", gap: 40 },
  statNum: { fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 26, color: LIME },
  statLabel: { fontSize: 13, color: MUTED, marginTop: 4, maxWidth: 140, lineHeight: 1.4 },
  main: { maxWidth: 560, margin: "0 auto", padding: "0 16px" },
  techCorner: {
    position: "fixed",
    left: 14,
    bottom: 14,
    background: "transparent",
    color: MUTED,
    border: "1px solid " + BORDER,
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: 12.5,
    fontWeight: 500,
    cursor: "pointer",
    zIndex: 20,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "flex-end",
    zIndex: 30,
  },
  modalPanel: {
    background: BG,
    width: "100%",
    maxHeight: "88vh",
    overflowY: "auto",
    borderRadius: "20px 20px 0 0",
    padding: "18px 16px 32px",
    borderTop: "1px solid " + BORDER,
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 560,
    margin: "0 auto 16px",
  },
  modalTitle: { fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 16, color: TEXT },
  modalClose: {
    background: "transparent",
    border: "1px solid " + BORDER,
    color: TEXT,
    borderRadius: "50%",
    width: 32,
    height: 32,
    fontSize: 14,
    cursor: "pointer",
  },
  modalBody: { maxWidth: 560, margin: "0 auto" },
  muted: { color: MUTED, textAlign: "center", padding: 40, fontSize: 16 },
  card: { background: SURFACE, color: TEXT, border: "1px solid " + BORDER, borderRadius: 18, padding: 22 },
  cardTitle: { fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 18, margin: 0, color: TEXT },
  stepRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18 },
  stepBadge: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "1.5px solid " + LIME,
    color: LIME,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  stepBadgeOutline: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    border: "1.5px solid " + LIME,
    color: LIME,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 12,
  },
  explainerTitle: { fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 6, color: TEXT },
  explainerBody: { fontSize: 14.5, color: MUTED, lineHeight: 1.55 },
  bodyText: { fontSize: 15, color: MUTED, lineHeight: 1.6 },
  bigLabel: { display: "block", fontSize: 14.5, color: MUTED, fontWeight: 600, marginBottom: 8, marginTop: 18 },
  bigInput: {
    width: "100%",
    background: BG,
    border: "1.5px solid " + BORDER,
    borderRadius: 10,
    padding: "14px 14px",
    color: TEXT,
    fontSize: 16,
  },
  toggleRow: { display: "flex", gap: 10 },
  toggleBtn: {
    flex: 1,
    background: BG,
    color: TEXT,
    border: "1.5px solid " + BORDER,
    borderRadius: 10,
    padding: "13px 10px",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  toggleBtnActive: { background: LIME, color: LIME_TEXT, borderColor: LIME },
  navRow: { display: "flex", gap: 10, marginTop: 24 },
  primaryBtn: {
    flex: 1,
    background: LIME,
    color: LIME_TEXT,
    border: "none",
    borderRadius: 10,
    padding: "16px 18px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
  backBtn: {
    background: "transparent",
    color: TEXT,
    border: "1.5px solid " + BORDER,
    borderRadius: 10,
    padding: "16px 20px",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
  priceBox: {
    marginTop: 20,
    background: BG,
    border: "1px solid " + BORDER,
    color: TEXT,
    borderRadius: 12,
    padding: "16px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 14.5,
    gap: 12,
  },
  priceNum: { color: LIME, fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: 19 },
  bigChoiceList: { display: "flex", flexDirection: "column", gap: 10 },
  bigChoice: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: BG,
    border: "1.5px solid " + BORDER,
    borderRadius: 10,
    padding: "16px 16px",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  },
  bigChoiceName: { fontSize: 16, fontWeight: 700, color: TEXT },
  chevron: { fontSize: 22, color: MUTED },
  switchUserBtn: {
    display: "block",
    width: "100%",
    background: "transparent",
    border: "1px solid " + BORDER,
    borderRadius: 10,
    padding: "12px 16px",
    color: MUTED,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 16,
    textAlign: "left",
  },
  successIcon: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: LIME,
    color: LIME_TEXT,
    fontSize: 24,
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  summaryBox: {
    background: BG,
    border: "1px solid " + BORDER,
    borderRadius: 12,
    padding: "14px 16px",
    marginTop: 16,
    marginBottom: 22,
    display: "flex",
    flexDirection: "column",
    gap: 9,
  },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 14.5, gap: 12 },
  summaryLabel: { color: MUTED },
  emptyState: { color: MUTED, fontSize: 15, lineHeight: 1.6, marginTop: 12 },
  ticketList: { display: "flex", flexDirection: "column", gap: 12 },
  ticket: {
    background: BG,
    border: "1px solid " + BORDER,
    borderLeft: "4px solid",
    borderRadius: 12,
    padding: "15px 16px",
  },
  ticketTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  ticketDate: { fontSize: 14.5, fontWeight: 700, color: TEXT, textTransform: "capitalize" },
  statusChip: { fontSize: 12, fontWeight: 700, border: "1.5px solid", borderRadius: 20, padding: "3px 10px" },
  ticketName: { fontSize: 15.5, fontWeight: 700, marginTop: 7, color: TEXT },
  ticketMeta: { fontSize: 13.5, color: MUTED, marginTop: 3 },
  actionRow: { display: "flex", flexDirection: "column", gap: 9, marginTop: 14 },
  acceptBtn: {
    background: LIME,
    color: LIME_TEXT,
    border: "none",
    borderRadius: 10,
    padding: "13px 0",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  declineBtn: {
    background: "transparent",
    color: MUTED,
    border: "1.5px solid " + BORDER,
    borderRadius: 10,
    padding: "11px 0",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  footer: { textAlign: "center", fontSize: 12.5, color: MUTED, marginTop: 26 },
  toast: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: SURFACE,
    border: "1px solid " + BORDER,
    color: TEXT,
    borderRadius: 999,
    padding: "12px 20px",
    fontSize: 14,
    maxWidth: "90%",
    textAlign: "center",
  },
};
