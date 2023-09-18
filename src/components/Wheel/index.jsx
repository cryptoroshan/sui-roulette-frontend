import { useEffect } from "react";
import anime from "animejs";

const Wheel = (props) => {
  const { rouletteData, number } = props;

  const totalNumbers = 38;
  const singleSpinDuration = 10000;
  const singleRotationDegree = 360/38;
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
      }
    });
    // reset zero
    anime.set(".ball-container", {
      rotate: function () {
        return 0;
      }
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
      }
    });
    // aniamte ball
    anime({
      targets: ".ball-container",
      translateY: [
        { value: 0, duration: 2000 },
        { value: 20, duration: 1000 },
        { value: 25, duration: 900 },
        { value: 50, duration: 1000 }
      ],
      rotate: [{ value: ballEndRotation, duration: singleSpinDuration }],
      loop: 1,
      easing: `cubicBezier(${bezier.join(",")})`
    });
  }

  useEffect(() => {
    var nextNubmer = number.next;
    if (nextNubmer != null && nextNubmer !== "") {
      console.log("spinWheel");
      var nextNumberInt = parseInt(nextNubmer);
      console.log(nextNumberInt);
      spinWheel(nextNumberInt);
    }
  }, [number]);


  return (
    <div className="absolute w-[35%] left-0 right-1/2 m-auto top-0 bottom-0 bg-[url('/imgs/roulette-outline.png')] bg-contain bg-no-repeat bg-center">
      <div className="layer-2 absolute w-[63%] 2xl:w-[75%] h-[100%] left-0 right-0 m-auto bg-[url('/imgs/roulette-numberpad.png')] bg-contain bg-no-repeat bg-center"></div>
      <div className="ball-container absolute top-0 left-0 w-full h-full will-change-transform rotate-0">
        <div
          className="ball absolute w-[14px] h-[14px] rounded-[7px] top-[50%] left-1/2 m-[-7px] will-change-transform translate-y-[-116px]"
          style={{
            background: "#fff radial-gradient(circle at 5px 5px, #fff, #444)",
            boxShadow: "1px 1px 4px #000",
            transform: "translate(0, -163.221px)"
          }}
        ></div>
      </div>
    </div>
  );
};

export default Wheel;