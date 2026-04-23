import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 8: CTA Finale
export const SceneAI8: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 10 } });
  const ctaIn = spring({ frame: frame - 22, fps, config: { damping: 7, stiffness: 220 } });
  const urlIn = spring({ frame: frame - 50, fps, config: { damping: 12 } });
  const pulse = 1 + Math.sin(frame * 0.3) * 0.05;

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <Audio src={staticFile("audio/airhorn.wav")} volume={0.7} />
      <Audio src={staticFile("audio/chaching.wav")} volume={0.6} />
      <Audio src={staticFile("audio/ding.wav")} volume={0.5} />

      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: "#fff",
          textAlign: "center",
          letterSpacing: -2,
          marginBottom: 40,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0,1], [-60, 0])}px)`,
          textShadow: "6px 6px 0 #000",
          lineHeight: 1.0,
        }}
      >
        Stop AI cope.<br />
        <span style={{ color: COLORS.accent }}>Get RADENON.</span>
      </div>

      <div
        style={{
          background: COLORS.accent,
          color: "#000",
          fontSize: 70,
          fontWeight: 800,
          padding: "24px 50px",
          letterSpacing: -1,
          borderRadius: 22,
          transform: `scale(${ctaIn * pulse}) rotate(-2deg)`,
          opacity: ctaIn,
          boxShadow: "12px 12px 0 #000",
          border: "4px solid #000",
          textAlign: "center",
          lineHeight: 1.0,
        }}
      >
        ZAKAŽI<br />KONSULTACIJU
      </div>

      <div
        style={{
          marginTop: 50,
          fontSize: 48,
          fontWeight: 800,
          color: COLORS.accent,
          opacity: urlIn,
          transform: `translateY(${interpolate(urlIn, [0,1], [30, 0])}px)`,
          letterSpacing: 2,
          textShadow: "3px 3px 0 #000",
        }}
      >
        radenon-digital.com
      </div>

      <div
        style={{
          marginTop: 14,
          fontSize: 32,
          fontWeight: 700,
          color: "#fff",
          opacity: urlIn * 0.9,
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        💚 RADENON DIGITAL — bez cope
      </div>

      {/* Confetti rain */}
      {Array.from({length: 40}).map((_, i) => {
        const delay = i * 1.5;
        const y = interpolate(frame - delay, [0, 110], [-50, 1900], { extrapolateLeft: "clamp" });
        const x = (i * 73) % 1080;
        const colors = [COLORS.accent, "#ff5070", "#fff", "#ffcc00", "cyan"];
        const c = colors[i % colors.length];
        const rot = (frame - delay) * 8;
        return (
          <div key={i}
            style={{
              position: "absolute",
              left: x, top: y,
              width: 16, height: 26,
              background: c,
              transform: `rotate(${rot}deg)`,
              opacity: 0.9,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
