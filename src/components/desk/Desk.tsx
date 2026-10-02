import { useCallback, useEffect, useRef, useState } from "react";
import { CONTACT } from "@/lib/i18n";
import { createField } from "./ContourField";
import { SheetBody, SHOTS } from "./Sheets";

type S = { x: number; y: number; r: number; vx: number; vy: number; tilt?: number };

const L: Record<string, [number, number, number]> = {
  card: [0.42, 0.4, -2], note: [0.12, 0.64, 4], cass: [0.43, 0.78, -7], menu: [0.56, 0.75, 6], proto: [0.68, 0.27, 5], plan: [0.7, 0.62, -4],
  work: [0.86, 0.71, 3], biz: [0.13, 0.19, -7], phone: [0.88, 0.3, 8], sticky: [0.27, 0.85, -9], pen: [0.47, 0.09, 22],
};
const Lm: Record<string, [number, number, number]> = {
  card: [0.5, 0.08, -2], note: [0.3, 0.27, 4], phone: [0.76, 0.26, 8], cass: [0.34, 0.42, -6], menu: [0.74, 0.43, 5], proto: [0.3, 0.55, 5], plan: [0.68, 0.56, -5],
  work: [0.42, 0.71, 3], sticky: [0.78, 0.72, -9], biz: [0.5, 0.87, -6], pen: [0.62, 0.95, 18],
};

const fmtT = () => new Intl.DateTimeFormat("sr-RS", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Belgrade" }).format(new Date());

export function Desk() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastObj = useRef<HTMLElement | null>(null);
  const hinted = useRef(false);
  const [time, setTime] = useState("--:--");
  const [name, setName] = useState<string | null>(null);
  const [on, setOn] = useState(false);
  const [seq, setSeq] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const hideHint = useCallback(() => {
    if (hinted.current) return;
    hinted.current = true;
    if (hintRef.current) hintRef.current.style.opacity = "0";
  }, []);

  const open = useCallback((n: string, o?: HTMLElement | null) => {
    lastObj.current = o || lastObj.current;
    setName(n); setOn(true); setSeq((s) => s + 1); setTime(fmtT());
  }, []);
  const close = useCallback(() => {
    setOn(false);
    lastObj.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!on) return;
    if (sheetRef.current) sheetRef.current.scrollTop = 0;
    closeRef.current?.focus({ preventScroll: true });
  }, [seq, on]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && on) close(); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [on, close]);

  useEffect(() => {
    const tick = () => setTime(fmtT());
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const root = rootRef.current!, desk = deskRef.current!;
    const objs = [...desk.querySelectorAll<HTMLElement>(".obj")];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = () => innerWidth <= 760;
    const field = createField(cvRef.current!, reduce);
    let dead = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const st = new Map<HTMLElement, S>();
    const setScale = () => {
      const s = small() ? Math.min(innerWidth / 600, 0.78) : Math.max(0.62, Math.min(innerWidth / 1500, innerHeight / 950, 1.12));
      root.style.setProperty("--s", s.toFixed(3));
    };
    const draw = (o: HTMLElement) => {
      const s = st.get(o)!;
      o.style.transform = "translate(" + s.x + "px," + s.y + "px) rotate(" + (s.r + (s.tilt || 0)) + "deg)";
    };
    const place = (o: HTMLElement) => {
      const k = o.dataset.k!, map = small() ? Lm : L, [fx, fy, r] = map[k];
      const W = desk.clientWidth, H = desk.clientHeight;
      st.set(o, { x: fx * W - o.offsetWidth / 2, y: fy * H - o.offsetHeight / 2, r, vx: 0, vy: 0 });
      draw(o);
    };
    const layout = () => { setScale(); objs.forEach(place); };
    layout();
    let lt: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => { clearTimeout(lt); lt = setTimeout(layout, 120); };
    addEventListener("resize", onResize);

    let z = 10;
    objs.forEach((o) => (o.style.zIndex = String(z++)));
    desk.querySelector<HTMLElement>(".o-menu")!.style.zIndex = String(++z);
    desk.querySelector<HTMLElement>(".o-card")!.style.zIndex = String(++z);
    const raise = (o: HTMLElement) => (o.style.zIndex = String(++z));

    if (!reduce) {
      const ordered = [...objs.filter((o) => o.dataset.k !== "card"), ...objs.filter((o) => o.dataset.k === "card")];
      ordered.forEach((o, i) => {
        const s = st.get(o);
        if (!s) return;
        const W = desk.clientWidth, H = desk.clientHeight, mobile = small();
        const cx = s.x + o.offsetWidth / 2, cy = s.y + o.offsetHeight / 2;
        const edge = mobile
          ? (cx <= W / 2 ? "left" : "right")
          : ([
              ["left", cx], ["right", W - cx], ["top", cy], ["bottom", H - cy],
            ] as const).reduce((nearest, candidate) => candidate[1] < nearest[1] ? candidate : nearest)[0];
        const extra = mobile ? 0.05 : 0.15;
        let startX = s.x, startY = s.y, overX = s.x, overY = s.y;
        if (edge === "left") { startX = -o.offsetWidth - W * extra; overX += 8; }
        if (edge === "right") { startX = W + W * extra; overX -= 8; }
        if (edge === "top") { startY = -o.offsetHeight - H * extra; overY += 8; }
        if (edge === "bottom") { startY = H + H * extra; overY -= 8; }
        const card = o.dataset.k === "card", duration = card ? 1300 : 1100, delay = 200 + i * 110;
        o.animate(
          [
            { transform: "translate(" + startX + "px," + startY + "px) rotate(" + (s.r + (i % 2 ? -35 : 35)) + "deg) scale(1.18)" },
            { transform: "translate(" + overX + "px," + overY + "px) rotate(" + (s.r - 2) + "deg) scale(.99)", offset: 0.72 },
            { transform: "translate(" + s.x + "px," + s.y + "px) rotate(" + s.r + "deg) scale(1)" },
          ],
          { duration, delay, easing: "cubic-bezier(.2,.8,.25,1)", fill: "backwards" },
        );
        const shadow = o.querySelector<HTMLElement>(".shadow");
        shadow?.animate(
          [
            { boxShadow: "0 18px 24px rgba(0,0,0,.22), 0 58px 90px rgba(0,0,0,.28)" },
            { boxShadow: "0 2px 3px rgba(0,0,0,.45), 0 18px 36px rgba(0,0,0,.35)" },
          ],
          { duration, delay, easing: "cubic-bezier(.2,.8,.25,1)", fill: "backwards" },
        );
        timers.push(setTimeout(() => field.drop(o, card ? 0.9 : 0.45), delay + duration));
      });
    }

    function glide(o: HTMLElement) {
      const s = st.get(o)!;
      function step() {
        if (dead) return;
        s.vx *= 0.9; s.vy *= 0.9; s.tilt = (s.tilt || 0) * 0.85; s.x += s.vx; s.y += s.vy;
        const W = desk.clientWidth, H = desk.clientHeight, w = o.offsetWidth, h = o.offsetHeight;
        if (s.x < -w * 0.4) { s.x = -w * 0.4; s.vx *= -0.5; }
        if (s.x > W - w * 0.6) { s.x = W - w * 0.6; s.vx *= -0.5; }
        if (s.y < -h * 0.3) { s.y = -h * 0.3; s.vy *= -0.5; }
        if (s.y > H - h * 0.6) { s.y = H - h * 0.6; s.vy *= -0.5; }
        draw(o);
        if (Math.abs(s.vx) + Math.abs(s.vy) > 0.2 || Math.abs(s.tilt) > 0.1) requestAnimationFrame(step);
        else { s.tilt = 0; draw(o); field.drop(o, 0.6); }
      }
      requestAnimationFrame(step);
    }

    let drag: { o: HTMLElement; sx: number; sy: number; ox: number; oy: number; lx: number; ly: number; lt: number; moved: number } | null = null;
    const cleanups: (() => void)[] = [];
    objs.forEach((o) => {
      const down = (e: PointerEvent) => {
        if (e.button !== 0) return;
        const s = st.get(o)!; raise(o);
        if (!small()) { o.classList.add("grab"); o.setPointerCapture(e.pointerId); }
        drag = { o, sx: e.clientX, sy: e.clientY, ox: s.x, oy: s.y, lx: e.clientX, ly: e.clientY, lt: performance.now(), moved: 0 };
        s.vx = s.vy = 0;
        hideHint();
      };
      const move = (e: PointerEvent) => {
        if (!drag || drag.o !== o) return;
        if (small()) { drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy)); return; }
        const s = st.get(o)!, now = performance.now(), dt = Math.max(1, now - drag.lt);
        s.x = drag.ox + (e.clientX - drag.sx); s.y = drag.oy + (e.clientY - drag.sy);
        s.vx = ((e.clientX - drag.lx) / dt) * 16; s.vy = ((e.clientY - drag.ly) / dt) * 16;
        s.tilt = Math.max(-8, Math.min(8, s.vx * 0.6));
        drag.moved = Math.max(drag.moved, Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy));
        drag.lx = e.clientX; drag.ly = e.clientY; drag.lt = now; draw(o); field.press(o);
      };
      const end = () => {
        if (!drag || drag.o !== o) return;
        o.classList.remove("grab");
        const moved = drag.moved; drag = null; field.press(null);
        if (moved < 6 && o.dataset.open) { open(o.dataset.open, o); return; }
        if (!reduce) glide(o); else { st.get(o)!.tilt = 0; draw(o); }
      };
      const key = (e: KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === " ") && o.dataset.open) { e.preventDefault(); open(o.dataset.open, o); }
      };
      o.addEventListener("pointerdown", down);
      o.addEventListener("pointermove", move);
      o.addEventListener("pointerup", end);
      o.addEventListener("pointercancel", end);
      o.addEventListener("keydown", key);
      cleanups.push(() => {
        o.removeEventListener("pointerdown", down); o.removeEventListener("pointermove", move);
        o.removeEventListener("pointerup", end); o.removeEventListener("pointercancel", end); o.removeEventListener("keydown", key);
      });
    });

    timers.push(setTimeout(hideHint, 9000));

    return () => {
      dead = true; field.destroy(); clearTimeout(lt); timers.forEach(clearTimeout);
      removeEventListener("resize", onResize); cleanups.forEach((c) => c());
    };
  }, [open, hideHint]);

  const go = useCallback((n: string) => open(n), [open]);

  return (
    <div className="desk-root" ref={rootRef}>
      <canvas id="field" ref={cvRef} aria-hidden="true" />
      <div className="desk" ref={deskRef} aria-label="Radni sto agencije Promet Digital">
        <div className="print tl">PROMET DIGITAL<br /><b>agencija za sajtove i online prodavnice</b></div>
        <div className="print br">Zrenjanin <span className="live">{time}</span><br /><b>promet.digital</b></div>

        <div className="obj o-card" data-k="card" data-open="intro" tabIndex={0} role="button" aria-label="Otvori: o agenciji">
          <span className="shadow" />
          <div className="top"><span>PROMET DIGITAL</span><span>agencija · Zrenjanin</span></div>
          <h1><span>Sajtovi sa</span><br /><em><span>potpisom.</span></em></h1>
          <div className="bot"><span>Za svaku branšu drugi. Nikad šablon.</span><b>David</b></div>
          <span className="tag">o nama</span>
        </div>

        <div className="obj o-note" data-k="note" data-open="proces" tabIndex={0} role="button" aria-label="Otvori: proces">
          <span className="shadow" /><span className="ring" />
          1. kratak sastanak<br />2. nađemo <u>potpis</u><br />3. demo, besplatno<br />4. protokol, pa online<br /><s>šablon</s>
          <span className="tag">proces</span>
        </div>

        <div className="obj o-cass" data-k="cass" data-open="unearthed" tabIndex={0} role="button" aria-label="Otvori: Unearthed Samples">
          <span className="shadow" />
          <div className="lab"><b>UNEARTHED SAMPLES</b><i>vol. 1</i></div>
          <div className="win"><span className="reel" /><span className="reel" /></div>
          <span className="bot" />
          <span className="tag">Unearthed Samples</span>
        </div>

        <div className="obj o-menu" data-k="menu" data-open="bite" tabIndex={0} role="button" aria-label="Otvori: Bite Catering">
          <span className="shadow" />
          <b>BITE</b><small>catering · Zrenjanin</small>
          <p><span>mini burgeri</span><span>×</span></p><p><span>brusketi</span><span>×</span></p><p><span>tortilja rolnice</span><span>×</span></p><p><span>slatki zalogaji</span><span>×</span></p>
          <span className="x">koliko gostiju?</span>
          <span className="tag">Bite Catering</span>
        </div>

        <div className="obj o-proto" data-k="proto" data-open="standard" tabIndex={0} role="button" aria-label="Otvori: protokol provere">
          <span className="shadow" />
          <b>Protokol provere</b>Prüfprotokoll · br. 0247
          <div className="r" style={{ marginTop: 10 }}><span>Učitavanje</span><i>1,4 s</i></div>
          <div className="r"><span>Lighthouse</span><i>96</i></div>
          <div className="r"><span>Kontrast</span><i>AA</i></div>
          <div className="r"><span>Pravni tekstovi</span><i>3/3</i></div>
          <div className="r"><span>Backup</span><i>dnevno</i></div>
          <div className="r"><span>Domen klijenta</span><i>da</i></div>
          <span className="st">PROVERENO</span>
          <span className="tag">nemački standard</span>
        </div>

        <div className="obj o-plan" data-k="plan" data-open="sala" tabIndex={0} role="button" aria-label="Otvori: Adriaticum">
          <span className="shadow" /><span className="wall" /><span className="bina" />
          <span className="t" style={{ left: "24%", top: "42%" }} /><span className="t" style={{ left: "46%", top: "42%" }} /><span className="t" style={{ left: "68%", top: "42%" }} /><span className="t" style={{ left: "35%", top: "66%" }} /><span className="t" style={{ left: "57%", top: "66%" }} />
          <small>sala 18 × 12 m</small>
          <span className="tag">Adriaticum</span>
        </div>

        <div className="obj o-work" data-k="work" data-open="radovi" tabIndex={0} role="button" aria-label="Otvori: radovi">
          <div className="wc" /><div className="wc" />
          <div className="wc wc-shot">
            <span className="tabx">RADOVI · 3</span>
            <img src={SHOTS.sala.src} alt="" draggable={false} />
            <h3>Adriaticum</h3><p>Sistem za rezervacije opreme za događaje</p>
          </div>
          <span className="tag" style={{ bottom: -30 }}>radovi</span>
        </div>

        <div className="obj o-biz" data-k="biz" data-open="kontakt" tabIndex={0} role="button" aria-label="Otvori: kontakt">
          <span className="shadow" />
          <div className="l">
            <svg viewBox="-110 40 1550 1960" aria-hidden="true">
              <polygon points="420,560 507,1805 791,1504 1017,1941 1213,1842 996,1419 1370,1393" fill="#EDEEF0" stroke="#EDEEF0" strokeWidth="257" strokeLinejoin="round" />
              <polygon points="420,560 507,1805 791,1504 1017,1941 1213,1842 996,1419 1370,1393" fill="#3DDCFF" stroke="#3DDCFF" strokeWidth="70" strokeLinejoin="round" />
              <line x1="377" y1="314" x2="333" y2="68" stroke="#EDEEF0" strokeWidth="101" strokeLinecap="round" />
              <line x1="216" y1="417" x2="11" y2="274" stroke="#EDEEF0" strokeWidth="101" strokeLinecap="round" />
              <line x1="174" y1="603" x2="-72" y2="647" stroke="#EDEEF0" strokeWidth="101" strokeLinecap="round" />
            </svg>
            promet
          </div>
          <p><b>David Nedić</b><br />{CONTACT.phone}<br />{CONTACT.email}</p>
          <span className="tag">kontakt</span>
        </div>

        <div className="obj o-phone" data-k="phone" data-open="kontakt" tabIndex={0} role="button" aria-label="Otvori: poruka">
          <span className="shadow" />
          <div className="scr">
            <span className="who">Promet Digital</span>
            <div className="bub in">Zdravo! Imam pekaru u Zrenjaninu.</div>
            <div className="bub in">Treba mi sajt, ali da ne liči na sve ostale.</div>
            <div className="bub out">Može. Kad vam odgovara kratak sastanak?</div>
          </div>
          <span className="tag">piši nam</span>
        </div>

        <div className="obj o-sticky" data-k="sticky" data-open="paketi" tabIndex={0} role="button" aria-label="Otvori: paketi">
          <span className="shadow" />demo je<br />besplatan.<br />plaćaš tek<br />kad ti se svidi.
          <span className="tag">paketi</span>
        </div>

        <div className="obj o-pen" data-k="pen" aria-hidden="true">
          <svg viewBox="0 0 260 20"><rect x="0" y="4" width="200" height="12" rx="6" fill="#2B2F35" /><rect x="40" y="2" width="70" height="4" rx="2" fill="#8E959E" /><path d="M200 4 L246 10 L200 16 Z" fill="#C7CCD2" /><path d="M240 9.2 L258 10 L240 10.8 Z" fill="#1E3A8A" /></svg>
        </div>
      </div>

      <div className="hintbar" ref={hintRef}>pomeri stvari po stolu · klikni na predmet</div>
      <nav className="tabs" aria-label="Brzi pristup">
        {[["radovi", "Radovi", ""], ["paketi", "Paketi", ""], ["ja", "Ko sam ja", "me"], ["kontakt", "Kontakt", ""]].map(([k, label, cls]) => (
          <button key={k} type="button" className={cls || undefined} onClick={(e) => { hideHint(); open(k, e.currentTarget); }}>{label}</button>
        ))}
      </nav>
      <div className={"veil" + (on ? " on" : "")} onClick={close} />
      <div ref={sheetRef} className={"sheet" + (on ? " on" : "")} role="dialog" aria-modal="true" aria-labelledby="sheetTitle" aria-hidden={!on}>
        <button className="close" ref={closeRef} type="button" onClick={close}>vrati na sto ✕</button>
        <div>{name && <SheetBody key={name + seq} name={name} go={go} time={time} />}</div>
      </div>
    </div>
  );
}
