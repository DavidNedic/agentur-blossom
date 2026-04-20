import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../components/theme";

const packages = [
  { name: "Starter", price: "199", feat: "Landing page", days: "48h" },
  { name: "Pro", price: "399", feat: "Višestranični sajt", days: "7 dana", highlight: true },
  { name: "Premium", price: "699", feat: "E-commerce", days: "30 dana" },
];

export const ScenePackages: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 20, stiffness: 160 } });

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "180px 60px",
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
          paddingLeft: 20,
        }}
      >
        FIKSNE CENE
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
          paddingLeft: 20,
        }}
      >
        Izaberi paket.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {packages.map((p, i) => {
          const delay = 24 + i * 16;
          const inP = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 160 } });
          const x = interpolate(inP, [0, 1], [80, 0]);
          const isHi = p.highlight;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: isHi ? "rgba(180,240,50,0.12)" : "rgba(17,24,39,0.85)",
                border: isHi
                  ? `2px solid ${COLORS.accent}`
                  : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 24,
                padding: "32px 36px",
                opacity: inP,
                transform: `translateX(${x}px)`,
                boxShadow: isHi ? `0 20px 60px rgba(180,240,50,0.25)` : "none",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 800,
                    color: isHi ? COLORS.accent : COLORS.text,
                    letterSpacing: -1,
                  }}
                >
                  {p.name}
                </div>
                <div style={{ fontSize: 24, color: COLORS.muted, marginTop: 4 }}>
                  {p.feat} · {p.days}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 28, color: COLORS.muted, fontWeight: 600 }}>od</span>
                <span
                  style={{
                    fontSize: 72,
                    fontWeight: 800,
                    color: COLORS.text,
                    letterSpacing: -2,
                  }}
                >
                  {p.price}
                </span>
                <span style={{ fontSize: 36, color: COLORS.text, fontWeight: 700 }}>€</span>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
