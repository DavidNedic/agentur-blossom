import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { cancelByToken } from "@/lib/booking.functions";

export const Route = createFileRoute("/otkazi")({
  validateSearch: z.object({ token: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Otkaži sastanak | Promet Digital" },
      { name: "description", content: "Otkazivanje zakazanog besplatnog sastanka sa Promet Digital." },
      { property: "og:title", content: "Otkaži sastanak | Promet Digital" },
      { property: "og:description", content: "Otkazivanje zakazanog besplatnog sastanka sa Promet Digital." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CancelPage,
});

function CancelPage() {
  const { token } = Route.useSearch();
  const [state, setState] = useState<"idle" | "busy" | "done" | "gone">("idle");
  const go = async () => {
    if (!token) return;
    setState("busy");
    try { const r = await cancelByToken({ data: { token } }); setState(r.ok ? "done" : "gone"); } catch { setState("gone"); }
  };
  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-md">
        {state === "done" ? (
          <><h1 className="text-4xl font-extrabold">Sastanak je otkazan.</h1><p className="mt-3 text-muted-foreground">Termin je oslobođen. Termin abgesagt.</p></>
        ) : state === "gone" || !token ? (
          <><h1 className="text-4xl font-extrabold">Link ne važi.</h1><p className="mt-3 text-muted-foreground">Sastanak je već otkazan ili link nije ispravan.</p></>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold">Otkaži sastanak?</h1>
            <p className="mt-3 text-muted-foreground">Termin absagen? Zoom sastanak se briše i dobijaš potvrdu na e-mail.</p>
            <button disabled={state === "busy"} onClick={go} className="mt-6 bg-primary text-primary-foreground font-bold px-6 py-3 hover:bg-foreground hover:text-background disabled:opacity-50">
              {state === "busy" ? "Otkazujem..." : "Da, otkaži / Ja, absagen"}
            </button>
          </>
        )}
        <Link to="/" className="block mt-8 font-mono text-sm underline">Nazad na sto</Link>
      </div>
    </main>
  );
}
