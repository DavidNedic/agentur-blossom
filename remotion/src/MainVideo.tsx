import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { PersistentBackground } from "./components/PersistentBackground";
import { SceneHook } from "./scenes/SceneHook";
import { SceneProblem } from "./scenes/SceneProblem";
import { SceneServices } from "./scenes/SceneServices";
import { ScenePackages } from "./scenes/ScenePackages";
import { SceneCTA } from "./scenes/SceneCTA";

// 15s @ 30fps = 450 frames
// Scenes: 90 + 75 + 90 + 90 + 105 = 450, transitions overlap (~14f each, 4 transitions = -56)
// So we need: scenes total + transition overlap = 450
// 5 scenes: 100 + 90 + 100 + 100 + 116 = 506; minus 4*14 = 450
export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <PersistentBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneHook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneProblem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneServices />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence durationInFrames={100}>
          <ScenePackages />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence durationInFrames={116}>
          <SceneCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
