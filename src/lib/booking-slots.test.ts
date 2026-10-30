import { describe, expect, it } from "vitest";
import { computeSlots, zonedToUtc } from "./booking-slots";

const rules = [1, 2, 3, 4, 5].map((weekday) => ({ weekday, start_time: "10:00", end_time: "17:00" }));
// Monday 2 Nov 2026, 08:00 Belgrade
const now = zonedToUtc("2026-11-02", "08:00");
const at = (d: string, t: string) => zonedToUtc(d, t);
const onDay = (s: number[], d: string) => s.filter((x) => x >= at(d, "00:00") && x < at(d, "23:59"));

describe("booking slots", () => {
  const base = computeSlots({ now, rules, blocked: [], busy: [], bookings: [] });

  it("Mon-Fri 10:00-17:00, 30 min slots; no weekends", () => {
    const tue = onDay(base, "2026-11-03");
    expect(tue[0]).toBe(at("2026-11-03", "10:00"));
    expect(tue.at(-1)).toBe(at("2026-11-03", "16:30"));
    expect(onDay(base, "2026-11-07")).toHaveLength(0);
  });

  it("requires 12 hours notice", () => {
    expect(onDay(base, "2026-11-02")).toHaveLength(0); // 08:00 + 12h = 20:00
  });

  it("keeps a 15 minute buffer around a booking", () => {
    const s = computeSlots({ now, rules, blocked: [], busy: [], bookings: [at("2026-11-03", "11:00")] });
    const tue = onDay(s, "2026-11-03");
    expect(tue).not.toContain(at("2026-11-03", "10:30"));
    expect(tue).not.toContain(at("2026-11-03", "11:30"));
    expect(tue).toContain(at("2026-11-03", "12:00"));
  });

  it("max 4 meetings per day", () => {
    const b = ["10:00", "11:00", "12:00", "13:00"].map((t) => at("2026-11-03", t));
    expect(onDay(computeSlots({ now, rules, blocked: [], busy: [], bookings: b }), "2026-11-03")).toHaveLength(0);
  });

  it("blocked dates and calendar busy times remove slots", () => {
    const s = computeSlots({ now, rules, blocked: ["2026-11-04"], busy: [{ start: at("2026-11-05", "10:00"), end: at("2026-11-05", "15:00") }], bookings: [] });
    expect(onDay(s, "2026-11-04")).toHaveLength(0);
    expect(onDay(s, "2026-11-05")[0]).toBe(at("2026-11-05", "15:30"));
  });
});
