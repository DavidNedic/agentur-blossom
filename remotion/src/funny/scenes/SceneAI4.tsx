import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 4: ChatGPT mocks — "Kao AI nemam pristup..."
export const SceneAI4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneIn = spring({ frame, fps, config: { damping: 10 } });

  const messages = [
    { who: "Ti", txt: "Napravi mi sajt", side: "right" },
    { who: "AI", txt: "Kao AI ne mogu...", side: "left" },
    { who: "Ti", txt: "MOLIM TE", side: "right" },
    { who: "AI", txt: "Evo plan u 47 koraka", side: "left" },
  ];

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <Audio src={staticFile("audio/huh.wav")} volume={0.5} />
      <Audio src={staticFile("audio/pop.wav")} volume={0.6} />
      <Audio src={staticFile("audio/sad.wav")} volume={0.5} />

      <div
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: "#fff",
          marginBottom: 30,
          textAlign: "center",
          opacity: phoneIn,
          background: "#10a37f",
          padding: "10px 24px",
          borderRadius: 12,
          letterSpacing: -1,
          transform: `rotate(-2deg)`,
        }}
      >
        🤖 ChatGPT konverzacija
      </div>

      {/* Chat bubbles */}
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 18 }}>
        {messages.map((m, i) => {
          const delay = 10 + i * 12;
          const p = spring({ frame: frame - delay, fps, config: { damping: 10 } });
          const isRight = m.side === "right";
          return (
            <div key={i}
              style={{
                alignSelf: isRight ? "flex-end" : "flex-start",
                maxWidth: "85%",
                background: isRight ? COLORS.accent : "#2d2d3a",
                color: isRight ? "#000" : "#fff",
                padding: "18px 26px",
                borderRadius: 22,
                fontSize: 42,
                fontWeight: 700,
                opacity: p,
                transform: `translateY(${interpolate(p, [0,1], [40, 0])}px) scale(${interpolate(p,[0,1],[0.7,1])})`,
                border: "3px solid #000",
                boxShadow: "5px 5px 0 #000",
                letterSpacing: -1,
              }}
            >
              {m.txt}
            </div>
          );
        })}
      </div>

      {/* Frustrated emoji */}
      <div
        style={{
          marginTop: 50,
          fontSize: 200,
          opacity: spring({ frame: frame - 60, fps, config: { damping: 8 } }),
          transform: `rotate(${Math.sin(frame * 0.4) * 10}deg) scale(${spring({ frame: frame - 60, fps, config: { damping: 8 } })})`,
        }}
      >
        🤬
      </div>
    </AbsoluteFill>
  );
};
