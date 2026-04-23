import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Audio, staticFile } from "remotion";
import { COLORS, jakarta } from "../../components/theme";

// Scene 2: Konkurrencija pumpa — zoom + airhorn
export const SceneBrainrot2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 10 } });
  const arrows = spring({ frame: frame - 10, fps, config: { damping: 8, stiffness: 200 } });
  const stockPump = interpolate(frame, [0, 60], [0.3, 1.4]);

  return (
    <AbsoluteFill style={{ fontFamily: jakarta.fontFamily, justifyContent: "center", alignItems: "center", padding: 60 }}>
      <Audio src={staticFile("audio/airhorn.wav")} volume={0.5} />

      <div
        style={{
          fontSize: 110,
          fontWeight: 800,
          color: "#fff",
          textAlign: "center",
          letterSpacing: -3,
          opacity: titleIn,
          transform: `scale(${interpolate(titleIn, [0, 1], [0.7, 1])})`,
          marginBottom: 40,
          textShadow: "6px 6px 0 #000",
        }}
      >
        Konkurencija:
      </div>

      {/* Fake stock chart pumping */}
      <svg width={800} height={500} viewBox="0 0 800 500" style={{ transform: `scale(${interpolate(arrows, [0,1],[0.6,1])})`, opacity: arrows }}>
        <defs>
          <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.6" />
            <stop offset="100%" stopColor={COLORS.accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {[0,1,2,3,4].map(i => (
          <line key={i} x1="0" x2="800" y1={i*100} y2={i*100} stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        ))}
        {/* Path */}
        {(() => {
          const points: string[] = [];
          const fillPoints: string[] = ['M 0 500'];
          const N = 30;
          for (let i = 0; i <= N; i++) {
            const x = (i/N) * 800;
            const baseY = 450 - (i/N) * 350 * Math.min(frame / 60, 1);
            const wobble = Math.sin(i * 1.5 + frame * 0.3) * 8;
            const y = baseY + wobble;
            points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
            fillPoints.push(`L ${x} ${y}`);
          }
          fillPoints.push('L 800 500 Z');
          return (
            <>
              <path d={fillPoints.join(' ')} fill="url(#g)" />
              <path d={points.join(' ')} stroke={COLORS.accent} strokeWidth="6" fill="none" strokeLinejoin="round" />
            </>
          );
        })()}
      </svg>

      {/* UP arrows */}
      {[0,1,2].map(i => {
        const a = spring({ frame: frame - 15 - i*4, fps, config: { damping: 7 } });
        return (
          <div key={i}
            style={{
              position: "absolute",
              top: 300 + i*40,
              right: 80 + i*60,
              fontSize: 140,
              color: COLORS.accent,
              opacity: a,
              transform: `translateY(${interpolate(a, [0,1], [60, 0])}px) rotate(${i*5-5}deg)`,
              fontWeight: 800,
              textShadow: "4px 4px 0 #000",
            }}
          >
            ↑
          </div>
        );
      })}

      {/* Caption bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          fontSize: 64,
          fontWeight: 800,
          color: "#000",
          background: COLORS.accent,
          padding: "14px 28px",
          letterSpacing: -1,
          transform: `rotate(-2deg) scale(${stockPump > 1 ? 1.05 : 1})`,
          boxShadow: "8px 8px 0 #000",
        }}
      >
        Ti: 0 poseta
      </div>
    </AbsoluteFill>
  );
};
