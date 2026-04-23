import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 6: Compare side by side
export const SceneAI6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headIn = spring({ frame, fps, config: { damping: 10 } });

  const rows = [
    ["Brzina", "3 meseca 🐌", "7 dana ⚡"],
    ["Cena", "5000$ 💸", "199€ 🔥"],
    ["Podrška", "Tiket #4729", "Telefon 📞"],
    ["Dizajn", "Bootstrap 2014", "Custom 🎨"],
  ];

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, padding: 40, justifyContent: "center" }}>
      <Audio src={staticFile("audio/ding.wav")} volume={0.6} />
      <Audio src={staticFile("audio/chaching.wav")} volume={0.7} />
      <Audio src={staticFile("audio/pop.wav")} volume={0.5} />

      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1.3fr", gap: 8, marginBottom: 16, opacity: headIn }}>
        <div />
        <div style={{
          background: "#ff5070", color: "#fff", padding: "14px", textAlign: "center",
          fontSize: 38, fontWeight: 800, borderRadius: 12, letterSpacing: -1,
          border: "3px solid #000", boxShadow: "4px 4px 0 #000",
        }}>
          AI agencija
        </div>
        <div style={{
          background: COLORS.accent, color: "#000", padding: "14px", textAlign: "center",
          fontSize: 38, fontWeight: 800, borderRadius: 12, letterSpacing: -1,
          border: "3px solid #000", boxShadow: "4px 4px 0 #000",
        }}>
          RADENON 💚
        </div>
      </div>

      {rows.map((row, i) => {
        const delay = 8 + i * 10;
        const p = spring({ frame: frame - delay, fps, config: { damping: 11 } });
        return (
          <div key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.3fr 1.3fr",
              gap: 8,
              marginBottom: 12,
              opacity: p,
              transform: `translateX(${interpolate(p, [0,1], [-100, 0])}px)`,
            }}
          >
            <div style={{
              background: "#000", color: "#fff", padding: "18px 12px",
              fontSize: 32, fontWeight: 800, borderRadius: 10, textAlign: "center",
              letterSpacing: -1,
            }}>{row[0]}</div>
            <div style={{
              background: "rgba(255,80,112,0.2)", color: "#ff8090", padding: "18px 14px",
              fontSize: 32, fontWeight: 700, borderRadius: 10, textAlign: "center",
              border: "2px solid rgba(255,80,112,0.5)", letterSpacing: -1,
            }}>{row[1]}</div>
            <div style={{
              background: "rgba(180,240,50,0.2)", color: COLORS.accent, padding: "18px 14px",
              fontSize: 34, fontWeight: 800, borderRadius: 10, textAlign: "center",
              border: "2px solid rgba(180,240,50,0.5)", letterSpacing: -1,
            }}>{row[2]}</div>
          </div>
        );
      })}

      {/* Big arrow pointing right */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 30,
          fontSize: 140,
          color: COLORS.accent,
          opacity: spring({ frame: frame - 60, fps, config: { damping: 8 } }),
          transform: `translateY(-50%) translateX(${interpolate(Math.sin(frame*0.3),[-1,1],[-15,15])}px)`,
          textShadow: "5px 5px 0 #000",
        }}
      >
        👉
      </div>
    </AbsoluteFill>
  );
};
