import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const drift = interpolate(frame, [0, durationInFrames], [0, 720]);
  const drift2 = interpolate(frame, [0, durationInFrames], [0, -480]);
  const scan = (frame * 6) % 2200 - 200;

  // Deterministic particles
  const particles = Array.from({ length: 22 }, (_, i) => {
    const seed = i * 137.5;
    const x = (seed * 31 + 17) % 1080;
    const y = (seed * 53 + 41) % 1920;
    const speed = 0.3 + ((i * 7) % 10) / 18;
    const size = 2 + ((i * 13) % 6);
    const driftY = (frame * speed * 8) % 1920;
    const yPos = (y - driftY + 1920) % 1920;
    const opacity = 0.15 + Math.sin(frame * 0.05 + i) * 0.15;
    return { x, y: yPos, size, opacity, i };
  });

  return (
    <AbsoluteFill style={{ background: "#0a0d12", overflow: "hidden" }}>
      {/* Animated gradient sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(${135 + Math.sin(drift * 0.01) * 15}deg, #0a0d12 0%, #0d1422 50%, #0a0d12 100%)`,
        }}
      />
      {/* Glow blob 1 */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "-20%",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(180,240,50,0.28) 0%, rgba(180,240,50,0) 60%)",
          transform: `translate(${Math.sin(drift * 0.02) * 120}px, ${Math.cos(drift * 0.015) * 140}px)`,
          filter: "blur(50px)",
        }}
      />
      {/* Glow blob 2 */}
      <div
        style={{
          position: "absolute",
          bottom: "0%",
          right: "-25%",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(80,160,255,0.18) 0%, rgba(80,160,255,0) 60%)",
          transform: `translate(${Math.cos(drift2 * 0.013) * 140}px, ${Math.sin(drift2 * 0.018) * 120}px)`,
          filter: "blur(50px)",
        }}
      />
      {/* Glow blob 3 - magenta accent */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "30%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,80,180,0.10) 0%, rgba(255,80,180,0) 60%)",
          transform: `translate(${Math.sin(drift * 0.025) * 200}px, ${Math.cos(drift * 0.02) * 160}px)`,
          filter: "blur(60px)",
        }}
      />
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(180,240,50,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(180,240,50,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.8,
          transform: `translateY(${(frame * 0.5) % 80}px)`,
        }}
      />
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.i}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#b4f032",
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px #b4f032`,
          }}
        />
      ))}
      {/* Scanning beam */}
      <div
        style={{
          position: "absolute",
          top: scan,
          left: 0,
          right: 0,
          height: 200,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(180,240,50,0.06) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
