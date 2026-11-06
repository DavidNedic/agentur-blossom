// Blueprint intro for the Promet desk: on the first visit of a session the desk is shown
// as a construction drawing. A code panel "programs" every object onto the desk, each line
// draws that object's dashed outline at its real position, then a scan line wipes the
// drawing away and the real desk appears inside the outlines.
// Browser-only; created from the Desk effect, never rendered in markup (SSR stays complete).

export type BlueprintItem = { el: HTMLElement; key: string; x: number; y: number; w: number; h: number; r: number; fx: number; fy: number };

const NAMES: Record<string, string> = {
  card: "MeetingCard", lap: "Laptop", cup: "Coffee", cal: "Calendar", sys: "Systems", cert: "Certificate",
  score: "Compare", fold: "Services", phone: "Phone", work: "Portfolio", biz: "BusinessCard", sticky: "StickyNote", pen: "Pen",
};

const KEY = "promet-blueprint-seen";

export function shouldRunBlueprint() {
  try {
    if (new URLSearchParams(location.search).has("blueprint")) return true;
    return sessionStorage.getItem(KEY) !== "1";
  } catch { return false; }
}

const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]!));
const n2 = (v: number) => v.toFixed(2).replace(/^0/, "");

// minimal highlighting: keywords, strings, numbers, components
const TOKEN = /(\/\/.*$)|("[^"]*")|(<\w+ \/>)|\b(const|import|from|await)\b|(-?\.\d+|-?\b\d+\b)/g;
function hl(line: string) {
  let out = "", last = 0;
  for (const m of line.matchAll(TOKEN)) {
    out += esc(line.slice(last, m.index));
    const cls = m[1] ? "c" : m[2] ? "s" : m[3] ? "t" : m[4] ? "k" : "n";
    out += `<i class="${cls}">${esc(m[0])}</i>`;
    last = m.index! + m[0].length;
  }
  return out + esc(line.slice(last));
}

export function runBlueprint(root: HTMLElement, items: BlueprintItem[], onDone: () => void) {
  const de = document.documentElement.dataset.deskLang === "de";
  // Virtual clock driven by animation frames: a long frame (hydration, WebGL setup) advances
  // the timeline by at most 50ms, so the sequence never jumps ahead on a busy main thread.
  // `?blueprint` (forced run for testing/recording) follows the document clock without the cap.
  let speed = 1, cap = 50;
  try {
    const q = new URLSearchParams(location.search);
    if (q.has("blueprint")) { cap = Infinity; speed = Math.min(1, Math.max(0.1, Number(q.get("blueprint")) || 1)); }
  } catch { /* defaults */ }
  let vt = 0, last = 0, raf = 0, finished = false;
  const queue: { t: number; f: () => void }[] = [];
  const typers: { row: HTMLElement; text: string; t0: number; dur: number; shown: number }[] = [];
  const at = (ms: number, f: () => void) => { queue.push({ t: vt + ms, f }); };
  const tick = (now: number) => {
    if (finished) return;
    if (last) vt += Math.min(cap, (now - last) * speed);
    last = now;
    const due = queue.filter((q) => q.t <= vt);
    if (due.length) { for (let i = queue.length - 1; i >= 0; i--) if (queue[i].t <= vt) queue.splice(i, 1); }
    for (const q of due) { q.f(); if (finished) return; }
    for (let i = 0; i < typers.length; i++) {
      const ty = typers[i], n = Math.min(ty.text.length, Math.ceil(((vt - ty.t0) / ty.dur) * ty.text.length));
      if (n !== ty.shown) { ty.shown = n; ty.row.innerHTML = hl(ty.text.slice(0, n)) || " "; }
      if (n >= ty.text.length) { typers.splice(i--, 1); ty.row.classList.add("done"); }
    }
    raf = requestAnimationFrame(tick);
  };

  const bp = document.createElement("div");
  bp.className = "bp";
  bp.setAttribute("aria-hidden", "true");
  bp.innerHTML = '<div class="bp-paper"><div class="bp-grid"></div><div class="bp-ruler x"></div><div class="bp-ruler y"></div></div><span class="bp-scan"></span><div class="bp-lines"></div><pre class="bp-code"><span class="bp-file">desk.tsx</span><code><span class="bp-roll"></span></code></pre><div class="bp-meta"></div>';
  const skip = document.createElement("button");
  skip.type = "button";
  skip.className = "bp-skip";
  skip.textContent = de ? "überspringen →" : "preskoči →";
  bp.appendChild(skip);
  root.appendChild(bp);

  const paper = bp.querySelector<HTMLElement>(".bp-paper")!;
  const scan = bp.querySelector<HTMLElement>(".bp-scan")!;
  const lines = bp.querySelector<HTMLElement>(".bp-lines")!;
  const roll = bp.querySelector<HTMLElement>(".bp-roll")!;
  const VISIBLE = innerWidth <= 760 ? 6 : 9;
  const meta = bp.querySelector<HTMLElement>(".bp-meta")!;
  const W = innerWidth, H = innerHeight;
  meta.textContent = `${W} × ${H}  ·  grid 24  ·  ${items.length} ${de ? "objekte" : "objekata"}`;

  // ruler numbers
  const rx = bp.querySelector<HTMLElement>(".bp-ruler.x")!, ry = bp.querySelector<HTMLElement>(".bp-ruler.y")!;
  for (let x = 120; x < W; x += 120) { const s = document.createElement("span"); s.style.left = x + "px"; s.textContent = String(x); rx.appendChild(s); }
  for (let y = 120; y < H; y += 120) { const s = document.createElement("span"); s.style.top = y + "px"; s.textContent = String(y); ry.appendChild(s); }

  // outlines, in typing order (the meeting card last, like the real intro)
  const order = [...items.filter((i) => i.key !== "card"), ...items.filter((i) => i.key === "card")];
  const boxes = order.map((it) => {
    const b = document.createElement("div");
    b.className = "bp-box" + (it.key === "card" ? " main" : "");
    b.style.width = it.w + "px"; b.style.height = it.h + "px";
    b.style.transform = `translate(${it.x}px,${it.y}px) rotate(${it.r}deg)`;
    b.innerHTML = `<span class="bp-tag">&lt;${NAMES[it.key] || it.key} /&gt;</span><span class="bp-dim">${Math.round(it.w)} × ${Math.round(it.h)}</span><i class="bp-x"></i><i class="bp-y"></i>`
      + `<svg class="bp-svg" width="${it.w + 2}" height="${it.h + 2}" viewBox="-1 -1 ${it.w + 2} ${it.h + 2}"><rect class="dash" x=".5" y=".5" width="${it.w - 1}" height="${it.h - 1}"/><rect class="trace" pathLength="1" x=".5" y=".5" width="${it.w - 1}" height="${it.h - 1}"/></svg>`;
    lines.appendChild(b);
    return b;
  });

  const src = [
    "// promet.digital / radni sto",
    'import { createDesk } from "promet/desk";',
    "",
    'const desk = createDesk({ lang: "' + (de ? "de" : "sr") + '" });',
    ...order.map((it) => `desk.place(<${NAMES[it.key] || it.key} />, ${n2(it.fx)}, ${n2(it.fy)}, ${Math.round(it.r)});`),
    "",
    "await desk.render();",
  ];

  // timeline (ms, virtual)
  const T_HEAD = 300, HEAD = 120, STEP = 112, TYPE = 92;
  const T_PLACE = T_HEAD + 4 * HEAD;
  const T_RENDER = T_PLACE + order.length * STEP + 200;
  const T_SCAN = T_RENDER + 420, SCAN = 1500;
  const T_END = T_SCAN + SCAN + 60;

  requestAnimationFrame(() => bp.classList.add("on"));
  raf = requestAnimationFrame(tick);
  let count = 0;
  const addLine = (i: number, dur: number) => {
    const row = document.createElement("span");
    row.className = "ln";
    row.textContent = " ";
    roll.appendChild(row);
    count++;
    // the code scrolls up smoothly instead of lines being cut off
    roll.style.transform = `translateY(${-Math.max(0, count - VISIBLE) * 1.7}em)`;
    if (!src[i]) { row.classList.add("done"); return; }
    typers.push({ row, text: src[i], t0: vt, dur, shown: 0 });
  };
  for (let i = 0; i < 4; i++) at(T_HEAD + i * HEAD, () => addLine(i, i === 2 ? 0 : TYPE + 20));
  order.forEach((_, k) => at(T_PLACE + k * STEP, () => {
    addLine(4 + k, TYPE);
    at(TYPE * 0.6, () => boxes[k].classList.add("drawn"));
  }));
  at(T_RENDER, () => addLine(src.length - 2, 0));
  at(T_RENDER + 60, () => addLine(src.length - 1, 160));
  at(T_RENDER + 300, () => bp.classList.add("rendering"));

  // Reveal: a soft-edged band moves top to bottom with the scan line; behind it the real desk.
  // Mask is 3x the viewport; its soft edge (46%..52%) sits at y = (2p - .53..-.44) * H.
  const reveal = (p: number) => {
    paper.style.setProperty("-webkit-mask-position", `0 ${(1 - p) * 100}%`);
    paper.style.setProperty("mask-position", `0 ${(1 - p) * 100}%`);
    scan.style.transform = `translateY(${(-0.44 + 2 * p) * H}px)`;
  };
  const ease = (x: number) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  at(T_SCAN, () => {
    bp.classList.add("scanning");
    const t0 = vt, built = new Set<number>();
    const step = () => {
      if (finished) return;
      const p = ease(Math.min(1, (vt - t0) / SCAN)), edge = (-0.5 + 2 * p) * H;
      reveal(p);
      // each outline lets go of its object once the band has passed its centre
      order.forEach((it, k) => { if (!built.has(k) && edge > it.y + it.h * 0.55) { built.add(k); boxes[k].classList.add("built"); } });
      if (p < 1) at(0, step);
    };
    step();
  });
  at(T_END, () => finish(false));

  function finish(fast: boolean) {
    if (finished) return;
    finished = true;
    try { sessionStorage.setItem(KEY, "1"); } catch { /* private mode */ }
    cancelAnimationFrame(raf);
    const fade = bp.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fast ? 260 : 420, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
    fade.onfinish = () => bp.remove();
    onDone();
  }

  const onSkip = () => finish(true);
  const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") onSkip(); };
  skip.addEventListener("click", onSkip);
  bp.addEventListener("pointerdown", onSkip);
  addEventListener("keydown", onKey);
  addEventListener("wheel", onSkip, { passive: true });

  return {
    duration: T_END,
    destroy() {
      finished = true;
      cancelAnimationFrame(raf);
      removeEventListener("keydown", onKey);
      removeEventListener("wheel", onSkip);
      bp.remove();
    },
  };
}
