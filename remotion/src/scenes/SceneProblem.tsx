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

  const titleIn = spring({ frame, fps, config: { damping: 20, stiffness: 160 } });

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "200px 80px",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 32,
          color: COLORS.accent,
          letterSpacing: 4,
          fontWeight: 700,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [20, 0])}px)`,
          marginBottom: 30,
        }}
      >
        ZVUČI POZNATO?
      </div>

      {problems.map((p, i) => {
        const delay = 18 + i * 22;
        const inP = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 140 } });
        const x = interpolate(inP, [0, 1], [-80, 0]);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              marginTop: 40,
              opacity: inP,
              transform: `translateX(${x}px)`,
            }}
          >
            <div
              style={{
                width: 70,
                height: 70,
                borderRadius: 18,
                background: "rgba(255,80,80,0.12)",
                border: "1px solid rgba(255,80,80,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                color: "#ff5050",
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              ✕
            </div>
            <div
              style={{
                fontSize: 56,
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
