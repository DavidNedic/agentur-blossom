import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { FunnyBackground } from "./FunnyBackground";
import { SceneAI1 } from "./scenes/SceneAI1";
import { SceneAI2 } from "./scenes/SceneAI2";
import { SceneAI3 } from "./scenes/SceneAI3";
import { SceneAI4 } from "./scenes/SceneAI4";
import { SceneAI5 } from "./scenes/SceneAI5";
import { SceneAI6 } from "./scenes/SceneAI6";
import { SceneAI7 } from "./scenes/SceneAI7";
import { SceneAI8 } from "./scenes/SceneAI8";

// 8 scenes — fast cuts, varied transitions
// Sums: 65+75+90+85+60+95+80+110 = 660 - 7 transitions*10 = 590 frames (~19.7s)
export const AIRoastVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <FunnyBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={65}>
          <SceneAI1 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={clockWipe({ width: 1080, height: 1920 })}
          timing={linearTiming({ durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={75}>
          <SceneAI2 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneAI3 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={flip({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={85}>
          <SceneAI4 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={60}>
          <SceneAI5 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={95}>
          <SceneAI6 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={80}>
          <SceneAI7 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <SceneAI8 />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
