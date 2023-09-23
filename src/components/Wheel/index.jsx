import { useEffect } from "react";
import clsx from "clsx";
import anime from "animejs";

import greenBackground from "/imgs/green-background.png";
import redBackground from "/imgs/red-background.png";

const red_number = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

const Wheel = (props) => {
  const { rouletteData, number, placeBet, betsClosing, noMoreBets, winners } =
    props;

  const totalNumbers = 38;
  const singleSpinDuration = 10000;
  const singleRotationDegree = 360 / 38;
  let lastNumber = 0;

  const getRouletteIndexFromNumber = (number) => {
    return rouletteData.indexOf(parseInt(number));
  };

  const nextNumber = (number) => {
    const value = number;
    return value;
  };

  const getRotationFromNumber = (number) => {
    var index = getRouletteIndexFromNumber(number);
    return singleRotationDegree * index;
  };

  // rotateTo randomizes the end outcome of the wheel
  // so it doesn't only end at 0 at the top
  const getRandomEndRotation = (minNumberOfSpins, maxNumberOfSpins) => {
    var rotateTo = anime.random(
      minNumberOfSpins * totalNumbers,
      maxNumberOfSpins * totalNumbers
    );

    return singleRotationDegree * rotateTo;
  };
  // calculating where the zero will be at the end of the spin
  // because we are spinning it counter clockwise we are substracting it of 360
  const getZeroEndRotation = (totalRotaiton) => {
    var rotation = 360 - Math.abs(totalRotaiton % 360);

    return rotation;
  };
  // Where the ball end position should be
  // we are calculating this based on the zero rotation
  // and how much the wheel spins
  const getBallEndRotation = (zeroEndRotation, currentNumber) => {
    return Math.abs(zeroEndRotation) + getRotationFromNumber(currentNumber);
  };
  // randomizing the number of spins that the ball should make
  // so every spin is different
  const getBallNumberOfRotations = (minNumberOfSpins, maxNumberOfSpins) => {
    var numberOfSpins = anime.random(minNumberOfSpins, maxNumberOfSpins);
    return 360 * numberOfSpins;
  };

  function spinWheel(number) {
    const bezier = [0.165, 0.84, 0.44, 1.005];
    var ballMinNumberOfSpins = 2;
    var ballMaxNumberOfSpins = 4;
    var wheelMinNumberOfSpins = 2;
    var wheelMaxNumberOfSpins = 4;

    var currentNumber = nextNumber(number);

    var lastNumberRotation = getRotationFromNumber(lastNumber.toString()); //anime.get(wheel, "rotate", "deg");

    // minus in front to reverse it so it spins counterclockwise
    var endRotation = -getRandomEndRotation(
      ballMinNumberOfSpins,
      ballMaxNumberOfSpins
    );
    var zeroFromEndRotation = getZeroEndRotation(endRotation);
    var ballEndRotation =
      getBallNumberOfRotations(wheelMinNumberOfSpins, wheelMaxNumberOfSpins) +
      getBallEndRotation(zeroFromEndRotation, currentNumber);

    // reset to the last number
    anime.set([".layer-2"], {
      rotate: function () {
        return lastNumberRotation;
      },
    });
    // reset zero
    anime.set(".ball-container", {
      rotate: function () {
        return 0;
      },
    });

    anime({
      targets: [".layer-2"],
      rotate: function () {
        return endRotation; // random number
      },
      duration: singleSpinDuration, // random duration
      easing: `cubicBezier(${bezier.join(",")})`,
      complete: function (anim) {
        lastNumber = currentNumber;
      },
    });
    // aniamte ball
    anime({
      targets: ".ball-container",
      translateY: [
        { value: 0, duration: 2000 },
        { value: 20, duration: 1000 },
        { value: 25, duration: 900 },
        { value: 50, duration: 1000 },
      ],
      rotate: [{ value: ballEndRotation, duration: singleSpinDuration }],
      loop: 1,
      easing: `cubicBezier(${bezier.join(",")})`,
    });
  }

  useEffect(() => {
    var nextNubmer = number.next;
    if (nextNubmer != null && nextNubmer !== "") {
      var nextNumberInt = parseInt(nextNubmer);
      spinWheel(nextNumberInt);
    }
  }, [number]);

  return (
    <div className="absolute w-[33%] 2xl:w-[30%] left-[3vw] m-auto top-0 bottom-0 bg-[url('/imgs/roulette-outline.png')] bg-contain bg-no-repeat bg-center">
      {placeBet === true && (
        <div className="absolute flex flex-col left-0 right-0 top-[43%] text-center text-primary uppercase font-[monumentextended-regular]">
          <p className="text-[6px] 2xl:text-[8px]">games starts in</p>
          <p className="text-3xl 2xl:text-5xl">50</p>
        </div>
      )}
      {betsClosing === true && (
        <div className="absolute flex flex-col left-0 right-0 top-[49%] text-center text-primary uppercase font-[monumentextended-regular]">
          <p className="text-[6px] 2xl:text-[8px]">bets closing</p>
        </div>
      )}
      {noMoreBets === true && (
        <div className="absolute flex flex-col left-0 right-0 top-[49%] text-center text-primary uppercase font-[monumentextended-regular]">
          <p className="text-[6px] 2xl:text-[8px]">no more bets</p>
        </div>
      )}
      {winners === true && (
        <div className="absolute flex flex-col left-0 right-0 top-[45%] text-center text-primary uppercase font-[monumentextended-regular]">
          <img className={clsx("absolute left-0 right-0 m-auto top-0 bottom-0 w-1/2", red_number.includes(number.next) === false ? "hidden" : "")} src={(number.next === 0 || number.next === 37) ? greenBackground : redBackground} />
          <p className="z-50 text-3xl 2xl:text-5xl">{number.next === 37 ? "00" : number.next}</p>
        </div>
      )}
      <div className="layer-2 absolute w-[65%] 2xl:w-[75%] h-[100%] left-0 right-0 m-auto bg-[url('/imgs/roulette-numberpad.png')] bg-contain bg-no-repeat bg-center"></div>
      <div className="ball-container absolute top-0 left-0 w-full h-full will-change-transform rotate-0">
        <div
          className="ball absolute w-[10px] h-[10px] 2xl:w-[14px] 2xl:h-[14px] rounded-[7px] top-[68%] 2xl:top-[57%] left-1/2 m-[-7px] will-change-transform translate-y-[-116px]"
          style={{
            background: "#fff radial-gradient(circle at 5px 5px, #fff, #444)",
            boxShadow: "1px 1px 4px #000",
            transform: "translate(0, -163.221px)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Wheel;
