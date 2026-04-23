import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile, Sequence } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 1: "POV: dein sajt 2014" — fast zoom, scratch sound
export const SceneBrainrot1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = spring({ frame, fps, config: { damping: 12, stiffness: 220 } });
  const scale = interpolate(zoom, [0, 1], [0.5, 1]);
  const shake = Math.sin(frame * 0.8) * 4;

  const captionIn = spring({ frame: frame - 8, fps, config: { damping: 14 } });

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", alignItems: "center" }}>
      <Audio src={staticFile("audio/scratch.wav")} volume={0.7} />

      {/* Big POV label */}
      <div
        style={{
          position: "absolute",
          top: 200,
          background: "#000",
          color: "#fff",
          fontSize: 56,
          fontWeight: 800,
          padding: "16px 32px",
          letterSpacing: 4,
          opacity: captionIn,
          transform: `translateY(${interpolate(captionIn, [0, 1], [-40, 0])}px) rotate(-2deg)`,
          border: "4px solid #fff",
          boxShadow: "8px 8px 0 rgba(180,240,50,0.8)",
        }}
      >
        POV:
      </div>

      <div
        style={{
          fontSize: 130,
          fontWeight: 800,
          color: "#fff",
          textAlign: "center",
          lineHeight: 0.95,
          letterSpacing: -4,
          transform: `scale(${scale}) translate(${shake}px, ${shake * 0.5}px)`,
          textShadow: "8px 8px 0 #000",
          padding: "0 60px",
        }}
      >
        Tvoj sajt iz<br />
        <span style={{ color: "#ff5070", fontSize: 200, display: "inline-block", transform: "rotate(-3deg)" }}>2014</span>
      </div>

      {/* Spinning emoji */}
      <Sequence from={20}>
        <SpinEmoji />
      </Sequence>
    </AbsoluteFill>
  );
};

const SpinEmoji: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = frame * 8;
  const scale = spring({ frame, fps: 30, config: { damping: 8 } });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 240,
        fontSize: 220,
        transform: `rotate(${rot}deg) scale(${scale})`,
      }}
    >
      💀
    </div>
  );
};
