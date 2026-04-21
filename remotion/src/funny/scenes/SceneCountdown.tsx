import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 4: 48-HOUR COUNTDOWN — giant ticking number 48 → 24 → 0
export const SceneCountdown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 14 } });

  // Ticking countdown 48 → 0 over the scene
  const t = interpolate(frame, [10, 95], [48, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const displayHours = Math.max(0, Math.round(t));

  // Each tick: a little punch when displayHours changes
  const lastTickFrame = Math.max(0, frame - (frame % 2));
  const tickPulse = 1 + (frame % 2 === 0 ? 0.04 : 0);

  // Color shift — green when high, red as it nears 0... wait actually we want celebratory.
  // Let's stay green/lime, but pulse harder near zero.
  const isZero = displayHours === 0;
  const zeroFrame = isZero ? frame - 95 : 0;
  const zeroBurst = isZero ? spring({ frame: zeroFrame, fps, config: { damping: 6, stiffness: 200 } }) : 0;

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "150px 60px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 36,
          color: COLORS.accent,
          letterSpacing: 6,
          fontWeight: 800,
          opacity: titleIn,
          marginBottom: 20,
        }}
      >
        ODBROJAVANJE ⏱️
      </div>
      <div
        style={{
          fontSize: 60,
          color: "#fff",
          fontWeight: 800,
          opacity: titleIn,
          marginBottom: 40,
          letterSpacing: -1,
          textAlign: "center",
        }}
      >
        Tvoj sajt za:
      </div>

      {/* The big number */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 24,
          transform: `scale(${tickPulse * (1 + zeroBurst * 0.15)})`,
        }}
      >
        <div
          style={{
            fontSize: 480,
            fontWeight: 800,
            color: isZero ? "#ff5070" : COLORS.accent,
            letterSpacing: -20,
            lineHeight: 0.9,
            fontVariantNumeric: "tabular-nums",
            textShadow: isZero
              ? "0 0 80px rgba(255,80,112,0.7)"
              : "0 0 80px rgba(180,240,50,0.7)",
            WebkitTextStroke: "4px #000",
          }}
        >
          {String(displayHours).padStart(2, "0")}
        </div>
        <div
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: -2,
          }}
        >
          h
        </div>
      </div>

      {/* Bottom punchline appears at 0 */}
      {isZero && (
        <div
          style={{
            marginTop: 30,
            fontSize: 64,
            fontWeight: 800,
            color: "#fff",
            opacity: zeroBurst,
            transform: `translateY(${interpolate(zeroBurst, [0, 1], [40, 0])}px) rotate(-2deg)`,
            background: COLORS.accent,
            color2: "#000",
            padding: "14px 32px",
            borderRadius: 20,
            letterSpacing: -1,
          }}
        >
          <span style={{ color: "#0a0d12" }}>GOTOVO. ✅</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
