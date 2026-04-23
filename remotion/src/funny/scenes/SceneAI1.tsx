import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 1: HOOK — "AI agencije 2026" + glitch
export const SceneAI1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popIn = spring({ frame, fps, config: { damping: 8, stiffness: 220 } });
  const shake = Math.sin(frame * 1.2) * 6;
  const glitchOffset = Math.floor(frame / 3) % 2 === 0 ? 4 : -4;

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <Audio src={staticFile("audio/glitch.wav")} volume={0.6} />
      <Audio src={staticFile("audio/zoomin.wav")} volume={0.5} />

      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: 180,
          fontSize: 44,
          color: "#ff5070",
          background: "#000",
          padding: "10px 24px",
          letterSpacing: 6,
          fontWeight: 800,
          border: "3px solid #ff5070",
          transform: `rotate(-3deg) translateX(${shake}px)`,
          opacity: popIn,
        }}
      >
        ⚠ UPOZORENJE ⚠
      </div>

      {/* Glitch layered title */}
      <div style={{ position: "relative", transform: `scale(${popIn})` }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            color: "cyan",
            fontSize: 130,
            fontWeight: 800,
            letterSpacing: -4,
            transform: `translate(${glitchOffset}px, ${-glitchOffset}px)`,
            opacity: 0.7,
            textAlign: "center",
            lineHeight: 1.0,
          }}
        >
          AI AGENCIJE
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            color: "#ff00aa",
            fontSize: 130,
            fontWeight: 800,
            letterSpacing: -4,
            transform: `translate(${-glitchOffset}px, ${glitchOffset}px)`,
            opacity: 0.7,
            textAlign: "center",
            lineHeight: 1.0,
          }}
        >
          AI AGENCIJE
        </div>
        <div
          style={{
            color: "#fff",
            fontSize: 130,
            fontWeight: 800,
            letterSpacing: -4,
            textAlign: "center",
            lineHeight: 1.0,
            position: "relative",
          }}
        >
          AI AGENCIJE
        </div>
      </div>

      <div
        style={{
          marginTop: 200,
          fontSize: 110,
          fontWeight: 800,
          color: COLORS.accent,
          textAlign: "center",
          transform: `rotate(-4deg) scale(${popIn})`,
          textShadow: "8px 8px 0 #000",
          letterSpacing: -3,
        }}
      >
        EXPOSED 💀
      </div>

      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, transparent 0, transparent 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 4px)",
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};
