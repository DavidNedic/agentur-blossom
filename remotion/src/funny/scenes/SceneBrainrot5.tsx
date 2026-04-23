import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 5: speed run — list of features with ding/pop on each
export const SceneBrainrot5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items = [
    { t: "Sajt za 7 dana", icon: "⚡" },
    { t: "SEO koji RADI", icon: "📈" },
    { t: "Dizajn = 🔥", icon: "🎨" },
    { t: "Cena: od 199€", icon: "💸" },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", padding: "60px 50px" }}>
      <Audio src={staticFile("audio/pop.wav")} volume={0.8} startFrom={0} />
      <Audio src={staticFile("audio/pop.wav")} volume={0.8} startFrom={0} trimBefore={0} />

      <div
        style={{
          fontSize: 70,
          fontWeight: 800,
          color: COLORS.accent,
          marginBottom: 60,
          opacity: spring({ frame, fps, config: { damping: 12 } }),
          textTransform: "uppercase",
          letterSpacing: 2,
          textShadow: "4px 4px 0 #000",
        }}
      >
        Šta dobijaš:
      </div>

      {items.map((item, i) => {
        const delay = 6 + i * 14;
        const p = spring({ frame: frame - delay, fps, config: { damping: 9, stiffness: 220 } });
        const x = interpolate(p, [0, 1], [-200, 0]);
        const rot = interpolate(p, [0, 1], [-12, i % 2 === 0 ? -2 : 2]);
        const wobble = Math.sin((frame - delay) * 0.4) * 2;

        return (
          <div key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              marginBottom: 36,
              opacity: p,
              transform: `translateX(${x}px) rotate(${rot + wobble * 0.3}deg)`,
            }}
          >
            <div
              style={{
                fontSize: 90,
                width: 130,
                height: 130,
                background: COLORS.accent,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "8px 8px 0 #000",
              }}
            >
              {item.icon}
            </div>
            <div
              style={{
                fontSize: 76,
                fontWeight: 800,
                color: "#fff",
                background: "#000",
                padding: "14px 28px",
                letterSpacing: -1,
                border: "4px solid #fff",
              }}
            >
              {item.t}
            </div>
          </div>
        );
      })}

      {/* Sparkle accents */}
      {Array.from({length: 12}).map((_, i) => {
        const delay = i * 8;
        const p = spring({ frame: frame - delay, fps, config: { damping: 10 } });
        const x = (i * 211) % 1000 + 40;
        const y = (i * 397) % 1700 + 100;
        return (
          <div key={i}
            style={{
              position: "absolute",
              left: x, top: y,
              fontSize: 60,
              opacity: interpolate(p, [0, 0.5, 1], [0, 1, 0.6]),
              transform: `scale(${p}) rotate(${(frame - delay) * 6}deg)`,
              pointerEvents: "none",
            }}
          >
            ✨
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
