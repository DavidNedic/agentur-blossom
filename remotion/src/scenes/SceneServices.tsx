import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../components/theme";

const services = [
  { icon: "◐", title: "Web Dizajn", desc: "Moderni, brzi sajtovi" },
  { icon: "↗", title: "SEO", desc: "Prva strana Google-a" },
  { icon: "✦", title: "Marketing", desc: "Više klijenata mesečno" },
  { icon: "▣", title: "Aplikacije", desc: "Lojalnost i narudžbine" },
];

export const SceneServices: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 20, stiffness: 160 } });

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
          fontSize: 30,
          color: COLORS.accent,
          letterSpacing: 4,
          fontWeight: 700,
          opacity: titleIn,
          marginBottom: 24,
        }}
      >
        SVE NA JEDNOM MESTU
      </div>
      <div
        style={{
          fontSize: 88,
          fontWeight: 800,
          color: COLORS.text,
          letterSpacing: -2,
          lineHeight: 1.05,
          opacity: titleIn,
          transform: `translateY(${interpolate(titleIn, [0, 1], [30, 0])}px)`,
          marginBottom: 70,
        }}
      >
        Tvoj digitalni partner.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {services.map((s, i) => {
          const delay = 22 + i * 14;
          const inP = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 160 } });
          const y = interpolate(inP, [0, 1], [60, 0]);
          return (
            <div
              key={i}
              style={{
                background: "rgba(17,24,39,0.85)",
                border: "1px solid rgba(180,240,50,0.2)",
                borderRadius: 24,
                padding: "36px 30px",
                opacity: inP,
                transform: `translateY(${y}px)`,
              }}
            >
              <div style={{ fontSize: 72, marginBottom: 12, color: COLORS.accent, lineHeight: 1, fontWeight: 700 }}>{s.icon}</div>
              <div
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: COLORS.text,
                  marginBottom: 8,
                  letterSpacing: -0.5,
                }}
              >
                {s.title}
              </div>
              <div style={{ fontSize: 24, color: COLORS.muted, fontWeight: 500 }}>{s.desc}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
