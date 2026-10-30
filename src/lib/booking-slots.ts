// Pure slot logic, shared by server and tests. No server-only imports here.
export const BASE_TZ = "Europe/Belgrade";
export const SLOT_MIN = 30;
export const BUFFER_MIN = 15;
export const NOTICE_HOURS = 12;
export const MAX_PER_DAY = 4;
export const DAYS_AHEAD = 21;
const STEP_MIN = 30;
const MIN = 60_000;

export type Rule = { weekday: number; start_time: string; end_time: string };
export type Interval = { start: number; end: number };

function parts(ms: number, tz: string) {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(ms));
  const g = (t: string) => Number(p.find((x) => x.type === t)!.value);
  return { y: g("year"), m: g("month"), d: g("day"), h: g("hour"), mi: g("minute"), s: g("second") };
}

export function tzOffsetMs(ms: number, tz: string) {
  const p = parts(ms, tz);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) - Math.floor(ms / 1000) * 1000;
}

/** Wall-clock date + time in tz -> UTC ms. */
export function zonedToUtc(date: string, time: string, tz = BASE_TZ) {
  const [y, m, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const o1 = tzOffsetMs(guess, tz);
  let t = guess - o1;
  const o2 = tzOffsetMs(t, tz);
  if (o2 !== o1) t = guess - o2;
  return t;
}

export function dateInTz(ms: number, tz = BASE_TZ) {
  const p = parts(ms, tz);
  return `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`;
}

function addDays(date: string, n: number) {
  const [y, m, d] = date.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return { date: t.toISOString().slice(0, 10), weekday: t.getUTCDay() };
}

export function computeSlots(opts: {
  now: number;
  rules: Rule[];
  blocked: string[];
  busy: Interval[];
  bookings: number[]; // confirmed booking start times (ms)
}): number[] {
  const { now, rules, busy } = opts;
  const blocked = new Set(opts.blocked);
  const booked: Interval[] = opts.bookings.map((s) => ({ start: s, end: s + SLOT_MIN * MIN }));
  const allBusy = [...busy, ...booked];
  const perDay = new Map<string, number>();
  for (const s of opts.bookings) {
    const k = dateInTz(s);
    perDay.set(k, (perDay.get(k) ?? 0) + 1);
  }
  const earliest = now + NOTICE_HOURS * 60 * MIN;
  const today = dateInTz(now);
  const out: number[] = [];
  for (let i = 0; i <= DAYS_AHEAD; i++) {
    const { date, weekday } = addDays(today, i);
    if (blocked.has(date)) continue;
    const count = perDay.get(date) ?? 0;
    if (count >= MAX_PER_DAY) continue;
    const dayRules = rules.filter((r) => r.weekday === weekday);
    const daySlots: number[] = [];
    for (const r of dayRules) {
      const from = zonedToUtc(date, r.start_time);
      const to = zonedToUtc(date, r.end_time);
      for (let s = from; s + SLOT_MIN * MIN <= to; s += STEP_MIN * MIN) {
        if (s < earliest) continue;
        const e = s + SLOT_MIN * MIN;
        const clash = allBusy.some((b) => s < b.end + BUFFER_MIN * MIN && e > b.start - BUFFER_MIN * MIN);
        if (!clash) daySlots.push(s);
      }
    }
    out.push(...Array.from(new Set(daySlots)).sort((a, b) => a - b));
  }
  return out;
}
