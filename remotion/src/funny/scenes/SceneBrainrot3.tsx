import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 3: "3 meseca čekanja???" — sad trombone + huh sound
export const SceneBrainrot3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sad = spring({ frame, fps, config: { damping: 10 } });
  const droop = interpolate(frame, [0, 90], [0, 12]);

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <Audio src={staticFile("audio/sad.wav")} volume={0.6} />
      <Audio src={staticFile("audio/huh.wav")} volume={0.5} startFrom={0} />

      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: COLORS.muted,
          marginBottom: 30,
          opacity: sad,
          transform: `translateY(${interpolate(sad, [0,1], [-30, 0])}px)`,
        }}
      >
        Druga agencija:
      </div>

      <div
        style={{
          fontSize: 180,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: -6,
          textShadow: "10px 10px 0 #000",
          transform: `rotate(${droop * 0.3}deg) scale(${interpolate(sad, [0,1], [0.5, 1])})`,
          opacity: sad,
        }}
      >
        3 meseca
      </div>

      <div
        style={{
          fontSize: 120,
          fontWeight: 800,
          color: "#ff5070",
          letterSpacing: -3,
          marginTop: 20,
          transform: `rotate(${-droop * 0.2}deg)`,
          textShadow: "6px 6px 0 #000",
        }}
      >
        čekanja
      </div>

      {/* Question marks raining */}
      {Array.from({length: 8}).map((_, i) => {
        const delay = 8 + i * 4;
        const y = interpolate(frame - delay, [0, 60], [-100, 1700], { extrapolateLeft: "clamp" });
        const x = (i * 137) % 1080;
        const rot = (frame - delay) * 4;
        return (
          <div key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontSize: 80,
              color: "#ff5070",
              opacity: 0.7,
              fontWeight: 800,
              transform: `rotate(${rot}deg)`,
            }}
          >
            ?
          </div>
        );
      })}

      {/* Bruh emoji */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          fontSize: 200,
          opacity: spring({ frame: frame - 30, fps, config: { damping: 8 } }),
          transform: `scale(${spring({ frame: frame - 30, fps, config: { damping: 8 } })})`,
        }}
      >
        🤡
      </div>
    </AbsoluteFill>
  );
};
