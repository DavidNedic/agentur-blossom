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
      <p className="lead">Online prodavnica muzičkih semplova sa integrisanim plaćanjem, brza na mobilnom i građena za konverziju. Shopify, Stripe, Meta Pixel.</p>
      <Shot k="unearthed" />
      <p className="demo-h">PROBAJ · KLIKNI ILI PRITISNI 1 DO 8</p>
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
      <p className="lead" style={{ color: "#6E625A" }}>Ketering iz Zrenjanina: finger food, mesne i sirne daske, mini deserti i slavska trpeza. Sajt sa menijem i upitom za ponudu.</p>
      <Shot k="bite" />
      <p className="demo-h">PROBAJ · KOLIKO GOSTIJU?</p>
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
      <p className="lead" style={{ color: "#6E625A" }}>Booking platforma za iznajmljivanje opreme za događaje. Vođeni upitnik u nekoliko koraka, katalog i direktna rezervacija.</p>
      <Shot k="sala" />
      <p className="demo-h">PROBAJ · PLAN SALE SA CENOM</p>
      <div className="addrow">
        <button type="button" onClick={() => rnd(1200)}>+ okrugli sto · 1.200 RSD</button>
        <button type="button" onClick={() => rnd(900)}>+ aranžman · 900 RSD</button>
        <button type="button" onClick={() => api.current.clear()}>očisti</button>
      </div>
      <div className="floor" ref={floorRef}><span className="bina">bina</span><span className="tot" ref={totRef}>0 · 0 RSD</span></div>
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

type Step = [string, string, string];
function Steps({ items }: { items: Step[] }) {
  return (
    <div className="steps">
      {items.map(([n, h, p]) => (
        <div key={n}><b>{n}</b><div><h3>{h}</h3><p>{p}</p></div></div>
      ))}
    </div>
  );
}

function Intro({ go }: { go: Go }) {
  return (
    <div className="sh paper">
      <h2 id="sheetTitle">Hajde na sastanak.</h2>
      <p className="lead">Promet Digital pravi sajtove, online prodavnice i sisteme po meri: za magacin, kasu, rezervacije i kamere. Za firme u Srbiji i Nemačkoj.</p>
      <p className="lead">Ne počinjemo od dizajna, nego od tebe. Na prvom sastanku pričamo šta radiš, ko su tvoji kupci i šta želiš da postigneš. Tek onda pravimo sajt koji za to služi.</p>
      <GoBtn go={go} to="sastanak" />
    </div>
  );
}

function Sastanak() {
  return (
    <div className="sh paper">
      <h2 id="sheetTitle">O čemu pričamo.</h2>
      <p className="lead">Pola sata, uživo u Zrenjaninu ili Beogradu, ili online. Prvi sastanak je besplatan.</p>
      <Steps items={[
        ["01", "Šta radiš", "Tvoj posao, tvoji proizvodi ili usluge, i kako danas dolaze kupci."],
        ["02", "Ko su tvoji kupci", "Ko kupuje, šta traže i gde te nalaze: Instagram, Google, preporuka."],
        ["03", "Koji su tvoji ciljevi", "Više upita, online prodaja, manje posla oko rezervacija, novi kupci u Nemačkoj. Šta tačno treba da se promeni."],
        ["04", "Šta je sledeći korak", "Posle sastanka dobijaš jasan plan i rok. Cena po dogovoru, bez obaveze."],
      ]} />
      <a className="btn" href={`https://wa.me/${CONTACT.wa}?text=Zdravo%2C%20hteo%20bih%20da%20zaka%C5%BEem%20sastanak.`} target="_blank" rel="noopener noreferrer">Zakaži preko WhatsApp-a</a>
    </div>
  );
}

function Nacin({ go }: { go: Go }) {
  return (
    <div className="sh paper">
      <h2 id="sheetTitle">Kako radimo.</h2>
      <Steps items={[
        ["01", "Sastanak", "Pričamo o tvom poslu, kupcima i ciljevima. Uživo ili online."],
        ["02", "Plan i dogovor", "Šta pravimo, zašto i kad je gotovo. Cenu dogovaramo pre nego što išta počne."],
        ["03", "Dizajn i izrada", "Sajt po meri tvoje firme, ne šablon. Vidiš ga u toku izrade i daješ povratne informacije."],
        ["04", "Online za 14 dana", "Testiramo sve i puštamo. Domen, kod i podaci su tvoji."],
      ]} />
      <GoBtn go={go} to="sastanak" />
    </div>
  );
}

const STAGES: [number, number, string, string, string][] = [
  [0, 0, "Dan 0", "Sastanak", "Pričamo o tvom poslu, kupcima i ciljevima. Posle toga dogovaramo plan i rok."],
  [1, 6, "Dan 01 do 06", "Dizajn po meri", "Na osnovu tvojih ciljeva: tvoje ime, boje i proizvodi. Fokus na mobilni prikaz i na to da kupac brzo nađe šta traži."],
  [7, 10, "Dan 07 do 10", "Funkcije", "Plaćanje, dostava, rezervacije, WhatsApp. Sve što tvoj posao stvarno treba, ništa više."],
  [11, 13, "Dan 11 do 13", "Testiranje", "Proveravamo porudžbine, plaćanja i obaveštenja pre starta."],
  [14, 14, "Dan 14", "Online", "Sajt je online. Domen, kod i podaci su tvoji."],
];

function Dani() {
  const [d, setD] = useState(0);
  const i = STAGES.findIndex(([a, b]) => d >= a && d <= b);
  const st = STAGES[i];
  return (
    <div className="sh paper">
      <h2 id="sheetTitle">Live za 14 dana.</h2>
      <p className="lead">Od prvog sastanka do sajta koji radi. Pomeri dane i gledaj kako nastaje.</p>
      <div className="days">
        <label htmlFor="dd"><span>Dan</span><b>{d}</b></label>
        <input type="range" id="dd" min={0} max={14} step={1} value={d} onChange={(e) => setD(+e.target.value)} />
      </div>
      <div className="build">
        <div className="stage"><small>{st[2]}</small><h3>{st[3]}</h3><p>{st[4]}</p></div>
        <div className={"mock s" + (i + 1)}>
          <div className="bar"><i /><i /><i /></div>
          <div className="pg">
            <div className="note">šta radiš?<br />kupci?<br />ciljevi?</div>
            <div className="w">
              <div className="blk hero">Tvoja prodavnica</div>
              <div className="row"><div className="blk">proizvod</div><div className="blk">proizvod</div><div className="blk">proizvod</div></div>
              <div className="row"><div className="blk">proizvod</div><div className="blk">proizvod</div><div className="blk">proizvod</div></div>
            </div>
            <span className="cartb">korpa · 2</span>
            <span className="pay">kartica · pouzeće · dostava</span>
            <div className="chk">porudžbina <span>✓</span><br />plaćanje <span>✓</span><br />obaveštenja <span>✓</span></div>
            <div className="live"><i />online · prva porudžbina</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SVC: [string, string, string, string[]][] = [
  ["SaaS i softverski sistemi", "primer: Adriaticum", "Booking i rental sistemi, CRM rešenja, interni alati i dashboard-i napravljeni prema stvarnom procesu firme.", ["Specifikacija i UX", "Korisničke uloge", "Integracije i automatizacija", "Održavanje i razvoj"]],
  ["E-commerce izrada", "primer: Unearthed Samples", "Shopify i custom prodavnice sa katalogom, korpom, plaćanjem, dostavom i povezanim poslovnim alatima.", ["Shopify ili custom", "Unos proizvoda", "Plaćanje i dostava", "ERP i CRM integracije"]],
  ["E-commerce prodaja", "prodajni sistemi", "Vodimo i razvijamo online prodaju kroz oglase, optimizaciju konverzije, marketplace kanale i preciznu analitiku.", ["Google i Meta Ads", "CRO i A/B testovi", "Marketplace kanali", "GA4 i izveštaji"]],
  ["Sajtovi i landing stranice", "po dogovoru", "Brzi poslovni sajtovi i landing stranice sa jasnom ponudom.", ["Dizajn po meri", "Mobile first", "SEO osnova", "Domen, SSL i hosting"]],
  ["Sistemi za magacin, kasu i kamere", "po meri", "Softver koji prati robu, prodaju i kretanje kupaca u radnji. Povezano sa tvojom online prodavnicom.", ["Magacin i zalihe", "Kasa i prodaja u radnji", "Kamera tracking", "Izveštaji i upozorenja"]],
  ["SEO, automatizacija i marketing", "kontinuirani rast", "Tehnički SEO, sadržaj, automatizovani tokovi i kampanje povezani sa konkretnim poslovnim ciljem.", ["Tehnički SEO", "Automatizovani tokovi", "Sadržaj i kampanje", "Mesečna analiza"]],
];

function Usluge() {
  return (
    <div className="sh paper">
      <h2 id="sheetTitle">Šta radimo.</h2>
      <p className="lead">Jedan partner za softver, prodaju i svakodnevni digitalni rad.</p>
      <div className="svc">
        {SVC.map(([h, sm, p, li], i) => (
          <details key={h} open={i === 0}>
            <summary><h3>{h}</h3><small>{sm}</small></summary>
            <div className="body"><p>{p}</p><ul>{li.map((x) => <li key={x}>{x}</li>)}</ul></div>
          </details>
        ))}
      </div>
    </div>
  );
}

function Poredjenje({ go }: { go: Go }) {
  const rows = [
    ["Prvi korak", "Gotova ponuda iz šablona", "Sastanak o tvom poslu i ciljevima"],
    ["Dizajn", "Šablon i stock fotografije", "Po meri tvoje firme i tvojih kupaca"],
    ["Sve iz jednog mesta", "3+ agencije za koordinaciju", "Sajt, SEO, društvene mreže i oglasi na jednom mestu"],
    ["Podrška", "E-mail sa odgovorom za 48h", "Direktno preko WhatsApp-a"],
    ["Isporuka", "6 do 12 nedelja", "14 dana"],
  ];
  return (
    <div className="sh paper">
      <h2 id="sheetTitle">Obično, i kod nas.</h2>
      <div className="tw">
        <table className="cmp">
          <thead><tr><th>Kriterijum</th><th>Tipična agencija</th><th>Promet Digital</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
        </table>
      </div>
      <GoBtn go={go} to="sastanak" />
    </div>
  );
}

function Sistemi({ go, active }: { go: Go; active: boolean }) {
  const cvRef = useRef<HTMLCanvasElement>(null), sinRef = useRef<HTMLElement>(null), snowRef = useRef<HTMLElement>(null), stimeRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!active) return;
    const cv = cvRef.current;
    const context = cv?.getContext("2d");
    if (!cv || !context) return;
    const g = context;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    type P = { x: number; y: number; path: [number, number][]; k: number; sp: number; c: boolean; wait: number; dwell: number; id: string; t: [number, number][]; dir: number };
    const shelves: [number, number, number, number][] = [[0.22, 0.22, 0.05, 0.42], [0.37, 0.22, 0.05, 0.42], [0.52, 0.22, 0.05, 0.42]];
    const counter: [number, number, number, number] = [0.64, 0.72, 0.16, 0.14];
    const way = (): [number, number] => { const s = shelves[Math.floor(Math.random() * 3)]; return [s[0] + s[2] + 0.035, 0.26 + Math.random() * 0.34]; };
    let nid2 = 101;
    const spawn = (): P => ({ x: -0.02, y: 0.8 + Math.random() * 0.08, path: [[0.12, 0.8], way(), way(), [0.61, 0.79], [0.12, 0.92], [-0.05, 0.92]], k: 0, sp: 0.0022 + Math.random() * 0.0012, c: false, wait: 0, dwell: 0, id: "ID " + nid2++, t: [], dir: 0 });
    let people: P[] = [spawn()], inn = 0, raf = 0, dead = false;
    if (reduce) people = [
      { ...spawn(), x: 0.29, y: 0.46, k: 1, c: true, wait: 80, dwell: 1.8, dir: 0.7 },
      { ...spawn(), x: 0.58, y: 0.79, k: 3, c: true, wait: 0, dir: 0.1 },
    ];
    const gx = 28, gy = 14, heat = new Float32Array(gx * gy);
    const pad = (n: number) => String(n).padStart(2, "0");
    const camTime = () => { const d = new Date(); return pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds()); };
    const person = (x: number, y: number, dir: number, s: number) => {
      g.save(); g.translate(x, y); g.rotate(dir);
      g.fillStyle = "#8E959E"; g.beginPath(); g.ellipse(0, 0, 4.2 * s, 7.2 * s, 0, 0, 7); g.fill();
      g.fillStyle = "#EDEEF0"; g.beginPath(); g.arc(0.8 * s, 0, 3.1 * s, 0, 7); g.fill(); g.restore();
    };
    const track = (x: number, y: number, s: number, id: string, extra: string) => {
      const r = 11 * s, l = 4 * s; g.strokeStyle = "#3DDCFF"; g.lineWidth = 1.2 * s; g.beginPath();
      ([[-1, -1], [1, -1], [1, 1], [-1, 1]] as [number, number][]).forEach(([a, b]) => {
        g.moveTo(x + a * r, y + b * r + -b * l); g.lineTo(x + a * r, y + b * r); g.lineTo(x + a * r + -a * l, y + b * r);
      });
      g.stroke(); g.fillStyle = "#3DDCFF"; g.font = 8.5 * s + "px JetBrains Mono, monospace"; g.fillText(id, x - r, y - r - 3 * s);
      if (extra) { g.fillStyle = "#A0A6AE"; g.fillText(extra, x - r, y + r + 10 * s); }
    };
    const trail = (pts: [number, number][], w: number, h: number, s: number) => {
      if (pts.length < 2) return;
      g.strokeStyle = "rgba(61,220,255,.28)"; g.lineWidth = s; g.beginPath();
      pts.forEach((p, i) => i ? g.lineTo(p[0] * w, p[1] * h) : g.moveTo(p[0] * w, p[1] * h)); g.stroke();
    };
    function draw() {
      if (dead) return;
      if (document.hidden) return;
      const d = devicePixelRatio || 1, w = (cv.width = cv.clientWidth * d), h = (cv.height = cv.clientHeight * d);
      g.clearRect(0, 0, w, h);
      const cw = w / gx, ch = h / gy;
      for (let i = 0; i < heat.length; i++) { const v = heat[i]; if (v < 0.5) continue; g.fillStyle = "rgba(61,220,255," + Math.min(0.22, v / 400).toFixed(3) + ")"; g.fillRect((i % gx) * cw + 1, Math.floor(i / gx) * ch + 1, cw - 2, ch - 2); }
      g.strokeStyle = "#4A4E57"; g.lineWidth = 2 * d; g.beginPath(); g.moveTo(0.06 * w, 0.74 * h); g.lineTo(0.06 * w, 0.15 * h); g.lineTo(0.84 * w, 0.15 * h); g.lineTo(0.84 * w, 0.96 * h); g.lineTo(0.06 * w, 0.96 * h); g.lineTo(0.06 * w, 0.97 * h); g.stroke();
      g.lineWidth = d; shelves.forEach(([x, y, ww, hh]) => { g.strokeStyle = "#3A3D44"; g.strokeRect(x * w, y * h, ww * w, hh * h); for (let k = 1; k < 6; k++) { g.beginPath(); g.moveTo(x * w, (y + hh * k / 6) * h); g.lineTo((x + ww) * w, (y + hh * k / 6) * h); g.stroke(); } });
      g.strokeStyle = "#3A3D44"; g.strokeRect(counter[0] * w, counter[1] * h, counter[2] * w, counter[3] * h);
      g.fillStyle = "#6B6F78"; g.font = 9 * d + "px JetBrains Mono, monospace"; g.fillText("KASA", (counter[0] + 0.012) * w, (counter[1] + 0.085) * h);
      g.strokeStyle = "rgba(61,220,255,.7)"; g.setLineDash([4 * d, 4 * d]); g.beginPath(); g.moveTo(0.09 * w, 0.74 * h); g.lineTo(0.09 * w, 0.96 * h); g.stroke(); g.setLineDash([]);
      g.fillStyle = "#3DDCFF"; g.fillText("ULAZ", 0.105 * w, 0.995 * h - 4 * d);
      people.forEach((p) => {
        const tg = p.path[p.k]; const dx = tg[0] - p.x, dy = tg[1] - p.y, dist = Math.hypot(dx, dy);
        if (!reduce) {
          if (p.wait > 0) { p.wait--; p.dwell += 1 / 60; }
          else if (dist < 0.01) { p.k++; if (p.k === 2 || p.k === 3) { p.wait = 60 + Math.random() * 120; p.dwell = 0; } }
          else { p.x += dx / dist * p.sp; p.y += dy / dist * p.sp; p.dir = Math.atan2(dy * h, dx * w); }
        }
        if (!p.c && p.x > 0.09) { p.c = true; inn++; if (sinRef.current) sinRef.current.textContent = String(inn); }
        const gi = Math.floor(p.y * gy) * gx + Math.floor(p.x * gx); if (gi >= 0 && gi < heat.length) heat[gi] += 1;
        p.t.push([p.x, p.y]); if (p.t.length > 90) p.t.shift(); trail(p.t, w, h, d);
        const x = p.x * w, y = p.y * h; person(x, y, p.dir, d); track(x, y, d, p.id, p.wait > 0 ? p.dwell.toFixed(1) + " s" : "");
      });
      people = people.filter((p) => p.k < p.path.length);
      if (!reduce && Math.random() < 0.01 && people.length < 6) people.push(spawn());
      if (snowRef.current) snowRef.current.textContent = String(people.filter((p) => p.c && p.x > 0.09).length);
      if (stimeRef.current) stimeRef.current.textContent = camTime();
      if (!reduce) raf = requestAnimationFrame(draw);
    }
    const onVisibility = () => { if (!document.hidden && !reduce) draw(); };
    document.addEventListener("visibilitychange", onVisibility);
    draw();
    return () => { dead = true; cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", onVisibility); };
  }, [active]);
  const cards = [
    ["Magacin i zalihe", "Prijem, izdavanje i stanje robe na jednom mestu. Upozorenje kad nešto počne da fali.", "lager · barkod · izveštaji"],
    ["Kasa i prodaja", "Prodaja u radnji i online prodavnica dele iste zalihe i iste brojeve.", "kasa · zalihe · online shop"],
    ["Kamera tracking", "Koliko ljudi uđe, kuda se kreću kroz radnju i gde se zadržavaju. Anonimno, bez prepoznavanja lica.", "brojanje · kretanje · toplotna mapa"],
    ["Rezervacije i booking", "Kalendar, dostupnost i potvrde, kao kod Adriaticum-a.", "booking · kalendar · WhatsApp"],
  ];
  return (
    <div className="sh dark">
      <h2 id="sheetTitle">Sistemi po meri.</h2>
      <p className="lead">Ne samo sajtovi. Pravimo softver koji radi u tvojoj radnji i magacinu, i povezuje sve sa online prodajom.</p>
      <div className="sysg">{cards.map(([h, p, s]) => <div key={h}><h3>{h}</h3><p>{p}</p><small>{s}</small></div>)}</div>
      <div className="store">
        <canvas ref={cvRef} />
        <span className="lbl"><b>CAM 01 · RADNJA · <span id="stime" ref={stimeRef}>--:--:--</span></b><small>primer · anonimno</small></span>
        <div className="hud"><span>ušlo</span><b ref={sinRef}>0</b><span>u radnji</span><b ref={snowRef}>0</b></div>
      </div>
      <p className="small">Primer prikaza. Cena i obim po dogovoru, posle sastanka.</p>
      <GoBtn go={go} to="sastanak" />
    </div>
  );
}

function Radovi({ go }: { go: Go }) {
  const items: [keyof typeof SHOTS, string, string][] = [
    ["sala", "Booking platforma za iznajmljivanje opreme", "2026"],
    ["unearthed", "Online prodavnica muzičkih semplova", "2025"],
    ["bite", "Ketering, Zrenjanin", "2026"],
  ];
  return (
    <div className="sh dark">
      <h2 id="sheetTitle">Radovi.</h2>
      <div style={{ marginTop: 24, borderTop: "1px solid #33363D" }}>
        {items.map(([k, desc, y]) => (
          <a key={k} className="proj" href="#" onClick={(e) => { e.preventDefault(); go(k); }}>
            <img src={SHOTS[k].src} alt="" loading="lazy" />
            <div><h3>{SHOTS[k].name}</h3><span>{desc}</span></div>
            <small>{y}</small>
          </a>
        ))}
      </div>
    </div>
  );
}

const DIPLOMAS = [
  {
    title: "Kaufmann für E-Commerce (IHK)",
    text: "Komercijalista za elektronsku trgovinu. Državno priznato stručno zvanje stečeno u Nemačkoj kroz dualno obrazovanje.",
    country: "DE / RS",
  },
];

function Ja({ go }: { go: Go }) {
  return (
    <div className="sh paper">
      <h2 id="sheetTitle">Nemački standard. Za srpski biznis.</h2>
      <p className="lead">Ja sam David Nedić, osnivač Promet Digital. Školovao sam se i radio u Nemačkoj, a danas to iskustvo primenjujem za firme u Srbiji i Nemačkoj: precizno, pouzdano i transparentno.</p>
      <div className="dip">
        {DIPLOMAS.map((d) => (
          <div className="row" key={d.title}>
            <div><h3>{d.title}</h3><p>{d.text}</p></div>
            <span className="de">{d.country}</span>
          </div>
        ))}
      </div>
      <div className="pts">
        <div><b>Fiksni rokovi</b>Dogovoreni datumi, jasne faze i odgovornost za isporuku.</div>
        <div><b>Jasni ugovori</b>Obim posla i uslovi definišu se pre početka.</div>
        <div><b>Dokumentovani procesi</b>Odluke, pristupi i sledeći koraci ostaju uredno zabeleženi.</div>
        <div><b>GDPR nivo rada sa podacima</b>Pristupi, podaci kupaca i analitika tretiraju se pažljivo.</div>
      </div>
      <GoBtn go={go} to="sastanak" />
    </div>
  );
}

function Kontakt({ time }: { time: string }) {
  return (
    <div className="sh dark">
      <h2 id="sheetTitle">Hajde na sastanak.</h2>
      <p className="lead">Javi se i dogovorimo termin, uživo ili online. Pričamo o tvom poslu i ciljevima. Prvi sastanak je besplatan.</p>
      <div className="contact">
        <div><span>WhatsApp i telefon</span><b><a href={`https://wa.me/${CONTACT.wa}`} target="_blank" rel="noopener noreferrer">{CONTACT.phone}</a></b> <CopyBtn value={CONTACT.phone} /></div>
        <div><span>E-mail</span><b><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></b> <CopyBtn value={CONTACT.email} /></div>
        <div><span>Gde smo</span><b>Zrenjanin · Beograd</b></div>
        <div><span>Sada je u Zrenjaninu</span><b>{time}</b></div>
      </div>
    </div>
  );
}

export function SheetBody({ name, go, time, active = true }: { name: string; go: Go; time: string; active?: boolean }) {
  switch (name) {
    case "intro": return <Intro go={go} />;
    case "sastanak": return <Sastanak />;
    case "nacin": return <Nacin go={go} />;
    case "dani": return <Dani />;
    case "usluge": return <Usluge />;
    case "poredjenje": return <Poredjenje go={go} />;
    case "sistemi": return <Sistemi go={go} active={active} />;
    case "unearthed": return <Unearthed />;
    case "bite": return <Bite />;
    case "sala": return <Sala />;
    case "radovi": return <Radovi go={go} />;
    case "ja": return <Ja go={go} />;
    case "kontakt": return <Kontakt time={time} />;
    default: return null;
  }
}
