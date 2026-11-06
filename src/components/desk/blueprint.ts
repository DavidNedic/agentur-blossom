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
  // the timeline by at most 50ms, so the sequence never skips ahead on a busy main thread.
  let vt = 0, last = 0, raf = 0, finished = false;
  const queue: { t: number; f: () => void }[] = [];
  const at = (ms: number, f: () => void) => { queue.push({ t: vt + ms, f }); };
  const tick = (now: number) => {
    if (finished) return;
    if (last) vt += Math.min(50, now - last);
    last = now;
    for (let i = 0; i < queue.length; i++) if (queue[i].t <= vt) { const [q] = queue.splice(i--, 1); q.f(); if (finished) return; }
    raf = requestAnimationFrame(tick);
  };

  const bp = document.createElement("div");
  bp.className = "bp";
  bp.setAttribute("aria-hidden", "true");
  bp.innerHTML = '<div class="bp-paper"><div class="bp-grid"></div><div class="bp-ruler x"></div><div class="bp-ruler y"></div></div><span class="bp-scan"></span><div class="bp-lines"></div><pre class="bp-code"><span class="bp-file">desk.tsx</span><code></code></pre><div class="bp-meta"></div>';
  const skip = document.createElement("button");
  skip.type = "button";
  skip.className = "bp-skip";
  skip.textContent = de ? "überspringen →" : "preskoči →";
  bp.appendChild(skip);
  root.appendChild(bp);

  const paper = bp.querySelector<HTMLElement>(".bp-paper")!;
  const scan = bp.querySelector<HTMLElement>(".bp-scan")!;
  const lines = bp.querySelector<HTMLElement>(".bp-lines")!;
  const code = bp.querySelector<HTMLElement>(".bp-code code")!;
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
    b.innerHTML = `<span class="bp-tag">&lt;${NAMES[it.key] || it.key} /&gt;</span><span class="bp-dim">${Math.round(it.w)} × ${Math.round(it.h)}</span><i class="bp-x"></i><i class="bp-y"></i>`;
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

  // timeline (ms)
  const T_HEAD = 260, STEP = 105, T_PLACE = T_HEAD + 4 * 70;
  const T_RENDER = T_PLACE + order.length * STEP + 180;
  const T_SCAN = T_RENDER + 160, SCAN = 820;
  const T_END = T_SCAN + SCAN + 260;

  requestAnimationFrame(() => bp.classList.add("on"));
  raf = requestAnimationFrame(tick);
  const addLine = (i: number) => {
    const row = document.createElement("span");
    row.className = "ln";
    row.innerHTML = hl(src[i]) || " ";
    code.appendChild(row);
    while (code.children.length > 9) code.firstElementChild!.remove();
  };
  for (let i = 0; i < 4; i++) at(T_HEAD + i * 70, () => addLine(i));
  order.forEach((_, k) => at(T_PLACE + k * STEP, () => { addLine(4 + k); boxes[k].classList.add("drawn"); }));
  at(T_RENDER, () => { addLine(src.length - 2); addLine(src.length - 1); bp.classList.add("rendering"); });

  at(T_SCAN, () => {
    paper.animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(100% 0 0 0)" }], { duration: SCAN, easing: "cubic-bezier(.55,0,.25,1)", fill: "forwards" });
    scan.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: `translateY(${H}px)`, opacity: 1 }], { duration: SCAN, easing: "cubic-bezier(.55,0,.25,1)", fill: "forwards" });
    // each outline lets go of its object once the scan line has passed it
    order.forEach((it, k) => {
      const cy = Math.min(1, Math.max(0, (it.y + it.h / 2) / H));
      at(SCAN * cy * 0.9, () => boxes[k].classList.add("built"));
    });
  });
  at(T_END, () => finish(false));

  function finish(fast: boolean) {
    if (finished) return;
    finished = true;
    try { sessionStorage.setItem(KEY, "1"); } catch { /* private mode */ }
    cancelAnimationFrame(raf);
    const fade = bp.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fast ? 240 : 320, easing: "ease-out", fill: "forwards" });
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
