import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const PersistentBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const drift = interpolate(frame, [0, durationInFrames], [0, 360]);
  const drift2 = interpolate(frame, [0, durationInFrames], [0, -240]);

  return (
    <AbsoluteFill style={{ background: "#0a0d12", overflow: "hidden" }}>
      {/* Glow blob 1 */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "-20%",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,240,50,0.18) 0%, rgba(180,240,50,0) 60%)",
          transform: `translate(${Math.sin(drift * 0.017) * 60}px, ${Math.cos(drift * 0.013) * 80}px)`,
          filter: "blur(40px)",
        }}
      />
      {/* Glow blob 2 */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "-25%",
          width: 1100,
          height: 1100,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(80,160,255,0.12) 0%, rgba(80,160,255,0) 60%)",
          transform: `translate(${Math.cos(drift2 * 0.011) * 80}px, ${Math.sin(drift2 * 0.015) * 60}px)`,
          filter: "blur(40px)",
        }}
      />
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          opacity: 0.6,
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
