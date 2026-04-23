import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 3: v0/Cursor/Copilot — chaos collage
export const SceneAI3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tools = [
    { name: "v0", color: "#000", txt: "div salad", emoji: "🥗" },
    { name: "Cursor", color: "#1a1a1a", txt: "$20/mo razmišlja", emoji: "🤔" },
    { name: "Copilot", color: "#0a4a4a", txt: "i++ majstor", emoji: "🤖" },
    { name: "ChatGPT", color: "#0d6e5e", txt: '"Kao AI..."', emoji: "💬" },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", alignItems: "center", padding: 30 }}>
      <Audio src={staticFile("audio/dialup.wav")} volume={0.45} />
      <Audio src={staticFile("audio/scratch.wav")} volume={0.5} />
      <Audio src={staticFile("audio/pop.wav")} volume={0.7} />

      <div
        style={{
          fontSize: 70,
          fontWeight: 800,
          color: "#fff",
          marginBottom: 40,
          textAlign: "center",
          opacity: spring({ frame, fps, config: { damping: 12 } }),
          textShadow: "5px 5px 0 #000",
          letterSpacing: -1,
        }}
      >
        Konkurencija:
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, width: "100%" }}>
        {tools.map((tool, i) => {
          const delay = 8 + i * 7;
          const p = spring({ frame: frame - delay, fps, config: { damping: 8, stiffness: 200 } });
          const rot = (i % 2 === 0 ? -1 : 1) * 4;
          const wobble = Math.sin((frame - delay) * 0.3 + i) * 2;
          // Stamp REJECTED on each after frame
          const stampDelay = 50 + i * 4;
          const stamp = spring({ frame: frame - stampDelay, fps, config: { damping: 7, stiffness: 250 } });

          return (
            <div key={i}
              style={{
                background: tool.color,
                border: "4px solid #fff",
                borderRadius: 18,
                padding: 24,
                opacity: p,
                transform: `scale(${p}) rotate(${rot + wobble * 0.2}deg)`,
                boxShadow: "8px 8px 0 #000",
                position: "relative",
                minHeight: 220,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 70 }}>{tool.emoji}</div>
              <div style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>
                {tool.name}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
                {tool.txt}
              </div>

              {/* REJECTED stamp */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(-15deg) scale(${stamp})`,
                  opacity: stamp,
                  fontSize: 38,
                  fontWeight: 800,
                  color: "#ff2050",
                  border: "5px solid #ff2050",
                  padding: "6px 14px",
                  letterSpacing: 4,
                  background: "rgba(0,0,0,0.3)",
                  pointerEvents: "none",
                }}
              >
                MID
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
