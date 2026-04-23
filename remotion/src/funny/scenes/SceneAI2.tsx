import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 2: Bolt.new roast — "20$ za sajt koji ne radi"
export const SceneAI2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const inP = spring({ frame, fps, config: { damping: 10 } });
  const errorIn = spring({ frame: frame - 18, fps, config: { damping: 7, stiffness: 220 } });
  const wompIn = spring({ frame: frame - 35, fps, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, padding: 50, justifyContent: "center" }}>
      <Audio src={staticFile("audio/error.wav")} volume={0.5} />
      <Audio src={staticFile("audio/womp.wav")} volume={0.7} />

      {/* Logo box */}
      <div
        style={{
          alignSelf: "center",
          background: "#000",
          color: "#fff",
          padding: "20px 40px",
          fontSize: 80,
          fontWeight: 800,
          border: `4px solid ${COLORS.accent}`,
          opacity: inP,
          transform: `translateY(${interpolate(inP, [0,1], [-60, 0])}px) rotate(-2deg)`,
          marginBottom: 40,
          letterSpacing: -2,
        }}
      >
        ⚡ Bolt.new
      </div>

      {/* Big X */}
      <div
        style={{
          alignSelf: "center",
          fontSize: 280,
          color: "#ff5070",
          fontWeight: 800,
          opacity: errorIn,
          transform: `rotate(${interpolate(errorIn, [0,1], [-180, 0])}deg) scale(${errorIn})`,
          textShadow: "10px 10px 0 #000",
          lineHeight: 1,
          marginBottom: 30,
        }}
      >
        ✕
      </div>

      {/* Bullet roasts */}
      {["20$ / mesec", "Sajt: 7 errora", "Hosting? Sam se snađi"].map((txt, i) => {
        const p = spring({ frame: frame - 12 - i*8, fps, config: { damping: 9 } });
        return (
          <div key={i}
            style={{
              alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
              fontSize: 56,
              fontWeight: 800,
              color: "#fff",
              background: "#ff5070",
              padding: "12px 24px",
              marginBottom: 14,
              opacity: p,
              transform: `translateX(${interpolate(p, [0,1], [i%2===0?-200:200, 0])}px) rotate(${i%2===0?-3:3}deg)`,
              border: "3px solid #000",
              boxShadow: "6px 6px 0 #000",
              letterSpacing: -1,
            }}
          >
            ❌ {txt}
          </div>
        );
      })}

      {/* Bottom womp */}
      <div
        style={{
          alignSelf: "center",
          marginTop: 40,
          fontSize: 90,
          fontWeight: 800,
          color: COLORS.accent,
          opacity: wompIn,
          transform: `scale(${wompIn})`,
          letterSpacing: -2,
          textShadow: "5px 5px 0 #000",
        }}
      >
        WOMP WOMP 🎺
      </div>
    </AbsoluteFill>
  );
};
