import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 6: Closing offer + URL
export const SceneOffer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t1 = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const t2 = spring({ frame: frame - 12, fps, config: { damping: 12, stiffness: 200 } });
  const t3 = spring({ frame: frame - 28, fps, config: { damping: 16 } });
  const btn = spring({ frame: frame - 42, fps, config: { damping: 9, stiffness: 220 } });
  const url = spring({ frame: frame - 60, fps, config: { damping: 22 } });

  const arrow = Math.sin(frame * 0.2) * 12;
  const btnPulse = 1 + Math.sin(frame * 0.18) * 0.04;
  const ringScale = 1 + ((frame * 0.025) % 0.5);
  const ringOpacity = 1 - ((frame * 0.05) % 1);

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "180px 70px",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 32,
          color: COLORS.accent,
          letterSpacing: 5,
          fontWeight: 800,
          opacity: t1,
          marginBottom: 18,
          transform: `translateY(${interpolate(t1, [0, 1], [-20, 0])}px)`,
        }}
      >
        SAMO OVAJ MESEC
      </div>

      <div
        style={{
          fontSize: 110,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: -3,
          lineHeight: 1.0,
          opacity: t2,
          transform: `scale(${interpolate(t2, [0, 1], [0.7, 1])})`,
          marginBottom: 8,
        }}
      >
        Sajt već od 48h.
      </div>
      <div
        style={{
          fontSize: 110,
          fontWeight: 800,
          color: COLORS.accent,
          letterSpacing: -3,
          lineHeight: 1.0,
          opacity: t3,
          transform: `scale(${interpolate(t3, [0, 1], [0.7, 1])})`,
          textShadow: "0 0 50px rgba(180,240,50,0.6)",
          marginBottom: 36,
        }}
      >
        Od 199 €.
      </div>

      <div
        style={{
          fontSize: 32,
          color: COLORS.muted,
          opacity: t3,
          maxWidth: 800,
          marginBottom: 50,
        }}
      >
        Bez avansa. Plaćaš tek kad je sajt live.
      </div>

      <div style={{ position: "relative", display: "inline-flex" }}>
        <div
          style={{
            position: "absolute",
            inset: -18,
            borderRadius: 999,
            border: `3px solid ${COLORS.accent}`,
            transform: `scale(${ringScale})`,
            opacity: ringOpacity * btn,
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 18,
            background: COLORS.accent,
            color: "#0a0d12",
            padding: "28px 48px",
            borderRadius: 999,
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: -0.5,
            opacity: btn,
            transform: `scale(${interpolate(btn, [0, 1], [0.4, btnPulse])})`,
            boxShadow: `0 30px 80px rgba(180,240,50,0.6), 0 0 60px rgba(180,240,50,0.4)`,
          }}
        >
          Hoću svoj sajt
          <span style={{ transform: `translateX(${arrow}px)`, fontSize: 44 }}>→</span>
        </div>
      </div>

      <div
        style={{
          marginTop: 60,
          fontSize: 44,
          color: "#fff",
          fontWeight: 800,
          opacity: url,
          letterSpacing: 1,
          textShadow: "0 0 30px rgba(180,240,50,0.5)",
        }}
      >
        radenon-digital.com
      </div>
    </AbsoluteFill>
  );
};
