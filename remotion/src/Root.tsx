import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";
import { FunnyVideo } from "./funny/FunnyVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="main"
        component={MainVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="funny"
        component={FunnyVideo}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
