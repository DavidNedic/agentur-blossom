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

  const titleIn = spring({ frame, fps, config: { damping: 18, stiffness: 180 } });

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
          marginBottom: 60,
        }}
      >
        Tvoj digitalni partner.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {services.map((s, i) => {
          const delay = 14 + i * 8;
          const inP = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 180 } });
          const y = interpolate(inP, [0, 1], [80, 0]);
          const rot = interpolate(inP, [0, 1], [-8, 0]);
          const iconSpin = interpolate(
            spring({ frame: frame - delay - 4, fps, config: { damping: 18, stiffness: 120 } }),
            [0, 1],
            [180, 0]
          );
          return (
            <div
              key={i}
              style={{
                background: "linear-gradient(135deg, rgba(17,24,39,0.95), rgba(17,24,39,0.6))",
                border: "1px solid rgba(180,240,50,0.3)",
                borderRadius: 24,
                padding: "32px 28px",
                opacity: inP,
                transform: `translateY(${y}px) rotate(${rot}deg)`,
                boxShadow: `0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  marginBottom: 12,
                  color: COLORS.accent,
                  lineHeight: 1,
                  fontWeight: 700,
                  transform: `rotate(${iconSpin}deg)`,
                  textShadow: `0 0 30px ${COLORS.accent}66`,
                }}
              >
                {s.icon}
              </div>
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
