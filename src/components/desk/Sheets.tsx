import { useEffect, useRef, useState } from "react";
import { CONTACT } from "@/lib/i18n";
import adriaticumImg from "@/assets/portfolio-adriaticum.webp";
import unearthedImg from "@/assets/portfolio-unearthed.webp";
import biteImg from "@/assets/portfolio-bite.png";

export const SHOTS = {
  sala: { src: adriaticumImg, name: "Adriaticum", url: "https://adriaticum.rentals" },
  bite: { src: biteImg, name: "Bite Catering", url: "" },
  unearthed: { src: unearthedImg, name: "Unearthed Samples", url: "https://unearthed-samples.com" },
} as const;

type Go = (name: string) => void;

function Shot({ k }: { k: keyof typeof SHOTS }) {
  const s = SHOTS[k];
  return (
    <figure className="shot">
      <div className="frame">
        <div className="bar"><i /><i /><i /><span>{s.name}</span></div>
        <img src={s.src} alt={`Sajt ${s.name}`} loading="lazy" />
      </div>
      <figcaption>Pravi sajt, koji smo uradili.</figcaption>
      {s.url && (
        <a className="live" href={s.url} target="_blank" rel="noopener noreferrer">Pogledaj sajt ↗</a>
      )}
    </figure>
  );
}

function GoBtn({ go, to = "kontakt" }: { go: Go; to?: string }) {
  return (
    <a className="btn" href="#" onClick={(e) => { e.preventDefault(); go(to); }}>Zakaži sastanak</a>
  );
}

function Intro({ go }: { go: Go }) {
  return (
    <div className="sh paper">
      <h2 id="sheetTitle">Sajtovi sa potpisom.</h2>
      <p className="lead">Mi smo Promet Digital, agencija za sajtove i online prodavnice iz Zrenjanina. Ne radimo po šablonu. Svaki projekat počinje kratkim sastankom, na kom tražimo jednu stvar koju ima samo tvoja branša. Od nje pravimo sajt koji kupci pamte.</p>
      <p className="lead">Na ovom stolu je sve što radimo. Pomeraj stvari, otvaraj ih.</p>
      <GoBtn go={go} />
    </div>
  );
}

function Proces() {
  return (
    <div className="sh paper" style={{ backgroundImage: "linear-gradient(transparent 39px,#DCE3EC 40px)", backgroundSize: "100% 40px" }}>
      <h2 id="sheetTitle">Kako radimo.</h2>
      <div className="steps">
        <div><b>1.</b><div><h3>Kratak sastanak</h3><p>Pola sata, uživo ili online. Pričamo o tvojim kupcima i o tome kako zaista radiš.</p></div></div>
        <div><b>2.</b><div><h3>Nađemo potpis</h3><p>Jedan predmet ili trenutak koji ima samo tvoja branša. Raspored sale kod iznajmljivanja, zvuk kod prodavnice semplova.</p></div></div>
        <div><b>3.</b><div><h3>Demo, besplatno</h3><p>Pravimo demo pre nego što išta platiš. Ako ti se ne svidi, ne duguješ ništa.</p></div></div>
        <div><b>4.</b><div><h3>Protokol, pa online</h3><p>Svaki sajt prolazi naš protokol provere. Ako nešto ne prođe, ne puštamo ga.</p></div></div>
      </div>
    </div>
  );
}

const PAD_NAMES = ["kick", "snare", "hat", "clap", "bas C", "bas E♭", "akord", "zvono"];

function Unearthed() {
  const padsRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const playRef = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const cv = cvRef.current!, g = cv.getContext("2d")!, pads = padsRef.current!;
    let ac: AudioContext | null = null, an: AnalyserNode | null = null, raf = 0, dead = false, cp: ReturnType<typeof setTimeout> | undefined;
    const ctx = () => {
      if (!ac) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ac = new AC(); an = ac.createAnalyser(); an.fftSize = 1024; an.connect(ac.destination); draw();
      }
      return ac;
    };
    function noise(dur: number) {
      const a = ac!; const b = a.createBuffer(1, a.sampleRate * dur, a.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const n = a.createBufferSource(); n.buffer = b; return n;
    }
    function env(node: AudioNode, t: number, at: number, peak: number, dec: number) {
      const gn = ac!.createGain(); gn.gain.setValueAtTime(0.0001, t);
      gn.gain.exponentialRampToValueAtTime(peak, t + at); gn.gain.exponentialRampToValueAtTime(0.0001, t + dec);
      node.connect(gn); gn.connect(an!); return gn;
    }
    function tone(f: number, type: OscillatorType, t: number, dec: number, peak: number) {
      const o = ac!.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
      env(o, t, 0.005, peak, dec); o.start(t); o.stop(t + dec + 0.05); return o;
    }
    function play(i: number) {
      const a = ctx(), t = a.currentTime;
      if (i === 0) { const o = tone(150, "sine", t, 0.45, 1); o.frequency.exponentialRampToValueAtTime(42, t + 0.35); }
      if (i === 1) { const n = noise(0.25); const f = a.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 1200; n.connect(f); env(f, t, 0.002, 0.6, 0.2); n.start(t); tone(190, "triangle", t, 0.12, 0.4); }
      if (i === 2) { const n = noise(0.08); const f = a.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 7000; n.connect(f); env(f, t, 0.001, 0.4, 0.06); n.start(t); }
      if (i === 3) { [0, 0.012, 0.024].forEach((d) => { const n = noise(0.2); const f = a.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1500; n.connect(f); env(f, t + d, 0.001, 0.5, d + 0.15); n.start(t + d); }); }
      if (i === 4 || i === 5) { const fr = i === 4 ? 65.4 : 77.8; tone(fr, "sawtooth", t, 0.6, 0.5); tone(fr * 2, "square", t, 0.3, 0.12); }
      if (i === 6) { [261.6, 311.1, 392, 466.2].forEach((f) => tone(f, "triangle", t, 1.2, 0.18)); }
      if (i === 7) { tone(880, "sine", t, 1.4, 0.35); tone(2217, "sine", t, 0.6, 0.1); }
      const b = pads.children[i] as HTMLElement; b.classList.add("hit"); setTimeout(() => b.classList.remove("hit"), 120);
      document.querySelector(".o-cass")?.classList.add("playing");
      clearTimeout(cp); cp = setTimeout(() => document.querySelector(".o-cass")?.classList.remove("playing"), 1500);
    }
    playRef.current = play;
    function draw() {
      if (dead || !an) return;
      const w = (cv.width = cv.clientWidth * devicePixelRatio), h = (cv.height = cv.clientHeight * devicePixelRatio);
      const d = new Uint8Array(an.fftSize); an.getByteTimeDomainData(d);
      g.clearRect(0, 0, w, h); g.strokeStyle = "#3DDCFF"; g.lineWidth = 2 * devicePixelRatio; g.beginPath();
      for (let i = 0; i < d.length; i++) { const x = (i / d.length) * w, y = (d[i] / 255) * h; if (i) g.lineTo(x, y); else g.moveTo(x, y); }
      g.stroke(); raf = requestAnimationFrame(draw);
    }
    { const w = (cv.width = cv.clientWidth), h = (cv.height = cv.clientHeight); g.strokeStyle = "#3A3D44"; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); }
    const key = (e: KeyboardEvent) => { const k = +e.key; if (k >= 1 && k <= 8) play(k - 1); };
    addEventListener("keydown", key);
    return () => {
      dead = true; cancelAnimationFrame(raf); removeEventListener("keydown", key);
      if (ac) void (ac as AudioContext).close();
    };
  }, []);

  return (
    <div className="sh dark">
      <h2 id="sheetTitle">Unearthed Samples.</h2>
      <p className="lead">Prodavnica muzičkih semplova. Potpis je zvuk: kupac čuje paket pre nego što ga kupi. Probaj, klikni ili pritisni 1 do 8.</p>
      <Shot k="unearthed" />
      <div className="pads" ref={padsRef}>
        {PAD_NAMES.map((n, i) => (
          <button
            key={n}
            type="button"
            onPointerDown={() => playRef.current(i)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); playRef.current(i); } }}
          >
            <kbd>{i + 1}</kbd><span>{n}</span>
          </button>
        ))}
      </div>
      <canvas className="wave" ref={cvRef} />
    </div>
  );
}

function Bite() {
  const [n, setN] = useState(60);
  const c1 = useRef<HTMLElement>(null), c2 = useRef<HTMLElement>(null), c3 = useRef<HTMLElement>(null);
  const anim = (el: HTMLElement | null, v: number) => {
    if (!el) return;
    const from = +el.textContent!.replace(/\D/g, "") || 0, t0 = performance.now();
    const st = (now: number) => {
      const k = Math.min(1, (now - t0) / 250);
      el.textContent = Math.round(from + (v - from) * k).toLocaleString("sr-RS");
      if (k < 1) requestAnimationFrame(st);
    };
    requestAnimationFrame(st);
  };
  const upd = (v: number) => {
    setN(v); anim(c1.current, v * 8); anim(c2.current, Math.ceil((v * 8) / 40)); anim(c3.current, Math.max(1, Math.ceil(v / 25)));
  };
  return (
    <div className="sh paper" style={{ background: "#F4EFE4", color: "#2A2420" }}>
      <h2 id="sheetTitle">Bite Catering.</h2>
      <p className="lead" style={{ color: "#6E625A" }}>Ketering iz Zrenjanina. Potpis je meni koji računa umesto tebe: upišeš broj gostiju, sajt kaže koliko zalogaja i tacni treba.</p>
      <Shot k="bite" />
      <div className="guests">
        <label htmlFor="gs"><span>Broj gostiju</span><b>{n}</b></label>
        <input type="range" id="gs" min={10} max={300} step={5} defaultValue={60} onInput={(e) => upd(+(e.target as HTMLInputElement).value)} />
      </div>
      <div className="calc">
        <div><b ref={c1}>480</b><span>zalogaja</span></div>
        <div><b ref={c2}>12</b><span>tacni</span></div>
        <div><b ref={c3}>3</b><span>konobara</span></div>
      </div>
      <p className="lead" style={{ fontSize: 14, color: "#6E625A" }}>Primer potpisa. Brojke su ilustracija.</p>
    </div>
  );
}

function Sala() {
  const floorRef = useRef<HTMLDivElement>(null);
  const totRef = useRef<HTMLSpanElement>(null);
  const api = useRef<{ add: (p: number, x: number, y: number) => void; clear: () => void }>({ add: () => {}, clear: () => {} });
  useEffect(() => {
    const fl = floorRef.current!; let n = 0, sum = 0;
    const upd = () => { totRef.current!.textContent = n + " · " + sum.toLocaleString("sr-RS") + " RSD"; };
    function add(price: number, fx: number, fy: number) {
      const it = document.createElement("div"); it.className = "it"; it.textContent = price == 1200 ? "8" : "✿";
      if (price == 900) { it.style.background = "#9DBF7A"; it.style.width = it.style.height = "34px"; }
      fl.appendChild(it);
      const r = fl.getBoundingClientRect();
      it.style.left = fx * r.width - it.offsetWidth / 2 + "px"; it.style.top = fy * r.height - it.offsetHeight / 2 + "px";
      n++; sum += price; upd();
      it.addEventListener("pointerdown", (e) => {
        it.setPointerCapture(e.pointerId);
        const mv = (ev: PointerEvent) => {
          const r = fl.getBoundingClientRect();
          it.style.left = Math.max(0, Math.min(r.width - it.offsetWidth, ev.clientX - r.left - it.offsetWidth / 2)) + "px";
          it.style.top = Math.max(40, Math.min(r.height - it.offsetHeight, ev.clientY - r.top - it.offsetHeight / 2)) + "px";
        };
        const up = () => { it.removeEventListener("pointermove", mv); it.removeEventListener("pointerup", up); };
        it.addEventListener("pointermove", mv); it.addEventListener("pointerup", up);
      });
    }
    const clear = () => { fl.querySelectorAll(".it").forEach((i) => i.remove()); n = 0; sum = 0; upd(); };
    api.current = { add, clear };
    [[0.25, 0.45], [0.5, 0.45], [0.75, 0.45], [0.37, 0.75], [0.63, 0.75]].forEach(([x, y]) => add(1200, x, y));
    return () => { fl.querySelectorAll(".it").forEach((i) => i.remove()); };
  }, []);
  const rnd = (p: number) => api.current.add(p, 0.15 + Math.random() * 0.7, 0.3 + Math.random() * 0.6);
  return (
    <div className="sh paper" style={{ background: "#F3EEE6", color: "#2A2420" }}>
      <h2 id="sheetTitle">Adriaticum.</h2>
      <p className="lead" style={{ color: "#6E625A" }}>Iznajmljivanje dekoracije i opreme za događaje. Potpis je plan sale: kupac složi svoju salu i odmah vidi ponudu. Dodaj stolove i prevuci ih po planu.</p>
      <Shot k="sala" />
      <div className="addrow">
        <button type="button" onClick={() => rnd(1200)}>+ okrugli sto · 1.200 RSD</button>
        <button type="button" onClick={() => rnd(900)}>+ aranžman · 900 RSD</button>
        <button type="button" onClick={() => api.current.clear()}>očisti</button>
      </div>
      <div className="floor" ref={floorRef}><span className="bina">bina</span><span className="tot" ref={totRef}>0 · 0 RSD</span></div>
    </div>
  );
}

function Standard() {
  const rows = [
    ["Učitavanje, mobilni", "< 2,0 s", "1,4 s"],
    ["Lighthouse, mobilni", "≥ 90", "96"],
    ["Kontrast teksta", "WCAG AA", "7,2 : 1"],
    ["Pravni tekstovi", "kompletni", "3 / 3"],
    ["Rezervna kopija", "dnevno", "aktivno"],
    ["Domen i nalozi", "na ime klijenta", "da"],
  ];
  return (
    <div className="sh paper">
      <h2 id="sheetTitle">Ne obećavamo. Merimo.</h2>
      <p className="lead">Po uzoru na nemački Prüfprotokoll: svaki sajt pre puštanja prolazi proveru, a ti dobiješ potpisan protokol sa izmerenim vrednostima.</p>
      <div className="ptw">
        <table className="pt">
          <thead><tr><th>Kriterijum</th><th>Cilj</th><th>Izmereno</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td className="ok">prošlo</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bigstamp">PROVERENO</div>
      <p className="lead" style={{ fontSize: 14, marginTop: 18 }}>Potpisuje David Nedić, Kaufmann für E-Commerce (IHK). Vrednosti su primer.</p>
    </div>
  );
}

function Radovi({ go }: { go: Go }) {
  const items: [keyof typeof SHOTS, string, string][] = [
    ["sala", "Iznajmljivanje dekoracije i opreme", "plan sale sa cenom"],
    ["bite", "Ketering, Zrenjanin", "meni koji računa"],
    ["unearthed", "Muzički semplovi", "zvuk pre kupovine"],
  ];
  return (
    <div className="sh dark">
      <h2 id="sheetTitle">Radovi.</h2>
      <div className="wl">
        {items.map(([k, desc, sig]) => (
          <div key={k} className="wr" onClick={() => go(k)}>
            <img className="thumb" src={SHOTS[k].src} alt="" loading="lazy" />
            <h3><a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(k); }} style={{ color: "inherit" }}>{SHOTS[k].name}</a></h3>
            <span>{desc}</span>
            <small>{sig}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function Paketi({ go }: { go: Go }) {
  return (
    <div className="sh dark">
      <h2 id="sheetTitle">Paketi.</h2>
      <div className="wl">
        <div><h3>Sajt za firmu</h3><span>Do 5 stranica, potpis branše, protokol provere. Gotovo za 48h od odobrenog dema.</span><small>od 199 €</small></div>
        <div><h3>Online prodavnica</h3><span>Shopify sa plaćanjem, dostavom i potpisom. Održavanje uključeno.</span><small>45.000 RSD + 20.000/mes.</small></div>
      </div>
      <p className="lead">Demo je uvek besplatan. Plaćaš tek kad ti se svidi.</p>
      <GoBtn go={go} />
    </div>
  );
}

const DIPLOMAS = [
  {
    title: "Kaufmann für E-Commerce (IHK)",
    text: "Državno priznato nemačko stručno zvanje za e-trgovinu. Online prodaja, marketing, pravo i obrada porudžbina.",
    country: "DE",
  },
];

function Ja({ go }: { go: Go }) {
  return (
    <div className="sh paper">
      <h2 id="sheetTitle">Ko sam ja.</h2>
      <p className="lead">Ja sam David Nedić, osnivač Promet Digital. Školovao sam se i radio u Nemačkoj, a danas radim iz Zrenjanina. Sajtove pravim onako kako sam naučio tamo: precizno, dokumentovano i bez prečica.</p>
      <div className="dip">
        {DIPLOMAS.map((d) => (
          <div className="row" key={d.title}>
            <div><h3>{d.title}</h3><p>{d.text}</p></div>
            <span className="de">{d.country}</span>
          </div>
        ))}
      </div>
      <div className="why">
        <div><b>Nemački standard</b>Svaki sajt prolazi protokol provere pre puštanja.</div>
        <div><b>Pravno čisto</b>Pravni tekstovi i podaci kupaca uređeni od prvog dana.</div>
        <div><b>Jedan sagovornik</b>Pričaš direktno sa mnom, od sastanka do puštanja.</div>
      </div>
      <GoBtn go={go} />
    </div>
  );
}

function CopyBtn({ value }: { value: string }) {
  const [label, setLabel] = useState("kopiraj");
  return (
    <button
      className="copy"
      type="button"
      onClick={() => {
        (navigator.clipboard ? navigator.clipboard.writeText(value) : Promise.reject()).then(
          () => setLabel("kopirano"),
          () => setLabel("označeno"),
        );
      }}
    >
      {label}
    </button>
  );
}

function Kontakt({ time }: { time: string }) {
  return (
    <div className="sh dark">
      <h2 id="sheetTitle">Koji je tvoj potpis?</h2>
      <p className="lead">Javi se i zakažemo kratak sastanak, uživo ili online. Sastanak i demo ne koštaju ništa.</p>
      <div className="contact">
        <div><span>Telefon i WhatsApp</span><b><a href={`https://wa.me/${CONTACT.wa}`} target="_blank" rel="noopener noreferrer">{CONTACT.phone}</a></b> <CopyBtn value={CONTACT.phone} /></div>
        <div><span>Email</span><b><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></b> <CopyBtn value={CONTACT.email} /></div>
        <div><span>Gde smo</span><b>Zrenjanin · Beograd</b></div>
        <div><span>Sada je u Zrenjaninu</span><b>{time}</b></div>
      </div>
    </div>
  );
}

export function SheetBody({ name, go, time }: { name: string; go: Go; time: string }) {
  switch (name) {
    case "intro": return <Intro go={go} />;
    case "proces": return <Proces />;
    case "unearthed": return <Unearthed />;
    case "bite": return <Bite />;
    case "sala": return <Sala />;
    case "standard": return <Standard />;
    case "radovi": return <Radovi go={go} />;
    case "paketi": return <Paketi go={go} />;
    case "ja": return <Ja go={go} />;
    case "kontakt": return <Kontakt time={time} />;
    default: return null;
  }
}
