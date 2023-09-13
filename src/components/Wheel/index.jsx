const Wheel = (props) => {
  const { rouletteData, number } = props;
  return (
    <div className="absolute w-[35%] 2xl:w-[40%] h-[100%] m-auto top-0 bottom-0 bg-[url('/imgs/roulette-outline.png')] bg-contain bg-no-repeat bg-center">
      <div className="absolute w-[63%] 2xl:w-[65%] h-[100%] m-auto top-[-20px] 2xl:top-[-25px] bottom-0 left-1.5 2xl:left-2.5 right-0 bg-[url('/imgs/roulette-numberpad.png')] bg-contain bg-no-repeat bg-center animate-spin"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[length:380px_380px] will-change-transform rotate-0">
        <div
          className="absolute w-[14px] h-[14px] rounded-[7px] top-[40%] left-1/2 m-[-7px] will-change-transform translate-y-[-116px]"
          style={{
            background: "#fff radial-gradient(circle at 5px 5px, #fff, #444)",
            boxShadow: "1px 1px 4px #000",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Wheel;