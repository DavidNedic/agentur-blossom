import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../components/theme";

const problems = [
  "Sajt ti izgleda zastarelo?",
  "Niko te ne nalazi na Google-u?",
  "Konkurencija ti uzima klijente?",
];

export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 16, stiffness: 200 } });

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "180px 80px",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 32,
          color: "#ff5070",
          letterSpacing: 4,
          fontWeight: 700,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [20, 0])}px)`,
          marginBottom: 40,
        }}
      >
        ZVUČI POZNATO?
      </div>

      {problems.map((p, i) => {
        const delay = 8 + i * 8;
        const inP = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 200 } });
        const x = interpolate(inP, [0, 1], [-120, 0]);
        const blur = interpolate(inP, [0, 1], [10, 0]);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              marginTop: 32,
              opacity: inP,
              transform: `translateX(${x}px)`,
              filter: `blur(${blur}px)`,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 18,
                background: "rgba(255,80,112,0.15)",
                border: "1px solid rgba(255,80,112,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                color: "#ff5070",
                fontWeight: 800,
                flexShrink: 0,
                boxShadow: `0 0 30px rgba(255,80,112,0.3)`,
              }}
            >
              ✕
            </div>
            <div
              style={{
                fontSize: 50,
                fontWeight: 700,
                color: COLORS.text,
                lineHeight: 1.15,
                letterSpacing: -1,
              }}
            >
              {p}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
