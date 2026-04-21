import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 5: Browser mockup zooms in showing finished site, with checkmark pills popping
export const SceneDelivery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const browserIn = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const tilt = interpolate(browserIn, [0, 1], [-12, -3]);
  const scale = interpolate(browserIn, [0, 1], [0.5, 1]);

  const titleIn = spring({ frame: frame - 10, fps, config: { damping: 16 } });

  const checks = [
    { t: "Responsive", d: 30 },
    { t: "SEO", d: 42 },
    { t: "Brz hosting", d: 54 },
    { t: "Forme", d: 66 },
  ];

  return (
    <AbsoluteFill
      style={{
        fontFamily: jakarta.fontFamily,
        padding: "120px 60px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: 34,
          color: COLORS.accent,
          letterSpacing: 5,
          fontWeight: 800,
          opacity: titleIn,
          marginBottom: 18,
        }}
      >
        ZA 48 SATI
      </div>
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: -2,
          textAlign: "center",
          lineHeight: 1.02,
          opacity: titleIn,
          marginBottom: 50,
        }}
      >
        Sajt je live.
      </div>

      <div
        style={{
          width: 820,
          background: "#0e1117",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(180,240,50,0.25)`,
          transform: `scale(${scale}) rotate(${tilt}deg)`,
          opacity: browserIn,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 18px",
            background: "#181c24",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#28c840" }} />
          <div
            style={{
              marginLeft: 16,
              flex: 1,
              background: "#0a0d12",
              borderRadius: 10,
              padding: "8px 14px",
              fontSize: 22,
              color: COLORS.muted,
              fontWeight: 600,
            }}
          >
            tvojadomena.rs
          </div>
        </div>
        <div style={{ padding: "40px 36px 60px" }}>
          <div
            style={{
              fontSize: 22,
              color: COLORS.accent,
              fontWeight: 800,
              letterSpacing: 3,
              marginBottom: 14,
            }}
          >
            TVOJ BREND
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.05,
              letterSpacing: -1.5,
              marginBottom: 20,
            }}
          >
            Sjajno. Brzo.
            <br /> Tvoje.
          </div>
          <div
            style={{
              display: "inline-block",
              padding: "14px 24px",
              background: COLORS.accent,
              color: "#0a0d12",
              borderRadius: 999,
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            Krenimo →
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 70,
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {checks.map((c, i) => {
        const p = spring({ frame: frame - c.d, fps, config: { damping: 10, stiffness: 220 } });
        const positions: Array<React.CSSProperties & { rot: number }> = [
          { top: 200, left: 40, rot: -8 },
          { top: 280, right: 30, rot: 6 },
          { bottom: 240, left: 30, rot: 5 },
          { bottom: 180, right: 50, rot: -7 },
        ];
        const pos = positions[i];
        const { rot, ...stylePos } = pos;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...stylePos,
              background: "rgba(180,240,50,0.18)",
              border: `2px solid ${COLORS.accent}`,
              padding: "12px 22px",
              borderRadius: 999,
              fontSize: 32,
              fontWeight: 800,
              color: COLORS.accent,
              opacity: p,
              transform: `scale(${interpolate(p, [0, 1], [0.4, 1])}) rotate(${rot}deg)`,
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 10px 30px rgba(180,240,50,0.3)",
            }}
          >
            <span style={{ fontSize: 28 }}>✓</span> {c.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
