import { useCallback, useEffect, useRef, useState } from "react";
import { CONTACT } from "@/lib/i18n";
import { createOffice } from "./office";
import { SheetBody, SHOTS } from "./Sheets";

type S = { x: number; y: number; r: number; vx: number; vy: number; tilt?: number };

const L: Record<string, [number, number, number]> = {
  card: [0.43, 0.42, -2], cup: [0.1, 0.38, 0], lap: [0.14, 0.68, -4], cal: [0.4, 0.8, -6], sys: [0.58, 0.79, 4], cert: [0.5, 0.12, -3],
  score: [0.7, 0.2, 4], fold: [0.73, 0.56, -4], phone: [0.89, 0.3, 8], work: [0.87, 0.76, 3], biz: [0.13, 0.17, -7], sticky: [0.24, 0.88, -5], pen: [0.3, 0.07, 18],
};
const Lm: Record<string, [number, number, number]> = {
  card: [0.5, 0.07, -2], cert: [0.32, 0.2, -3], phone: [0.76, 0.21, 8], lap: [0.34, 0.36, -3], cup: [0.82, 0.47, 0], cal: [0.72, 0.36, -5], fold: [0.4, 0.5, -3],
  score: [0.66, 0.585, 4], sys: [0.3, 0.67, -3], work: [0.68, 0.775, 3], sticky: [0.28, 0.8, -8], biz: [0.5, 0.9, -6], pen: [0.62, 0.97, 18],
};

type Site = { n: string; img?: string; h?: string; bg?: string; fg?: string; hero?: string; hfg?: string; acc?: string; card?: string; f?: string; w?: string };
const SITES: Site[] = [
  { n: "ADRIATICUM", img: SHOTS.sala.src }, { n: "BITE CATERING", img: SHOTS.bite.src }, { n: "UNEARTHED", img: SHOTS.unearthed.src },
  { n: "TVOJA FIRMA", h: "Sledeći je tvoj sajt", bg: "#FFF8EC", fg: "#5A3A1A", hero: "#F3E1C2", hfg: "#4A2E12", acc: "#C8672B", card: "#EED9B8", f: "", w: "800" },
];

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
    const field = createOffice(cvRef.current!, desk);
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

    // calendar
    const cg = desk.querySelector<HTMLElement>(".o-cal .grid")!;
    const runCal = () => {
      const ds = [...cg.children] as HTMLElement[];
      ds.forEach((d) => d.classList.remove("x", "live"));
      ds.forEach((d, i) => timers.push(setTimeout(() => d.classList.add(i < 13 ? "x" : "live"), reduce ? 0 : i * 140)));
    };
    // laptop cycle
    const lapv = desk.querySelector<HTMLElement>(".o-lap .view")!, lapph = lapv.querySelector<HTMLElement>(".ph")!, lapsc = lapv.querySelector<HTMLElement>(".scan")!;
    const lapl = desk.querySelector<HTMLElement>(".o-lap .lbl")!, lapn = lapv.querySelector<HTMLElement>(".nv b")!, laph = lapv.querySelector<HTMLElement>(".hr b")!;
    const mockParts = ([...lapv.children] as HTMLElement[]).filter((e) => e !== lapph && e !== lapsc);
    let si = 0;
    const buildSite = () => {
      const x = SITES[si++ % SITES.length];
      mockParts.forEach((p) => p.classList.remove("on")); lapph.classList.remove("on"); lapsc.classList.remove("go");
      timers.push(setTimeout(() => {
        if (dead) return;
        lapl.textContent = "u izradi: " + x.n.toLowerCase();
        if (x.img) { lapph.style.backgroundImage = "url(" + x.img + ")"; void lapsc.offsetWidth; lapsc.classList.add("go"); lapph.classList.add("on"); return; }
        const v = (k: string, val: string) => lapv.style.setProperty(k, val);
        v("--vbg", x.bg!); v("--vfg", x.fg!); v("--vhero", x.hero!); v("--vhfg", x.hfg!); v("--vacc", x.acc!); v("--vcard", x.card!); v("--vf", x.f || "var(--display)"); v("--vw", x.w!);
        lapn.textContent = x.n; laph.textContent = x.h!;
        mockParts.forEach((p, k) => timers.push(setTimeout(() => p.classList.add("on"), reduce ? 0 : k * 260)));
      }, reduce ? 0 : 450));
    };
    const introEnd = reduce ? 0 : 200 + objs.length * 110 + 1300;
    let siteInt: ReturnType<typeof setInterval> | undefined;
    timers.push(setTimeout(runCal, introEnd * 0.6));
    timers.push(setTimeout(() => { buildSite(); siteInt = setInterval(buildSite, 4200); }, introEnd * 0.5));
    const bars = [...desk.querySelectorAll<HTMLElement>(".o-sys .bars i")];
    const stock = () => bars.forEach((b) => { const v = 15 + Math.random() * 85; b.style.height = v + "%"; b.classList.toggle("low", v < 28); });
    stock();
    const stockInt = setInterval(stock, 2200);

    return () => {
      dead = true; field.destroy(); clearInterval(siteInt); clearInterval(stockInt); clearTimeout(lt); timers.forEach(clearTimeout);
      removeEventListener("resize", onResize); cleanups.forEach((c) => c());
    };
  }, [open, hideHint]);

  const go = useCallback((n: string) => open(n), [open]);

  return (
    <div className="desk-root" ref={rootRef}>
      <canvas id="field" ref={cvRef} aria-hidden="true" />
      <div className="desk" ref={deskRef} aria-label="Radni sto agencije Promet Digital">
        <div className="print tl">PROMET DIGITAL<br /><b>sajtovi, prodavnice, sistemi</b></div>
        <div className="print br">Zrenjanin <span className="live">{time}</span><br /><b>promet.digital</b></div>

        <div className="obj o-card" data-k="card" data-open="intro" tabIndex={0} role="button" aria-label="Otvori: o agenciji">
          <span className="shadow" />
          <div className="top"><span>PROMET DIGITAL</span><span>Zrenjanin / Beograd</span></div>
          <h1><span>Hajde na</span><br /><em><span>sastanak.</span></em></h1>
          <div className="bot"><span>Prvo pričamo o tvom poslu i ciljevima.<br />Onda pravimo sajt.</span><b>David Nedić</b></div>
          <span className="tag">o nama</span>
        </div>

        <div className="obj o-lap" data-k="lap" data-open="nacin" tabIndex={0} role="button" aria-label="Otvori: kako radimo">
          <span className="lbl">u izradi</span>
          <div className="scr"><div className="view v"><div className="nv"><b>FIRMA</b><i /></div><div className="hr"><b>Naslov</b></div><div className="cta" /><div className="cr"><i /><i /><i /></div><div className="ph" /><span className="scan" /></div></div>
          <div className="deck" />
          <span className="tag">kako radimo</span>
        </div>

        <div className="obj o-cup" data-k="cup" data-open="sastanak" tabIndex={0} role="button" aria-label="Otvori: sastanak">
          <span className="shadow" /><span className="sp" /><span className="c" /><span className="h" />
          <span className="tag" style={{ left: "12%" }}>sastanak</span>
        </div>

        <div className="obj o-cal" data-k="cal" data-open="dani" tabIndex={0} role="button" aria-label="Otvori: live za 14 dana">
          <span className="shadow" />
          <div className="bind">14 DANA</div>
          <div className="grid">
            {Array.from({ length: 14 }, (_, i) => (
              <div className="d" key={i}>{i + 1}<svg viewBox="0 0 20 20"><path d="M3 3 L17 17 M17 3 L3 17" /></svg></div>
            ))}
          </div>
          <div className="foot">i online je.<small>od sastanka do lansiranja</small></div>
          <span className="tag">proces</span>
        </div>

        <div className="obj o-fold" data-k="fold" data-open="usluge" tabIndex={0} role="button" aria-label="Otvori: usluge">
          <div className="f"><i>SEO</i></div><div className="f"><i>Kamere</i></div><div className="f"><i>Kasa</i></div><div className="f"><i>Magacin</i></div>
          <div className="f"><i>Sajtovi</i><h3>Usluge</h3><p>Sajtovi, prodavnice, sistemi za magacin, kasu i kamere.</p></div>
          <span className="tag">usluge</span>
        </div>

        <div className="obj o-cert" data-k="cert" data-open="ja" tabIndex={0} role="button" aria-label="Otvori: ko sam ja">
          <span className="shadow" />
          <div className="in"><div className="flag" /><small>STRUČNO ZVANJE, NEMAČKA</small><b>Kaufmann für<br />E-Commerce</b><small>IHK, DE / RS</small><div className="sig">DAVID NEDIĆ</div></div>
          <span className="tag">nemački standard</span>
        </div>

        <div className="obj o-score" data-k="score" data-open="poredjenje" tabIndex={0} role="button" aria-label="Otvori: poređenje">
          <span className="shadow" />
          <div className="h"><span>&nbsp;</span><span>obično</span><span>kod nas</span></div>
          {[["dizajn", "šablon", "po meri"], ["prvi korak", "ponuda", "sastanak"], ["isporuka", "6+ ned.", "14 d."], ["sagovornik", "3+", "1"], ["kod i domen", "?", "tvoje"]].map(([a, b, c]) => (
            <div className="r" key={a}><span>{a}</span><span className="no">{b}</span><span className="ok">{c}</span></div>
          ))}
          <span className="tag">poređenje</span>
        </div>

        <div className="obj o-sys" data-k="sys" data-open="sistemi" tabIndex={0} role="button" aria-label="Otvori: sistemi po meri">
          <span className="shadow" />
          <div className="head">SISTEMI PO MERI</div>
          <div className="row"><span>MAGACIN</span><span className="bars"><i /><i /><i /><i /><i /><i /></span></div>
          <div className="row"><span>KASA</span><span className="on">povezano</span></div>
          <div className="row"><span>KAMERE</span><span className="on">brojanje</span></div>
          <div className="row"><span>REZERVACIJE</span><span className="on">online</span></div>
          <span className="tag">sistemi</span>
        </div>

        <div className="obj o-work" data-k="work" data-open="radovi" tabIndex={0} role="button" aria-label="Otvori: radovi">
          <div className="wc" /><div className="wc" />
          <div className="wc wc-shot">
            <span className="tabx">RADOVI 3</span>
            <img src={SHOTS.sala.src} alt="" draggable={false} />
            <h3>Adriaticum</h3><p>Booking platforma za opremu</p>
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
            <div className="bub in">Zdravo, treba mi sajt za moju firmu.</div>
            <div className="bub out">Hajde na sastanak. Ispričaj nam šta radiš i šta želiš da postigneš.</div>
            <div className="bub in">Može sutra u 10?</div>
            <div className="bub out">Vidimo se.</div>
          </div>
          <span className="tag">piši nam</span>
        </div>

        <div className="obj o-sticky" data-k="sticky" data-open="sastanak" tabIndex={0} role="button" aria-label="Otvori: sastanak">
          <span className="shadow" /><b>Prvi sastanak je besplatan.</b><small>cena po dogovoru, bez obaveze</small>
          <span className="tag">sastanak</span>
        </div>

        <div className="obj o-pen" data-k="pen" aria-hidden="true">
          <svg viewBox="0 0 260 20"><rect x="0" y="4" width="200" height="12" rx="6" fill="#2B2F35" /><rect x="40" y="2" width="70" height="4" rx="2" fill="#8E959E" /><path d="M200 4 L246 10 L200 16 Z" fill="#C7CCD2" /><path d="M240 9.2 L258 10 L240 10.8 Z" fill="#1E3A8A" /></svg>
        </div>
      </div>

      <div className="hintbar" ref={hintRef}>pomeri stvari po stolu, klikni na predmet</div>
      <nav className="tabs" aria-label="Brzi pristup">
        {[["radovi", "Radovi", ""], ["usluge", "Usluge", ""], ["sistemi", "Sistemi", ""], ["ja", "Ko sam ja", "me"], ["kontakt", "Kontakt", ""]].map(([k, label, cls]) => (
          <button key={k} type="button" className={cls || undefined} onClick={(e) => { hideHint(); open(k, e.currentTarget); }}>{label}</button>
        ))}
      </nav>
      <div className={"veil" + (on ? " on" : "")} onClick={close} />
      <div ref={sheetRef} className={"sheet" + (on ? " on" : "")} role="dialog" aria-modal="true" aria-labelledby="sheetTitle" aria-hidden={!on}>
        <button className="close" ref={closeRef} type="button" onClick={close}>vrati na sto ✕</button>
        <div>{name && <SheetBody key={name + seq} name={name} go={go} time={time} active={on} />}</div>
      </div>
    </div>
  );
}
