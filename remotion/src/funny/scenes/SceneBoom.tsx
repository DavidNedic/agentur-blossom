import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 3: BOOM
export const SceneBoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const punch = spring({ frame, fps, config: { damping: 6, stiffness: 220, mass: 0.8 } });
  const scale = interpolate(punch, [0, 1], [0.2, 1.05]);
  const settle = spring({ frame: frame - 14, fps, config: { damping: 18 } });
  const finalScale = scale - interpolate(settle, [0, 1], [0, 0.05]);

  const rot = interpolate(punch, [0, 1], [-25, -8]);
  const rayRot = (frame * 0.6) % 360;
  const flash = frame < 5 ? 1 - frame / 5 : 0;
  const sub = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 200 } });

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#fff",
          opacity: flash * 0.7,
        }}
      />
      <svg
        width={1400}
        height={1400}
        style={{
          position: "absolute",
          transform: `rotate(${rayRot}deg) scale(${interpolate(punch, [0, 1], [0.3, 1])})`,
          opacity: punch * 0.9,
        }}
        viewBox="-100 -100 200 200"
      >
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const x1 = Math.cos(angle) * 30;
          const y1 = Math.sin(angle) * 30;
          const x2 = Math.cos(angle) * 100;
          const y2 = Math.sin(angle) * 100;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={COLORS.accent}
              strokeWidth={i % 2 === 0 ? 8 : 3}
              opacity={i % 2 === 0 ? 0.9 : 0.5}
            />
          );
        })}
      </svg>

      <div
        style={{
          fontSize: 320,
          fontWeight: 800,
          color: COLORS.accent,
          letterSpacing: -10,
          transform: `scale(${finalScale}) rotate(${rot}deg)`,
          textShadow: "0 0 60px rgba(180,240,50,0.8), 8px 8px 0 #000, -3px -3px 0 #000",
          WebkitTextStroke: "4px #000",
          lineHeight: 0.9,
        }}
      >
        BUM!
      </div>

      <div
        style={{
          marginTop: 30,
          fontSize: 56,
          fontWeight: 800,
          color: "#fff",
          opacity: sub,
          transform: `translateY(${interpolate(sub, [0, 1], [40, 0])}px)`,
          textAlign: "center",
          lineHeight: 1.05,
          letterSpacing: -1,
        }}
      >
        Stiže Radenon Digital.
      </div>
    </AbsoluteFill>
  );
};
