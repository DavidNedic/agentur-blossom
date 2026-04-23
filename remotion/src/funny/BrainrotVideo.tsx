import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { FunnyBackground } from "./FunnyBackground";
import { SceneBrainrot1 } from "./scenes/SceneBrainrot1";
import { SceneBrainrot2 } from "./scenes/SceneBrainrot2";
import { SceneBrainrot3 } from "./scenes/SceneBrainrot3";
import { SceneBrainrot4 } from "./scenes/SceneBrainrot4";
import { SceneBrainrot5 } from "./scenes/SceneBrainrot5";
import { SceneBrainrot6 } from "./scenes/SceneBrainrot6";

// 6 brainrot scenes — fast cuts, ~15s @ 30fps = 450 frames
// 70 + 70 + 70 + 60 + 110 + 120 = 500 - 5 transitions*10 = 450
export const BrainrotVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <FunnyBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={70}>
          <SceneBrainrot1 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={70}>
          <SceneBrainrot2 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={70}>
          <SceneBrainrot3 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={60}>
          <SceneBrainrot4 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <SceneBrainrot5 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 10 })}
        />
        <TransitionSeries.Sequence durationInFrames={120}>
          <SceneBrainrot6 />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
