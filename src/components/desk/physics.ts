import Matter from "matter-js";

const { Engine, Bodies, Body, Composite } = Matter;
const STEP = 1000 / 60;
const ACCELERATION = .0011;
const MATERIALS: Record<string, [number, number]> = {
  lap: [3.2, .13], cup: [2.1, .10], phone: [1.5, .07],
  plant: [5, .18], lamp: [3.5, .15], phones: [1.1, .065], vase: [2.5, .12],
  sticky: [.12, .04], pen: [.2, .018], card: [.5, .055], cert: [.65, .08],
};
export function createDeskPhysics(desk: HTMLElement, paused: () => boolean) {
  const engine = Engine.create({ enableSleeping: true });
  engine.gravity.scale = 0;
  const entries = new Set<{ body: Matter.Body; update: (x: number, y: number, angle: number) => void }>();
  let gx = 0, gy = 0, active = false, frame = 0, last = 0, accumulator = 0, dead = false;
  const add = (key: string, x: number, y: number, width: number, height: number, angle: number, update: (x: number, y: number, angle: number) => void) => {
    const [mass, resistance] = MATERIALS[key] ?? [.7, .06];
    const options = { angle, frictionAir: resistance, friction: .35, restitution: .24, sleepThreshold: 45 };
    const body = key === "cup" || key === "plant" || key === "vase"
      ? Bodies.circle(x, y, Math.min(width, height) * .42, options)
      : Bodies.rectangle(x, y, width * .88, height * .88, options);
    Body.setMass(body, mass);
    const entry = { body, update }; entries.add(entry); Composite.add(engine.world, body);
    return {
      resize(width: number, height: number) { const bounds = body.bounds; Body.scale(body, width * .88 / (bounds.max.x - bounds.min.x), height * .88 / (bounds.max.y - bounds.min.y)); Body.setMass(body, mass); },
      move(x: number, y: number, angle: number) { Body.setPosition(body, { x, y }); Body.setAngle(body, angle); Body.setVelocity(body, { x: 0, y: 0 }); Body.setAngularVelocity(body, 0); },
      hold(held: boolean) { Body.setStatic(body, held); if (!held) Body.setMass(body, mass); },
      release(vx: number, vy: number) { active = true; Matter.Sleeping.set(body, false); Body.setVelocity(body, { x: Math.max(-18, Math.min(18, vx)), y: Math.max(-18, Math.min(18, vy)) }); },
      remove() { entries.delete(entry); Composite.remove(engine.world, body); },
    };
  };
  const loop = (now: number) => {
    if (dead) return;
    frame = requestAnimationFrame(loop);
    const dt = last ? Math.min(now - last, 50) : 0; last = now;
    if (!active || document.hidden || paused()) { accumulator = 0; return; }
    accumulator += dt;
    while (accumulator >= STEP) {
      for (const { body } of entries) {
        if (body.isStatic) continue;
        if (Math.hypot(gx, gy) < .04 && body.speed < .035 && Math.abs(body.angularVelocity) < .001) {
          Body.setVelocity(body, { x: 0, y: 0 }); Body.setAngularVelocity(body, 0); Matter.Sleeping.set(body, true);
        }
        const threshold = body.frictionAir * .55;
        if (Math.hypot(gx, gy) > threshold) {
          Matter.Sleeping.set(body, false);
          Body.applyForce(body, body.position, { x: gx * body.mass * ACCELERATION, y: gy * body.mass * ACCELERATION });
        }
      }
      Engine.update(engine, STEP);
      for (const { body } of entries) {
        if (body.isStatic) continue;
        const x = Math.max(0, Math.min(desk.clientWidth, body.position.x));
        const y = Math.max(0, Math.min(desk.clientHeight, body.position.y));
        if (x !== body.position.x || y !== body.position.y) {
          const vx = body.velocity.x, vy = body.velocity.y;
          const hitX = x !== body.position.x, hitY = y !== body.position.y;
          Body.setPosition(body, { x, y });
          Body.setVelocity(body, { x: hitX ? -vx * .25 : vx, y: hitY ? -vy * .25 : vy });
        }
      }
      accumulator -= STEP;
    }
    for (const { body, update } of entries) update(Math.round(body.position.x * 100) / 100, Math.round(body.position.y * 100) / 100, Math.round(body.angle * 10000) / 10000);
  };
  frame = requestAnimationFrame(loop);
  return {
    add,
    tilt(x: number, y: number) { gx = x; gy = y; if (Math.hypot(x, y) > .04) active = true; },
    destroy() { dead = true; cancelAnimationFrame(frame); entries.clear(); Composite.clear(engine.world, false); Engine.clear(engine); },
  };
}
export type DeskPhysics = ReturnType<typeof createDeskPhysics>;