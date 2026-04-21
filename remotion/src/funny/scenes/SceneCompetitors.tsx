import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 2: "Druge agencije" — comically slow agency labels
export const SceneCompetitors: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 200 } });

  const agencies = [
    { name: "Agencija A", time: "3 meseca", icon: "ZZZ" },
    { name: "Agencija B", time: "6 nedelja", icon: "..." },
    { name: "Agencija C", time: "+ skriveni troškovi", icon: "$$$" },
  ];

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "180px 70px",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: "#fff",
          lineHeight: 1.0,
          letterSpacing: -2,
          marginBottom: 16,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [40, 0])}px)`,
        }}
      >
        Druge "agencije":
      </div>
      <div
        style={{
          fontSize: 34,
          color: COLORS.muted,
          marginBottom: 50,
          opacity: titleIn,
          fontStyle: "italic",
        }}
      >
        (čekaj... još malo... još par nedelja...)
      </div>

      {agencies.map((a, i) => {
        const delay = 14 + i * 14;
        const p = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 180 } });
        const x = interpolate(p, [0, 1], [-200, 0]);
        const tilt = i % 2 === 0 ? -1.2 : 1.2;
        const jiggle = Math.sin((frame - delay) * 0.3) * 2;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255,255,255,0.04)",
              border: "1px dashed rgba(255,255,255,0.2)",
              borderRadius: 24,
              padding: "26px 32px",
              marginBottom: 22,
              opacity: p,
              transform: `translateX(${x}px) rotate(${tilt}deg)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: COLORS.muted,
                  background: "rgba(255,255,255,0.06)",
                  padding: "8px 14px",
                  borderRadius: 12,
                  letterSpacing: 2,
                }}
              >
                {a.icon}
              </span>
              <span style={{ fontSize: 44, fontWeight: 700, color: "#fff" }}>{a.name}</span>
            </div>
            <span
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: "#ff5070",
                transform: `rotate(${jiggle}deg)`,
              }}
            >
              {a.time}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
