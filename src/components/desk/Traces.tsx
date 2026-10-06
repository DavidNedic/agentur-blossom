// Decorative "traces of use" for the desk: coffee rings, tape, folded corners,
// paperclips and pencil marks. Every element is aria-hidden and pointer-events:none.
// Colors, sizes and positions live in desk.css.

type P = { className?: string };

export function Ring({ className = "" }: P) {
  return (
    <svg className={"tr tr-ring " + className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path className="r1" d="M50 9C72 8 91 27 91 49 91 72 73 91 50 91 27 91 9 72 9 50 9 28 28 10 50 9Z" />
      <path className="r2" d="M50 15C69 14 86 30 86 50 86 71 70 86 50 86 30 86 14 70 15 50 15 31 31 16 50 15Z" />
      <circle className="r3" cx="74" cy="90" r="2.6" />
      <circle className="r3" cx="88" cy="70" r="1.5" />
      <circle className="r3" cx="12" cy="66" r="1.9" />
    </svg>
  );
}

export function Tape({ className = "" }: P) {
  return (
    <svg className={"tr tr-tape " + className} viewBox="0 0 120 34" aria-hidden="true" focusable="false">
      <path className="t1" d="M5 4L115 2 112 9 116 16 112 23 115 30 6 32 9 25 4 18 8 11Z" />
      <path className="t2" d="M13 3.5L13.8 31.5M107 2.6L107.8 30.6" />
    </svg>
  );
}

export function Fold({ className = "" }: P) {
  return (
    <svg className={"tr tr-fold " + className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <polygon className="f4" points="40,8 8,40 3,35" />
      <polygon className="f1" points="40,8 8,40 40,40" />
      <path className="f2" d="M40 8L8 40" />
    </svg>
  );
}

export function Clip({ className = "" }: P) {
  return (
    <svg className={"tr tr-clip " + className} viewBox="0 0 40 64" aria-hidden="true" focusable="false">
      <path className="c1" d="M8 10L8 52A12 12 0 0 0 32 52L32 10" />
      <path className="c2" d="M14 4L14 46A6 6 0 0 0 26 46L26 4" />
    </svg>
  );
}

const PEN: Record<string, [string, string]> = {
  tick: ["0 0 28 24", "M3 13L9 20 23 2"],
  circle: ["0 0 96 46", "M14 9C34 2 70 4 82 13 94 22 88 34 62 39 34 44 8 39 5 28 2 17 20 7 40 7"],
  scribble: ["0 0 34 30", "M3 15L21 5M7 22L27 11M14 27L31 18"],
  note: ["0 0 20 42", "M5 3C11 9 3 15 10 21 16 26 8 32 14 38"],
  arrow: ["0 0 40 26", "M2 7C14 2 27 6 35 17M35 17L26 15M35 17L31 23"],
};

export function Pencil({ className = "", kind = "tick" }: P & { kind?: string }) {
  const v = PEN[kind] || PEN.tick;
  return (
    <svg className={"tr tr-pen tr-pen-" + kind + " " + className} viewBox={v[0]} aria-hidden="true" focusable="false">
      <path d={v[1]} />
    </svg>
  );
}

export function Smudge({ className = "" }: P) {
  return (
    <svg className={"tr tr-smudge " + className} viewBox="0 0 90 40" aria-hidden="true" focusable="false">
      <path className="s1" d="M6 30C22 22 44 14 84 8" />
      <path className="s2" d="M14 36C30 30 52 22 86 16" />
    </svg>
  );
}

export function DeskTraces() {
  return (
    <div className="tr-desk" aria-hidden="true">
      <Ring className="wet" />
      <Ring className="dry-a" />
      <Ring className="dry-b" />
      <Ring className="dry-c" />
      <Pencil kind="scribble" className="pens" />
      <Pencil kind="note" className="marg" />
      <Tape className="scrap" />
    </div>
  );
}
