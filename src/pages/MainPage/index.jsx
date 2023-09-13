import { useState } from "react";

import Wheel from "../../components/Wheel";

import logoIcon from "/imgs/logo.png";
import repeatIcon from "/imgs/repeat.png";
import suiIcon from "/imgs/sui.png";
import codesvgIcon from "/imgs/code-svgrepo.png";
import chatsendIcon from "/imgs/chat-send.png";
import chip1Icon from "/imgs/chip-1.png";
import chip2Icon from "/imgs/chip-2.png";
import chip5Icon from "/imgs/chip-5.png";
import chip10Icon from "/imgs/chip-10.png";
import chip25Icon from "/imgs/chip-25.png";
import chip50Icon from "/imgs/chip-50.png";
import profileIcon from "/imgs/profile.png";

const MainPage = () => {
  const rouletteWheelNumbers = [
    0, 32, 15, 19, 4, 21, 2, 25,
    17, 34, 6, 27, 13, 36, 11,
    30, 8, 23, 10, 5, 24, 16, 33,
    1, 20, 14, 31, 9, 22, 18, 29,
    7, 28, 12, 35, 3, 26
  ];

  const [number, setNumber] = useState(null);

  const [chat, setChat] = useState("");

  return (
    <>
      <section className="flex flex-col justify-between min-h-screen bg-primary">
        <section className="flex flex-col px-14 pt-8 2xl:pt-12">
          <div className="flex flex-row justify-between bg-secondary rounded-3xl px-12 py-4 font-[Poppins-Regular]">
            <img className="w-[320px] h-fit my-auto" src={logoIcon} />
            <div className="flex flex-row gap-6 items-center">
              <div className="flex flex-row gap-4 items-center">
                <img className="w-6" src={suiIcon} />
                <p className="text-primary text-md font-bold">$0.4982</p>
              </div>
              <button className="flex flex-row gap-4 items-center bg-[#060606] px-4 h-10 rounded-md">
                <p className="text-primary text-sm font-bold">BUY SUI</p>
                <img className="w-6" src={repeatIcon} />
              </button>
              <button className="bg-wallet-color px-6 h-10 text-primary text-sm font-bold rounded-md uppercase">
                connect wallet
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center px-6 mt-10 2xl:mt-20 gap-10">
            <div className="flex flex-col gap-4 font-[monumentextended-regular]">
              <p className="text-md text-primary">MY RECENT SPINS</p>
              <div className="flex flex-col gap-2 px-6 py-6 bg-secondary rounded-lg">
                <div className="flex flex-row items-center px-4 py-3 gap-4 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-red py text-md leading-7 text-primary rounded-xl w-10 text-center">
                    33
                  </p>
                  <div className="flex flex-row gap-2 text-md text-number-green">
                    <p>+</p>
                    <p>10</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row items-center px-4 py-3 gap-4 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-green py text-md leading-7 text-primary rounded-xl w-10 text-center">
                    0
                  </p>
                  <div className="flex flex-row gap-2 text-md text-number-red">
                    <p>-</p>
                    <p>5</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row items-center px-4 py-3 gap-4 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-black py text-md leading-7 text-primary rounded-xl w-10 text-center">
                    18
                  </p>
                  <div className="flex flex-row gap-2 text-md text-number-green">
                    <p>+</p>
                    <p>10</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row items-center px-4 py-3 gap-4 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-red py text-md leading-7 text-primary rounded-xl w-10 text-center">
                    33
                  </p>
                  <div className="flex flex-row gap-2 text-md text-number-green">
                    <p>+</p>
                    <p>10</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row items-center px-4 py-3 gap-4 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-green py text-md leading-7 text-primary rounded-xl w-10 text-center">
                    0
                  </p>
                  <div className="flex flex-row gap-2 text-md text-number-red">
                    <p>-</p>
                    <p>5</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row items-center px-4 py-3 gap-4 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-black py text-md leading-7 text-primary rounded-xl w-10 text-center">
                    18
                  </p>
                  <div className="flex flex-row gap-2 text-md text-number-green">
                    <p>+</p>
                    <p>10</p>
                    <p>SUI</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-row justify-between w-full items-center">
                <div className="flex flex-row gap-4 items-center bg-secondary rounded-md px-4 py-1.5">
                  <p className="text-sm font-bold text-primary font-[Poppins-Regular]">
                    Proof of fairness
                  </p>
                  <img className="w-6 h-fit" src={codesvgIcon} />
                </div>
                <div className="flex flex-row gap-4 items-center bg-secondary rounded-lg px-5 py-3 font-[monumentextended-regular]">
                  <p className="text-md text-primary uppercase">recent spins</p>
                  <div className="flex flex-row gap-1">
                    <p className="bg-number-red py text-md leading-7 text-primary rounded-xl w-10 text-center">
                      33
                    </p>
                    <p className="bg-number-black py text-md leading-7 text-primary rounded-xl w-10 text-center">
                      18
                    </p>
                    <p className="bg-number-green py text-md leading-7 text-primary rounded-xl w-10 text-center">
                      0
                    </p>
                    <p className="bg-number-red py text-md leading-7 text-primary rounded-xl w-10 text-center">
                      11
                    </p>
                    <p className="bg-number-red py text-md leading-7 text-primary rounded-xl w-10 text-center">
                      9
                    </p>
                    <p className="bg-number-black py text-md leading-7 text-primary rounded-xl w-10 text-center">
                      2
                    </p>
                    <p className="bg-number-black py text-md leading-7 text-primary rounded-xl w-10 text-center">
                      10
                    </p>
                    <p className="bg-number-black py text-md leading-7 text-primary rounded-xl w-10 text-center">
                      28
                    </p>
                    <p className="bg-number-black py text-md leading-7 text-primary rounded-xl w-10 text-center">
                      16
                    </p>
                    <p className="bg-number-red py text-md leading-7 text-primary rounded-xl w-10 text-center">
                      1
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative h-[calc(60vh)] 2xl:h-[calc(50vh)] bg-[url('/imgs/roulette-background.png')] bg-contain bg-no-repeat bg-center">
                <Wheel rouletteData = {rouletteWheelNumbers} number = {number} />
                <div className="absolute flex flex-row gap-4 left-[50%] top-[75%]">
                  <img
                    className="w-12 2xl:w-14 cursor-pointer"
                    src={chip1Icon}
                  />
                  <img
                    className="w-12 2xl:w-14 cursor-pointer"
                    src={chip2Icon}
                  />
                  <img
                    className="w-12 2xl:w-14 cursor-pointer"
                    src={chip5Icon}
                  />
                  <img
                    className="w-12 2xl:w-14 cursor-pointer"
                    src={chip10Icon}
                  />
                  <img
                    className="w-12 2xl:w-14 cursor-pointer"
                    src={chip25Icon}
                  />
                  <img
                    className="w-12 2xl:w-14 cursor-pointer"
                    src={chip50Icon}
                  />
                </div>
              </div>
              <div className="flex flex-nowrap px-8 py-4 bg-secondary gap-6 rounded-xl font-[monumentextended-regular] text-ellipsis whitespace-nowrap overflow-hidden">
                <div className="flex flex-row gap-3 items-center min-w-fit">
                  <div className="flex flex-row gap-3">
                    <img className="w-8 h-fit" src={profileIcon} />
                    <div className="flex flex-col">
                      <p className="text-sm text-primary">Player10</p>
                      <p className="text-[8px] text-primary">0x36df...6b69</p>
                    </div>
                  </div>
                  <div className="w-[2px] h-full bg-[#323232]"></div>
                  <div className="flex flex-row gap-2 text-sm text-number-green">
                    <p>+</p>
                    <p>10</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row gap-3 items-center min-w-fit">
                  <div className="flex flex-row gap-3">
                    <img className="w-8 h-fit" src={profileIcon} />
                    <div className="flex flex-col">
                      <p className="text-sm text-primary">coinfipking</p>
                      <p className="text-[8px] text-primary">0x36df...6b69</p>
                    </div>
                  </div>
                  <div className="w-[2px] h-full bg-[#323232]"></div>
                  <div className="flex flex-row gap-2 text-sm text-number-red">
                    <p>-</p>
                    <p>5</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row gap-3 items-center min-w-fit">
                  <div className="flex flex-row gap-3">
                    <img className="w-8 h-fit" src={profileIcon} />
                    <div className="flex flex-col">
                      <p className="text-sm text-primary">Lividassasin</p>
                      <p className="text-[8px] text-primary">0x36df...6b69</p>
                    </div>
                  </div>
                  <div className="w-[2px] h-full bg-[#323232]"></div>
                  <div className="flex flex-row gap-2 text-sm text-number-red">
                    <p>-</p>
                    <p>5</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row gap-3 items-center min-w-fit">
                  <div className="flex flex-row gap-3">
                    <img className="w-8 h-fit" src={profileIcon} />
                    <div className="flex flex-col">
                      <p className="text-sm text-primary">Honeywoman</p>
                      <p className="text-[8px] text-primary">0x36df...6b69</p>
                    </div>
                  </div>
                  <div className="w-[2px] h-full bg-[#323232]"></div>
                  <div className="flex flex-row gap-2 text-sm bg-clip-text text-transparent bg-gradient-to-r from-[#C92A34]">
                    <p>-</p>
                    <p>5</p>
                    <p>SUI</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden 2xl:flex flex-col gap-2">
              <p className="text-md text-primary uppercase font-[monumentextended-regular]">
                live chat
              </p>
              <div className="flex flex-col justify-between gap-4 px-6 py-4 bg-secondary rounded-lg h-[450px] w-[300px]">
                <div className="flex flex-col gap-4 font-[Poppins-Regular]">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="w-1.5 h-10 bg-[#56BAD7] rounded-sm"></div>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-chat-green uppercase">
                          username100
                        </p>
                        <p className="text-sm text-primary">
                          Hey guys, how is it going?
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#4E6670] h-[1px]"></div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="w-1.5 h-10 bg-[#E54545] rounded-sm"></div>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-chat-green uppercase">
                          mrfuddies10
                        </p>
                        <p className="text-sm text-primary">
                          Going good thanks, hbu?
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#4E6670] h-[1px]"></div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="w-1.5 h-10 bg-[#56BAD7] rounded-sm"></div>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-chat-green uppercase">
                          username100
                        </p>
                        <p className="text-sm text-primary">
                          Glad to hear that. LFG! XD
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#4E6670] h-[1px]"></div>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="relative bg-[#060606] rounded-lg text-sm text-primary pl-4 py-4 focus:outline-none font-[Poppins-Regular] w-full"
                    placeholder="Message here"
                    value={chat}
                    onChange={(e) => setChat(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute top-0 bottom-0 m-auto h-fit right-2 bg-[#2CB0EE] hover:bg-blue-800 rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
                  >
                    <img className="w-6 h-fit" src={chatsendIcon} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="h-2 bg-[#1E1E1E]"></section>
      </section>
    </>
  );
};

export default MainPage;
