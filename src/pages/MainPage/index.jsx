import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import clsx from "clsx";
import { toast } from "react-toastify";

import * as env from "../../env";

import Wheel from "../../components/Wheel";
import Board from "../../components/Board";
import ProgressBar from "../../components/ProgressBar";

import { GameStages } from "../../constant/global";

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
import closeIcon from "/imgs/close.png";
import ethosIcon from "/imgs/ethos.png";
import martianIcon from "/imgs/martian.png";
import suietIcon from "/imgs/suiet.png";

const socketServer = io(env.SERVER_URL);

const rouletteWheelNumbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const MainPage = () => {
  const [number, setNumber] = useState({ next: null });
  const [selectedChip, setSelectedChip] = useState(null);
  const [placedChips, setPlacedChips] = useState(new Map());
  const [stage, setStage] = useState(GameStages.PLACE_BET);
  const [endTime, setEndTime] = useState(0);
  const [time_remaining, setTimeRemaining] = useState(0);
  const [depositedAmount, setDepositedAmount] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [progressCountdown, setProgressCountdown] = useState(0);
  const [winners, setWinners] = useState([]);
  const [history, setHistory] = useState([]);

  const [chat, setChat] = useState("");
  const [walletConnectDialogView, setWalletConnectDialogView] = useState(false);

  useEffect(() => {
    socketServer.open();

    socketServer.on("stage-change", (data) => {
      console.log("State-Change Event: Occured");

      const gameData = JSON.parse(data);
      console.log("------gameData--------");
      console.log(gameData);
      setGameData(gameData);
      if (stage == GameStages.WINNERS - 1) clearBet();
    });

    socketServer.on("connect", () => {
      console.log("Enter Event: Occured");
      socketServer.emit("enter", "0.0.3680385");
      // this.setState({ username: this.props.username }, () => {
      //   console.log('Enter Event: Occured');
      //   socketServer.emit("enter", this.state.username);
      // });
    });
  });

  const getBalance = (gameData, wallet_address) => {
    const balances = gameData.balances;
    if (balances.length > 0) {
      for (let i = 0; i < balances.length; i++) {
        if (balances[i].wallet_address == wallet_address) {
          console.log("This Wallet's Balance: ", balances[i].balance);
          return balances[i].balance;
        }
      }
    } else {
      return 0;
    }
  };

  const setGameData = (gameData) => {
    setDepositedAmount(getBalance(gameData, walletAddress));
    console.log("depositedAmount: ", getBalance(gameData, walletAddress));

    if (gameData.stage === GameStages.NO_MORE_BETS) {
      // PLACE BET from 25 to 35
      const endTime = 35;
      const nextNumber = gameData.value;
      setEndTime(endTime);
      setProgressCountdown(endTime - gameData.time_remaining);
      setNumber({ next: nextNumber });
      setStage(gameData.stage);
      setTimeRemaining(gameData.time_remaining);
    } else if (gameData.stage === GameStages.WINNERS) {
      // PLACE BET from 35 to 59
      const endTime = 59;
      if (gameData.wins.length > 0) {
        setEndTime(endTime);
        setProgressCountdown(endTime - gameData.time_remaining);
        setWinners(gameData.wins);
        setStage(gameData.stage);
        setTimeRemaining(gameData.time_remaining);
        setHistory(gameData.history);
      } else {
        setEndTime(endTime);
        setProgressCountdown(endTime - gameData.time_remaining);
        setStage(gameData.stage);
        setTimeRemaining(gameData.time_remaining);
        setHistory(gameData.history);
      }
    } else {
      // PLACE BET from 0 to 25
      const endTime = 25;

      setEndTime(endTime);
      setProgressCountdown(endTime - gameData.time_remaining);
      setStage(gameData.stage);
      setTimeRemaining(gameData.time_remaining);
    }
  };

  const clearBet = () => {
    setPlacedChips(new Map());
  };

  const onCellClick = (item) => {
    console.log("------------onCellClick-----------");
    console.log(stage);
    if (stage !== GameStages.PLACE_BET) return;
    let currentChips = placedChips;
    let currentChipIterator = currentChips.values();
    let placedSum = 0;
    let curIteratorValue = currentChipIterator.next().value;
    console.log(curIteratorValue);
    while (curIteratorValue !== undefined) {
      placedSum += curIteratorValue.sum;
      curIteratorValue = currentChipIterator.next().value;
      console.log(curIteratorValue);
    }
    let chipValue = selectedChip;
    console.log(chipValue);
    if (chipValue === 0 || chipValue === null || chipValue === undefined) {
      toast.error("You should select the chip.");
      return;
    }
    let currentChip = {};
    currentChip.item = item;
    currentChip.sum = chipValue;

    if (currentChips.get(item) !== undefined) {
      currentChip.sum += currentChips.get(item).sum;
    }

    //console.log(currentChips[item]);
    currentChips.set(item, currentChip);
    setPlacedChips(currentChips);
  };

  const onChipClick = (chip) => {
    if (chip != null) {
      setSelectedChip(chip);
    }
  };

  return (
    <>
      <section className="relative flex flex-col justify-between min-h-screen bg-primary">
        <section className="flex flex-col px-14 pt-8 2xl:pt-12">
          <div className="flex flex-row justify-between bg-secondary rounded-3xl px-12 py-4 font-[Poppins-Regular]">
            <img className="w-[320px] h-fit my-auto" src={logoIcon} />
            <div className="flex flex-row gap-6 items-center">
              <div className="flex flex-row gap-4 items-center">
                <img className="w-6 h-fit" src={suiIcon} />
                <p className="text-primary text-md font-bold">$0.4982</p>
              </div>
              <button className="flex flex-row gap-4 items-center bg-[#060606] px-4 h-10 rounded-md">
                <p className="text-primary text-sm font-bold">BUY SUI</p>
                <img className="w-6" src={repeatIcon} />
              </button>
              <button
                className="bg-wallet-color px-6 h-10 text-primary text-sm font-bold rounded-md uppercase"
                onClick={() => setWalletConnectDialogView(true)}
              >
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
                <Wheel rouletteData={rouletteWheelNumbers} number={number} />
                <Board
                  onCellClick={onCellClick}
                  chipsData={{
                    selectedChip: selectedChip,
                    placedChips: placedChips,
                  }}
                  rouletteData={rouletteWheelNumbers}
                />
                <div className="absolute flex flex-row gap-4 left-[50%] top-[75%]">
                  <img
                    className={clsx(
                      "w-12 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                      selectedChip === 1 ? "chip_selected" : ""
                    )}
                    onClick={() => onChipClick(1)}
                    src={chip1Icon}
                  />
                  <img
                    className={clsx(
                      "w-12 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                      selectedChip === 2 ? "chip_selected" : ""
                    )}
                    onClick={() => onChipClick(2)}
                    src={chip2Icon}
                  />
                  <img
                    className={clsx(
                      "w-12 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                      selectedChip === 5 ? "chip_selected" : ""
                    )}
                    onClick={() => onChipClick(5)}
                    src={chip5Icon}
                  />
                  <img
                    className={clsx(
                      "w-12 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                      selectedChip === 10 ? "chip_selected" : ""
                    )}
                    onClick={() => onChipClick(10)}
                    src={chip10Icon}
                  />
                  <img
                    className={clsx(
                      "w-12 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                      selectedChip === 25 ? "chip_selected" : ""
                    )}
                    onClick={() => onChipClick(25)}
                    src={chip25Icon}
                  />
                  <img
                    className={clsx(
                      "w-12 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                      selectedChip === 50 ? "chip_selected" : ""
                    )}
                    onClick={() => onChipClick(50)}
                    src={chip50Icon}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-4">
                  <button className="bg-wallet-color px-6 h-10 text-primary text-sm font-bold rounded-md uppercase">
                    deposit
                  </button>
                  <button className="bg-wallet-color px-6 h-10 text-primary text-sm font-bold rounded-md uppercase">
                    withdraw
                  </button>
                </div>
                <ProgressBar
                  stage={stage}
                  maxDuration={endTime}
                  currentDuration={time_remaining}
                />
                <div className="flex flex-row gap-4">
                  <button className="bg-wallet-color px-6 h-10 text-primary text-sm font-bold rounded-md uppercase">
                    place bet
                  </button>
                  <button className="bg-wallet-color px-6 h-10 text-primary text-sm font-bold rounded-md uppercase">
                    clear bet
                  </button>
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
      {walletConnectDialogView === true && (
        <div
          className="fixed bg-blend-lighten top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm"
          onClick={() => setWalletConnectDialogView(false)}
        >
          <div className="absolute left-0 right-0 top-0 bottom-0 m-auto w-1/2 h-1/2 bg-[url('/imgs/background.png')] bg-contain bg-no-repeat bg-center" onClick={(e) => e.stopPropagation()}>
            <img
              className="absolute top-8 right-3 w-4 h-fit cursor-pointer"
              src={closeIcon}
              onClick={() => setWalletConnectDialogView(false)}
            />
            <div className="flex flex-col gap-4 w-1/2 h-full items-center font-[Poppins-Regular]">
              <img className="w-[320px] h-fit mt-16" src={logoIcon} />
              <div className="flex flex-row gap-2 mt-12 w-full px-14">
                <div className="flex flex-row gap-2 justify-center items-center bg-wallet rounded-md py-2 w-1/2 cursor-pointer">
                  <img className="w-6 h-fit" src={suiIcon} />
                  <p className="text-md text-primary">SUI Wallet</p>
                </div>
                <div className="flex flex-row gap-2 justify-center items-center bg-wallet rounded-md py-2 w-1/2 cursor-pointer">
                  <img className="w-6" src={ethosIcon} />
                  <p className="text-md text-primary">Ethos Wallet</p>
                </div>
              </div>
              <div className="flex flex-row gap-2 w-full px-14">
                <div className="flex flex-row gap-2 justify-center items-center bg-wallet rounded-md py-2 w-1/2 cursor-pointer">
                  <img className="w-6 h-fit" src={martianIcon} />
                  <p className="text-md text-primary">Martian</p>
                </div>
                <div className="flex flex-row gap-2 justify-center items-center bg-wallet rounded-md py-2 w-1/2 cursor-pointer">
                  <img className="w-6" src={suietIcon} />
                  <p className="text-md text-primary">Suiet Wallet</p>
                </div>
              </div>
              <div className="flex flex-row pt-6 px-16">
                <input
                  id="warning-checkbox"
                  type="checkbox"
                  className="cursor-pointer w-5 h-5 text-blue-600 bg-[#323334] border-[#323334] rounded focus:ring-0 focus:ring-offset-0"
                />
                <label
                  htmlFor="warning-checkbox"
                  className="cursor-pointer ml-2 text-xs text-[#7C7E81]"
                >
                  Gambling isn&apos;t forbidden by my local authorities and
                  I&apos;m at least 18 years old.
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainPage;
