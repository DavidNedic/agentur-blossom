import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 4: BUM! — Riser + boom + bassdrop
export const SceneBrainrot4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const punch = spring({ frame, fps, config: { damping: 6, stiffness: 220 } });
  const scale = interpolate(punch, [0, 1], [0.1, 1.1]);
  const flash = frame < 8 ? 1 - frame / 8 : 0;
  const rayRot = (frame * 1.2) % 360;
  const sub = spring({ frame: frame - 18, fps, config: { damping: 12, stiffness: 200 } });

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <Audio src={staticFile("audio/boom.wav")} volume={1} />
      <Audio src={staticFile("audio/bassdrop.wav")} volume={0.8} startFrom={0} />

      {/* Flash */}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash * 0.85 }} />

      {/* Sun rays */}
      <svg width={1600} height={1600}
        style={{
          position: "absolute",
          transform: `rotate(${rayRot}deg) scale(${interpolate(punch, [0,1],[0.2, 1.2])})`,
          opacity: punch,
        }}
        viewBox="-100 -100 200 200"
      >
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          return (
            <line key={i}
              x1={Math.cos(angle) * 25} y1={Math.sin(angle) * 25}
              x2={Math.cos(angle) * 110} y2={Math.sin(angle) * 110}
              stroke={i % 2 === 0 ? COLORS.accent : "#ff5070"}
              strokeWidth={i % 2 === 0 ? 10 : 4}
              opacity={0.85}
            />
          );
        })}
      </svg>

      <div
        style={{
          fontSize: 380,
          fontWeight: 800,
          color: COLORS.accent,
          letterSpacing: -12,
          transform: `scale(${scale}) rotate(-6deg)`,
          textShadow: "0 0 80px rgba(180,240,50,0.9), 12px 12px 0 #000, -4px -4px 0 #000",
          WebkitTextStroke: "5px #000",
          lineHeight: 0.85,
        }}
      >
        BUM!
      </div>

      <div
        style={{
          marginTop: 30,
          fontSize: 64,
          fontWeight: 800,
          color: "#fff",
          opacity: sub,
          transform: `translateY(${interpolate(sub, [0,1], [50, 0])}px)`,
          textAlign: "center",
          letterSpacing: -1,
          textShadow: "4px 4px 0 #000",
        }}
      >
        Stiže RADENON
      </div>
    </AbsoluteFill>
  );
};
