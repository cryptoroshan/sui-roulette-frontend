import { useEffect } from "react";
import anime from "animejs";

import { GameStages } from "../../constant/global";

const ProgressBar = ({ stage, maxDuration, currentDuration }) => {
  console.log(stage);
  useEffect(() => {
    let duration = (maxDuration - currentDuration) * 1000;
    console.log(duration);
    anime({
      targets: "progress",
      value: [0, 100],
      easing: "linear",
      autoplay: true,
      duration: duration,
    });
  }, [stage, maxDuration, currentDuration]);

  return (
    <div className="flex flex-col gap-2 items-center">
      <p className="text-sm font-bold text-primary font-[Poppins-Regular] uppercase">
        {
          (stage === GameStages.PLACE_BET) ? "place bet" : (stage === GameStages.WINNERS) ? "winners" : "no more bets"
        }
      </p>
      <progress className="progress w-[300px] h-1" value="0" max="100" />
    </div>
  );
};

export default ProgressBar;
