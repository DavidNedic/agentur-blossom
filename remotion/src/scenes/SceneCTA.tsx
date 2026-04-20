import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../components/theme";

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t1 = spring({ frame, fps, config: { damping: 16, stiffness: 180 } });
  const t2 = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 200 } });
  const sub = spring({ frame: frame - 24, fps, config: { damping: 18, stiffness: 160 } });
  const btn = spring({ frame: frame - 36, fps, config: { damping: 10, stiffness: 220 } });
  const url = spring({ frame: frame - 54, fps, config: { damping: 22, stiffness: 140 } });

  const arrowShift = Math.sin(frame * 0.2) * 12;
  const btnPulse = 1 + Math.sin(frame * 0.15) * 0.04;
  const ringScale = 1 + ((frame * 0.025) % 0.5);
  const ringOpacity = 1 - ((frame * 0.05) % 1);

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "180px 80px",
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
          marginBottom: 24,
          transform: `translateY(${interpolate(t1, [0, 1], [-20, 0])}px)`,
        }}
      >
        BESPLATNA KONSULTACIJA
      </div>

      <div
        style={{
          fontSize: 130,
          fontWeight: 800,
          color: COLORS.text,
          letterSpacing: -3,
          lineHeight: 1.0,
          opacity: t2,
          transform: `translateY(${interpolate(t2, [0, 1], [50, 0])}px) scale(${interpolate(t2, [0, 1], [0.85, 1])})`,
          marginBottom: 20,
        }}
      >
        Spreman si?
      </div>
      <div
        style={{
          fontSize: 36,
          color: COLORS.muted,
          fontWeight: 500,
          opacity: sub,
          maxWidth: 800,
          marginBottom: 60,
        }}
      >
        Javimo se u roku od 24h.
      </div>

      {/* Button with pulsing ring */}
      <div style={{ position: "relative", display: "inline-flex" }}>
        {/* Pulsing ring */}
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: 999,
            border: `3px solid ${COLORS.accent}`,
            transform: `scale(${ringScale})`,
            opacity: ringOpacity * btn,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
            background: COLORS.accent,
            color: "#0a0d12",
            padding: "30px 52px",
            borderRadius: 999,
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: -0.5,
            opacity: btn,
            transform: `scale(${interpolate(btn, [0, 1], [0.5, btnPulse])})`,
            boxShadow: `0 30px 80px rgba(180,240,50,0.6), 0 0 60px rgba(180,240,50,0.4)`,
          }}
        >
          Zakaži konsultaciju
          <span style={{ transform: `translateX(${arrowShift}px)`, fontSize: 46 }}>→</span>
        </div>
      </div>

      <div
        style={{
          marginTop: 70,
          fontSize: 42,
          color: COLORS.text,
          fontWeight: 800,
          opacity: url,
          letterSpacing: 1,
          textShadow: `0 0 30px rgba(180,240,50,0.5)`,
        }}
      >
        radenon-digital.com
      </div>
    </AbsoluteFill>
  );
};
