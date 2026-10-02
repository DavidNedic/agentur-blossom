export type Field = {
  drop: (el: Element, a?: number) => void;
  press: (el: Element | null) => void;
  destroy: () => void;
};

export function createField(cv: HTMLCanvasElement, reduce: boolean): Field {
  const g = cv.getContext("2d")!;
  const P = new Uint8Array(512);
  {
    const p = [...Array(256).keys()];
    let seed = 7;
    for (let i = 255; i > 0; i--) {
      seed = (seed * 16807) % 2147483647;
      const j = seed % (i + 1);
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 512; i++) P[i] = p[i & 255];
  }
  const G = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
  function n3(x: number, y: number, z: number) {
    const F = 1 / 3, Gc = 1 / 6;
    const s = (x + y + z) * F;
    const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
    const t = (i + j + k) * Gc;
    const x0 = x - i + t, y0 = y - j + t, z0 = z - k + t;
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }
    const c = [
      [x0, y0, z0, 0, 0, 0],
      [x0 - i1 + Gc, y0 - j1 + Gc, z0 - k1 + Gc, i1, j1, k1],
      [x0 - i2 + 2 * Gc, y0 - j2 + 2 * Gc, z0 - k2 + 2 * Gc, i2, j2, k2],
      [x0 - 1 + 3 * Gc, y0 - 1 + 3 * Gc, z0 - 1 + 3 * Gc, 1, 1, 1],
    ];
    let n = 0;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    for (const [a, b, d, u, v, w] of c) {
      let tt = 0.6 - a * a - b * b - d * d;
      if (tt > 0) {
        const gr = G[P[ii + u + P[jj + v + P[kk + w]]] % 12];
        tt *= tt;
        n += tt * tt * (gr[0] * a + gr[1] * b + gr[2] * d);
      }
    }
    return 32 * n;
  }
  let W = 0, H = 0, dpr = 1, C = 16, cols = 0, rows = 0, vals = new Float32Array(0);
  const ripples: { x: number; y: number; t: number; a: number }[] = [];
  let press: { x: number; y: number } | null = null;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; C = W < 760 ? 14 : 16;
    cols = Math.ceil(W / C) + 1; rows = Math.ceil(H / C) + 1; vals = new Float32Array(cols * rows);
  }
  size();
  const LEVELS = 14;
  function sample(t: number) {
    const now = performance.now() / 1000;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = c * C, y = r * C;
      let v = n3(x * 0.0021, y * 0.0021, t * 0.035) * 0.75 + n3(x * 0.0055, y * 0.0055, t * 0.06 + 9) * 0.25;
      for (const rp of ripples) {
        const age = now - rp.t; const d = Math.hypot(x - rp.x, y - rp.y); const front = age * 260; const k = (d - front) / 70;
        v += rp.a * Math.exp(-k * k) * Math.exp(-age * 1.1) * Math.cos((d - front) * 0.05);
      }
      if (press) { const d = (x - press.x) ** 2 + (y - press.y) ** 2; v += 0.35 * Math.exp(-d / (2 * 150 * 150)); }
      vals[r * cols + c] = v;
    }
    for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t > 3.2) ripples.splice(i, 1);
  }
  function render(t: number) {
    sample(t);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = "#1A1B1F"; g.fillRect(0, 0, W, H);
    const now = performance.now() / 1000;
    for (let L = 0; L < LEVELS; L++) {
      const lv = -1.05 + L * (2.1 / LEVELS), major = L % 4 === 0;
      g.beginPath();
      for (let r = 0; r < rows - 1; r++) for (let c = 0; c < cols - 1; c++) {
        const a = vals[r * cols + c], b = vals[r * cols + c + 1], d = vals[(r + 1) * cols + c], e = vals[(r + 1) * cols + c + 1];
        const idx = (+(a > lv)) | (+(b > lv) << 1) | (+(e > lv) << 2) | (+(d > lv) << 3);
        if (idx === 0 || idx === 15) continue;
        const x = c * C, y = r * C;
        const T = [x + (C * (lv - a)) / (b - a), y], Rr = [x + C, y + (C * (lv - b)) / (e - b)], B = [x + (C * (lv - d)) / (e - d), y + C], Lf = [x, y + (C * (lv - a)) / (d - a)];
        const seg = (p: number[], q: number[]) => { g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); };
        switch (idx) {
          case 1: case 14: seg(Lf, T); break;
          case 2: case 13: seg(T, Rr); break;
          case 3: case 12: seg(Lf, Rr); break;
          case 4: case 11: seg(Rr, B); break;
          case 6: case 9: seg(T, B); break;
          case 7: case 8: seg(Lf, B); break;
          case 5: seg(Lf, T); seg(Rr, B); break;
          case 10: seg(T, Rr); seg(Lf, B); break;
        }
      }
      g.lineWidth = major ? 1.3 : 1; g.strokeStyle = major ? "#454A53" : "#2E3137"; g.stroke();
    }
    for (const rp of ripples) {
      const age = now - rp.t; const rad = age * 260; const al = Math.max(0, 0.5 * Math.exp(-age * 1.4));
      if (al < 0.01) continue;
      g.beginPath(); g.arc(rp.x, rp.y, rad, 0, Math.PI * 2);
      g.strokeStyle = "rgba(61,220,255," + al.toFixed(3) + ")"; g.lineWidth = 1.5; g.stroke();
    }
  }
  let t = 0, last = performance.now(), run = true, dead = false, raf = 0;
  function loop(n: number) {
    if (dead) return;
    const dt = Math.min(0.05, (n - last) / 1000); last = n; t += dt; render(t);
    if (run) raf = requestAnimationFrame(loop);
  }
  const onResize = () => { size(); if (reduce) render(0); };
  addEventListener("resize", onResize);
  if (reduce) render(0); else raf = requestAnimationFrame(loop);
  const onVis = () => {
    if (reduce) return;
    if (document.hidden) run = false;
    else if (!run) { run = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  };
  document.addEventListener("visibilitychange", onVis);
  return {
    drop(el, a) {
      if (reduce) return;
      const r = el.getBoundingClientRect();
      ripples.push({ x: r.left + r.width / 2, y: r.top + r.height / 2, t: performance.now() / 1000, a: a || 0.55 });
      if (ripples.length > 8) ripples.shift();
    },
    press(el) {
      if (!el) { press = null; return; }
      const r = el.getBoundingClientRect(); press = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
    destroy() {
      dead = true; cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    },
  };
}
