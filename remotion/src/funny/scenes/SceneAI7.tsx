import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 7: Chad meme — "Mi smo realni ljudi"
export const SceneAI7: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", alignItems: "center", padding: 40 }}>
      <Audio src={staticFile("audio/rizz.wav")} volume={0.7} />
      <Audio src={staticFile("audio/airhorn.wav")} volume={0.5} />

      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: "#fff",
          marginBottom: 30,
          opacity: titleIn,
          textAlign: "center",
          textShadow: "5px 5px 0 #000",
          letterSpacing: -1,
        }}
      >
        Dok oni promptuju...
      </div>

      {/* Side-by-side meme cards */}
      <div style={{ display: "flex", gap: 16, width: "100%" }}>
        {/* Soyjak */}
        <div
          style={{
            flex: 1,
            background: "rgba(255,80,112,0.15)",
            border: "4px solid #ff5070",
            borderRadius: 16,
            padding: 20,
            opacity: spring({ frame: frame - 10, fps, config: { damping: 10 } }),
            transform: `rotate(-3deg)`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 160 }}>😱</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#ff5070", letterSpacing: -1 }}>AI agencija</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginTop: 8 }}>"Možda za 3 mes."</div>
        </div>

        {/* Chad */}
        <div
          style={{
            flex: 1,
            background: "rgba(180,240,50,0.15)",
            border: "4px solid",
            borderColor: COLORS.accent,
            borderRadius: 16,
            padding: 20,
            opacity: spring({ frame: frame - 20, fps, config: { damping: 10 } }),
            transform: `rotate(3deg) scale(${spring({ frame: frame - 20, fps, config: { damping: 8, stiffness: 250 } })})`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 160 }}>🗿</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.accent, letterSpacing: -1 }}>RADENON</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginTop: 8 }}>"Sutra postavljam."</div>
        </div>
      </div>

      <div
        style={{
          marginTop: 50,
          fontSize: 80,
          fontWeight: 800,
          color: COLORS.accent,
          textAlign: "center",
          letterSpacing: -2,
          textShadow: "6px 6px 0 #000",
          opacity: spring({ frame: frame - 35, fps, config: { damping: 8 } }),
          transform: `scale(${spring({ frame: frame - 35, fps, config: { damping: 8 } })}) rotate(-2deg)`,
          lineHeight: 1.0,
        }}
      >
        REALNI LJUDI<br />
        <span style={{ color: "#fff", fontSize: 50 }}>+ AI gde treba</span>
      </div>

      {/* Random sparkles */}
      {Array.from({length: 10}).map((_, i) => {
        const delay = i * 5;
        const p = spring({ frame: frame - delay, fps, config: { damping: 10 } });
        return (
          <div key={i}
            style={{
              position: "absolute",
              left: (i * 191) % 1000 + 40,
              top: (i * 311) % 1700 + 100,
              fontSize: 50,
              opacity: interpolate(p, [0, 0.5, 1], [0, 1, 0.5]),
              transform: `scale(${p}) rotate(${(frame - delay) * 8}deg)`,
              pointerEvents: "none",
            }}
          >✨</div>
        );
      })}
    </AbsoluteFill>
  );
};
