import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../components/theme";

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeIn = spring({ frame, fps, config: { damping: 18, stiffness: 180 } });
  const line1 = spring({ frame: frame - 8, fps, config: { damping: 20, stiffness: 160 } });
  const line2 = spring({ frame: frame - 22, fps, config: { damping: 20, stiffness: 160 } });
  const line3 = spring({ frame: frame - 36, fps, config: { damping: 18, stiffness: 160 } });
  const sub = spring({ frame: frame - 60, fps, config: { damping: 22, stiffness: 140 } });

  const dotPulse = 1 + Math.sin(frame * 0.18) * 0.15;

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "180px 80px",
        justifyContent: "center",
      }}
    >
      {/* Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 24px",
          background: "rgba(180,240,50,0.1)",
          border: "1px solid rgba(180,240,50,0.3)",
          borderRadius: 999,
          alignSelf: "flex-start",
          opacity: badgeIn,
          transform: `translateY(${interpolate(badgeIn, [0, 1], [30, 0])}px)`,
          marginBottom: 50,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: COLORS.accent,
            transform: `scale(${dotPulse})`,
            boxShadow: `0 0 16px ${COLORS.accent}`,
          }}
        />
        <span style={{ color: COLORS.accent, fontSize: 28, fontWeight: 700, letterSpacing: 3 }}>
          RADENON DIGITAL
        </span>
      </div>

      {/* Headline */}
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontSize: 130,
            fontWeight: 800,
            color: COLORS.text,
            lineHeight: 1.02,
            letterSpacing: -3,
            transform: `translateY(${interpolate(line1, [0, 1], [120, 0])}px)`,
            opacity: line1,
          }}
        >
          Tvoj sajt.
        </div>
      </div>
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontSize: 130,
            fontWeight: 800,
            color: COLORS.text,
            lineHeight: 1.02,
            letterSpacing: -3,
            transform: `translateY(${interpolate(line2, [0, 1], [120, 0])}px)`,
            opacity: line2,
          }}
        >
          Za 14 dana.
        </div>
      </div>
      <div style={{ overflow: "hidden" }}>
        <div
          style={{
            fontSize: 130,
            fontWeight: 800,
            color: COLORS.accent,
            lineHeight: 1.02,
            letterSpacing: -3,
            transform: `translateY(${interpolate(line3, [0, 1], [120, 0])}px)`,
            opacity: line3,
            textShadow: `0 0 60px rgba(180,240,50,0.4)`,
          }}
        >
          Od 199 €.
        </div>
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
