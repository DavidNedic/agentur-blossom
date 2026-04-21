import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 1: Frantic client rant — lines stack with shake
export const SceneRant: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lines = [
    { t: "Moj sajt iz 2014.", c: "#fff", tag: "RIP" },
    { t: "Konkurencija pumpa.", c: "#fff", tag: "↑↑↑" },
    { t: "A ti čekaš 3 meseca?!", c: "#ff5070", tag: "?!" },
  ];

  const shakeX = Math.sin(frame * 0.7) * 3 + Math.sin(frame * 1.3) * 2;
  const shakeY = Math.cos(frame * 0.9) * 3;

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "180px 70px",
        justifyContent: "center",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          alignItems: "center",
          gap: 12,
          padding: "10px 18px",
          background: "rgba(255,80,112,0.15)",
          border: "2px solid rgba(255,80,112,0.5)",
          borderRadius: 999,
          fontSize: 30,
          color: "#ff5070",
          letterSpacing: 4,
          fontWeight: 800,
          marginBottom: 50,
          opacity: spring({ frame, fps, config: { damping: 12 } }),
          textShadow: "0 0 30px rgba(255,80,112,0.6)",
        }}
      >
        POV: TI 2026
      </div>

      {lines.map((l, i) => {
        const delay = 6 + i * 18;
        const p = spring({ frame: frame - delay, fps, config: { damping: 10, stiffness: 220 } });
        const rot = interpolate(p, [0, 1], [-8, i % 2 === 0 ? -1.5 : 1.5]);
        const scale = interpolate(p, [0, 1], [0.5, 1]);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
              marginBottom: 30,
              opacity: p,
              transform: `rotate(${rot}deg) scale(${scale})`,
              transformOrigin: "left center",
            }}
          >
            <div
              style={{
                fontSize: 78,
                fontWeight: 800,
                color: l.c,
                letterSpacing: -2,
                lineHeight: 1.05,
                background: i === 2 ? "rgba(255,80,112,0.15)" : "transparent",
                padding: i === 2 ? "8px 20px" : 0,
                borderRadius: 16,
                border: i === 2 ? "2px solid rgba(255,80,112,0.5)" : "none",
              }}
            >
              {l.t}
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: "#ff5070",
                background: "rgba(255,80,112,0.12)",
                padding: "6px 14px",
                borderRadius: 10,
                border: "1px solid rgba(255,80,112,0.4)",
                letterSpacing: 1,
              }}
            >
              {l.tag}
            </div>
          </div>
        );
      })}

      {/* Big "X" sweat-mark in corner */}
      <div
        style={{
          position: "absolute",
          top: 220,
          right: 60,
          fontSize: 200,
          color: "#ff5070",
          opacity: spring({ frame: frame - 60, fps, config: { damping: 8 } }) * 0.4,
          fontWeight: 800,
          transform: `rotate(${interpolate(spring({ frame: frame - 60, fps }), [0, 1], [-45, -20])}deg)`,
          textShadow: "0 0 60px rgba(255,80,112,0.6)",
        }}
      >
        ✕
      </div>
    </AbsoluteFill>
  );
};
