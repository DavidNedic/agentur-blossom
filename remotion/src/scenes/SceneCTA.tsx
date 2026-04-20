import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../components/theme";

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t1 = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });
  const t2 = spring({ frame: frame - 14, fps, config: { damping: 18, stiffness: 160 } });
  const btn = spring({ frame: frame - 36, fps, config: { damping: 14, stiffness: 200 } });
  const url = spring({ frame: frame - 60, fps, config: { damping: 22, stiffness: 140 } });

  const arrowShift = Math.sin(frame * 0.15) * 8;
  const btnPulse = 1 + Math.sin(frame * 0.12) * 0.025;

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "200px 80px",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 30,
          color: COLORS.accent,
          letterSpacing: 4,
          fontWeight: 700,
          opacity: t1,
          marginBottom: 30,
        }}
      >
        BESPLATNA KONSULTACIJA
      </div>

      <div
        style={{
          fontSize: 110,
          fontWeight: 800,
          color: COLORS.text,
          letterSpacing: -3,
          lineHeight: 1.0,
          opacity: t2,
          transform: `translateY(${interpolate(t2, [0, 1], [40, 0])}px)`,
          marginBottom: 24,
        }}
      >
        Spreman si?
      </div>
      <div
        style={{
          fontSize: 38,
          color: COLORS.muted,
          fontWeight: 500,
          opacity: t2,
          maxWidth: 800,
          marginBottom: 70,
        }}
      >
        Javimo se u roku od 24h.
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 20,
          background: COLORS.accent,
          color: "#0a0d12",
          padding: "32px 56px",
          borderRadius: 999,
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: -0.5,
          opacity: btn,
          transform: `scale(${interpolate(btn, [0, 1], [0.7, btnPulse])})`,
          boxShadow: `0 25px 80px rgba(180,240,50,0.5)`,
        }}
      >
        Zakaži konsultaciju
        <span style={{ transform: `translateX(${arrowShift}px)`, fontSize: 48 }}>→</span>
      </div>

      <div
        style={{
          marginTop: 80,
          fontSize: 36,
          color: COLORS.text,
          fontWeight: 700,
          opacity: url,
          letterSpacing: 1,
        }}
      >
        radenon-digital.rs
      </div>
    </AbsoluteFill>
  );
};
