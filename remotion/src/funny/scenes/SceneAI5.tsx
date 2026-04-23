import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 5: BUM transition — meanwhile, RADENON
export const SceneAI5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const punch = spring({ frame, fps, config: { damping: 6, stiffness: 220 } });
  const flash = frame < 6 ? 1 - frame / 6 : 0;
  const rayRot = (frame * 1.5) % 360;
  const sub = spring({ frame: frame - 14, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <Audio src={staticFile("audio/vineboom.wav")} volume={1} />
      <Audio src={staticFile("audio/skibidi.wav")} volume={0.7} />

      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash * 0.9 }} />

      {/* Sun rays */}
      <svg width={1800} height={1800}
        style={{
          position: "absolute",
          transform: `rotate(${rayRot}deg) scale(${interpolate(punch, [0,1],[0.2, 1.3])})`,
          opacity: punch,
        }}
        viewBox="-100 -100 200 200"
      >
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const colorOpts = [COLORS.accent, "#ff5070", "#fff", "cyan"];
          return (
            <line key={i}
              x1={Math.cos(angle) * 25} y1={Math.sin(angle) * 25}
              x2={Math.cos(angle) * 120} y2={Math.sin(angle) * 120}
              stroke={colorOpts[i % colorOpts.length]}
              strokeWidth={i % 2 === 0 ? 12 : 5}
              opacity={0.9}
            />
          );
        })}
      </svg>

      <div
        style={{
          fontSize: 70,
          fontWeight: 800,
          color: "#fff",
          opacity: punch,
          marginBottom: -10,
          letterSpacing: 6,
          textShadow: "5px 5px 0 #000",
        }}
      >
        MEĐUTIM...
      </div>

      <div
        style={{
          fontSize: 240,
          fontWeight: 800,
          color: COLORS.accent,
          letterSpacing: -8,
          transform: `scale(${interpolate(punch, [0,1], [0.1, 1.05])}) rotate(-4deg)`,
          textShadow: "0 0 80px rgba(180,240,50,1), 12px 12px 0 #000, -4px -4px 0 #000",
          WebkitTextStroke: "5px #000",
          lineHeight: 0.9,
        }}
      >
        RADENON
      </div>

      <div
        style={{
          marginTop: 20,
          fontSize: 80,
          fontWeight: 800,
          color: "#fff",
          opacity: sub,
          transform: `translateY(${interpolate(sub, [0,1], [50, 0])}px) rotate(2deg)`,
          textShadow: "6px 6px 0 #000",
          letterSpacing: -2,
        }}
      >
        ulazi u CHAT 💚
      </div>
    </AbsoluteFill>
  );
};
