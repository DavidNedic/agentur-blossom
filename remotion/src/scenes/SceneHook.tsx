import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../components/theme";

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeIn = spring({ frame, fps, config: { damping: 14, stiffness: 200 } });
  const sub = spring({ frame: frame - 50, fps, config: { damping: 22, stiffness: 140 } });

  // Per-character reveal for headline lines
  const renderChars = (text: string, delayBase: number, color: string, glow = false) => {
    return text.split("").map((ch, i) => {
      const charDelay = delayBase + i * 2;
      const p = spring({ frame: frame - charDelay, fps, config: { damping: 14, stiffness: 220 } });
      const y = interpolate(p, [0, 1], [120, 0]);
      const blur = interpolate(p, [0, 1], [12, 0]);
      return (
        <span
          key={i}
          style={{
            display: "inline-block",
            transform: `translateY(${y}px)`,
            opacity: p,
            filter: `blur(${blur}px)`,
            color,
            textShadow: glow ? `0 0 50px ${color}aa, 0 0 100px ${color}55` : "none",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      );
    });
  };

  const dotPulse = 1 + Math.sin(frame * 0.25) * 0.2;
  const flash = frame < 4 ? 1 - frame / 4 : 0;

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "180px 80px",
        justifyContent: "center",
      }}
    >
      {/* Flash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: COLORS.accent,
          opacity: flash * 0.25,
          pointerEvents: "none",
        }}
      />

      {/* Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 24px",
          background: "rgba(180,240,50,0.12)",
          border: "1px solid rgba(180,240,50,0.4)",
          borderRadius: 999,
          alignSelf: "flex-start",
          opacity: badgeIn,
          transform: `translateY(${interpolate(badgeIn, [0, 1], [30, 0])}px) scale(${interpolate(badgeIn, [0, 1], [0.8, 1])})`,
          marginBottom: 50,
          boxShadow: `0 0 40px rgba(180,240,50,0.3)`,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: COLORS.accent,
            transform: `scale(${dotPulse})`,
            boxShadow: `0 0 20px ${COLORS.accent}`,
          }}
        />
        <span style={{ color: COLORS.accent, fontSize: 28, fontWeight: 700, letterSpacing: 3 }}>
          RADENON DIGITAL
        </span>
      </div>

      {/* Headline with per-char animation */}
      <div style={{ fontSize: 130, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
        {renderChars("Tvoj sajt.", 6, COLORS.text)}
      </div>
      <div style={{ fontSize: 130, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
        {renderChars("Za 48h.", 18, COLORS.text)}
      </div>
      <div style={{ fontSize: 130, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
        {renderChars("Od 199 €.", 30, COLORS.accent, true)}
      </div>

      <div
        style={{
          marginTop: 60,
          fontSize: 36,
          color: COLORS.muted,
          fontWeight: 500,
          opacity: sub,
          transform: `translateY(${interpolate(sub, [0, 1], [20, 0])}px)`,
          maxWidth: 800,
        }}
      >
        Bez rizika. Bez skrivenih troškova.
      </div>
    </AbsoluteFill>
  );
};
