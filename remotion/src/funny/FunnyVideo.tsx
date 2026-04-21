import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { FunnyBackground } from "./FunnyBackground";
import { SceneRant } from "./scenes/SceneRant";
import { SceneCompetitors } from "./scenes/SceneCompetitors";
import { SceneBoom } from "./scenes/SceneBoom";
import { SceneCountdown } from "./scenes/SceneCountdown";
import { SceneDelivery } from "./scenes/SceneDelivery";
import { SceneOffer } from "./scenes/SceneOffer";

// 6 scenes, total ~18s @ 30fps = 540 frames
// 90 + 90 + 60 + 110 + 100 + 130 = 580; minus 5*8 transitions = 540
export const FunnyVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <FunnyBackground />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneRant />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 8 })}
        />
        <TransitionSeries.Sequence durationInFrames={90}>
          <SceneCompetitors />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 8 })}
        />
        <TransitionSeries.Sequence durationInFrames={60}>
          <SceneBoom />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 8 })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <SceneCountdown />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 8 })}
        />
        <TransitionSeries.Sequence durationInFrames={100}>
          <SceneDelivery />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 8 })}
        />
        <TransitionSeries.Sequence durationInFrames={130}>
          <SceneOffer />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
