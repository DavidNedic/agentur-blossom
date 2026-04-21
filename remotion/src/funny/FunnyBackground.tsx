import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const FunnyBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Slow hue/gradient shift across the whole video
  const t = interpolate(frame, [0, durationInFrames], [0, 1]);
  const hue = interpolate(t, [0, 0.4, 0.6, 1], [220, 260, 90, 90]);
  const sat = interpolate(t, [0, 0.5, 0.55, 1], [40, 40, 80, 80]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, hsl(${hue},${sat}%,8%) 0%, hsl(${hue + 20},${sat}%,4%) 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Wobbly halftone dots */}
      <div
        style={{
          position: "absolute",
          inset: -100,
          backgroundImage: `radial-gradient(rgba(255,255,255,0.06) 2px, transparent 3px)`,
          backgroundSize: "30px 30px",
          transform: `translate(${Math.sin(frame * 0.03) * 30}px, ${Math.cos(frame * 0.025) * 30}px)`,
        }}
      />
      {/* Camera shake-y blob 1 */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-15%",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,240,50,0.25), transparent 60%)",
          filter: "blur(40px)",
          transform: `translate(${Math.sin(frame * 0.04) * 60}px, ${Math.cos(frame * 0.03) * 60}px)`,
        }}
      />
      {/* Blob 2 */}
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-20%",
          width: 950,
          height: 950,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,80,120,0.18), transparent 60%)",
          filter: "blur(40px)",
          transform: `translate(${Math.cos(frame * 0.035) * 70}px, ${Math.sin(frame * 0.04) * 60}px)`,
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
