import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 6: CTA — air horn finale
export const SceneBrainrot6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 10, stiffness: 200 } });
  const ctaIn = spring({ frame: frame - 24, fps, config: { damping: 8, stiffness: 220 } });
  const urlIn = spring({ frame: frame - 50, fps, config: { damping: 12 } });
  const pulse = 1 + Math.sin(frame * 0.25) * 0.04;

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <Audio src={staticFile("audio/airhorn.wav")} volume={0.7} />
      <Audio src={staticFile("audio/ding.wav")} volume={0.6} startFrom={0} />

      <div
        style={{
          fontSize: 88,
          fontWeight: 800,
          color: "#fff",
          textAlign: "center",
          letterSpacing: -2,
          marginBottom: 50,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0,1], [-50, 0])}px)`,
          textShadow: "6px 6px 0 #000",
          lineHeight: 1.0,
        }}
      >
        Ne čekaj.<br />
        <span style={{ color: COLORS.accent }}>Pumpaj.</span>
      </div>

      <div
        style={{
          background: COLORS.accent,
          color: "#000",
          fontSize: 80,
          fontWeight: 800,
          padding: "26px 60px",
          letterSpacing: -1,
          borderRadius: 24,
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
          marginTop: 60,
          fontSize: 52,
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
          marginTop: 16,
          fontSize: 36,
          fontWeight: 700,
          color: "#fff",
          opacity: urlIn * 0.9,
          letterSpacing: 1,
        }}
      >
        💚 RADENON DIGITAL
      </div>

      {/* Confetti rain */}
      {Array.from({length: 30}).map((_, i) => {
        const delay = i * 2;
        const y = interpolate(frame - delay, [0, 110], [-50, 1900], { extrapolateLeft: "clamp" });
        const x = (i * 73) % 1080;
        const colors = [COLORS.accent, "#ff5070", "#fff", "#ffcc00"];
        const c = colors[i % colors.length];
        const rot = (frame - delay) * 8;
        return (
          <div key={i}
            style={{
              position: "absolute",
              left: x, top: y,
              width: 18, height: 28,
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
