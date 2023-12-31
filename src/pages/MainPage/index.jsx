import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import clsx from "clsx";
import { toast } from "react-toastify";
import { useWallet } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

import { getRequest, postRequest } from "../../components/api/apiRequests";

import * as env from "../../env";

import Wheel from "../../components/Wheel";
import Board from "../../components/Board";
import ProgressBar from "../../components/ProgressBar";
import LoadingLayout from "../../components/LoadingLayout";

import { GameStages } from "../../constant/global";

import logoIcon from "/imgs/logo.png";
import smallLogoIcon from "/sui roulette.png";
import repeatIcon from "/imgs/repeat.png";
import suiIcon from "/imgs/sui.png";
import codesvgIcon from "/imgs/code-svgrepo.png";
import chatsendIcon from "/imgs/chat-send.png";
import chip1Icon from "/imgs/chip-1.png";
import chip2Icon from "/imgs/chip-2.png";
import chip5Icon from "/imgs/chip-5.png";
import chip10Icon from "/imgs/chip-10.png";
import profileIcon from "/imgs/profile.png";
import closeIcon from "/imgs/close.png";
import ethosIcon from "/imgs/ethos.png";
import martianIcon from "/imgs/martian.png";
import suietIcon from "/imgs/suiet.png";
import heroswap1 from "/imgs/heroswap-1.png";
import heroswap2 from "/imgs/heroswap-2.png";
import heroswap3 from "/imgs/heroswap-3.png";
import heroswap4 from "/imgs/heroswap-4.png";
import soundonIcon from "/imgs/sound-on.png";
import soundoffIcon from "/imgs/sound-off.png";
import backIcon from "/imgs/back.png";
import musicIcon from "/imgs/music.png";
import musicMuteIcon from "/imgs/mute music.png";
import disconnectWalletIcon from "/imgs/disconnect wallet.png";
import walletIcon from "/imgs/wallet.png";

import backgroundAudio from "/sounds/jazz.mp3";
import ballSpinAudio from "/sounds/ball spin.mp3";
import chipAudio from "/sounds/chip.mp3";

const socketServer = io(env.SERVER_URL);

const rouletteWheelNumbers = [
  37, 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2, 0, 28,
  9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1,
];

let nextId = 0;

const MainPage = () => {
  const {
    select,
    connected,
    account,
    disconnect,
    configuredWallets,
    detectedWallets,
  } = useWallet();

  const wrapperRef = useRef(null);
  const chatRef = useRef(null);
  const [number, setNumber] = useState({ next: null });
  const [chipsData, setChipsData] = useState({
    selectedChip: null,
    placedChips: new Map(),
  });
  const [stage, setStage] = useState(GameStages.PLACE_BET);
  const [endTime, setEndTime] = useState(0);
  const [time_remaining, setTimeRemaining] = useState(0);
  const [depositedAmount, setDepositedAmount] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [progressCountdown, setProgressCountdown] = useState(0);

  const [loadingView, setLoadingView] = useState(false);
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [chatMessage, setChatMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [walletConnectDialogView, setWalletConnectDialogView] = useState(false);
  const [accountCreateDialogView, setAccountCreateDialogView] = useState(false);
  const [allowWalletConnect, setAllowWalletConnect] = useState(false);
  const [suiWalletInstalled, setSuiWalletInstalled] = useState(false);
  const [ethosWalletInstalled, setEthosWalletInstalled] = useState(false);
  const [martianWalletInstalled, setMartianWalletInstalled] = useState(false);
  const [suietWalletInstalled, setSuietWalletInstalled] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [heroswapDialogview, setHeroswapDialogview] = useState(false);
  const [soundon, setSoundOn] = useState(true);
  const [musicon, setMusicOn] = useState(false);
  const [placeBet, setPlaceBet] = useState(true);
  const [betsClosing, setBetsClosing] = useState(false);
  const [noMoreBets, setNoMoreBets] = useState(false);
  const [winners, setWinners] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    [...configuredWallets, ...detectedWallets].map((wallet) => {
      if (wallet.name === "Sui Wallet" && wallet.installed)
        setSuiWalletInstalled(true);
      else if (wallet.name === "Ethos Wallet" && wallet.installed)
        setEthosWalletInstalled(true);
      else if (wallet.name === "Martian Sui Wallet" && wallet.installed)
        setMartianWalletInstalled(true);
      else if (wallet.name === "Suiet" && wallet.installed)
        setSuietWalletInstalled(true);
    });
  }, [detectedWallets]);

  useEffect(() => {
    console.log(account)
    if (connected && account !== undefined) getUserInfo(account.address);
  }, [connected]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    socketServer.open();

    socketServer.on("stage-change", (data) => {
      console.log("State-Change Event: Occured");

      const gameData = JSON.parse(data);
      console.log("------gameData stage--------");
      console.log(gameData);
      setGameData(gameData);
      if (gameData.stage === GameStages.NO_MORE_BETS && soundon === true) {
        setPlaceBet(false);
        setNoMoreBets(true);
        const ballspin_audio = document.getElementById("ballSpinAudio");
        ballspin_audio.play();
      } else if (gameData.stage === GameStages.WINNERS) {
        setNoMoreBets(false);
        setWinners(true);
      } else if (gameData.stage === GameStages.PLACE_BET) {
        setWinners(false);
        setPlaceBet(true);
      }
      if (stage == GameStages.WINNERS - 1) clearBet();
    });

    socketServer.on("connect", () => {
      console.log("Enter Event: Occured");
      // socketServer.emit("enter", "0.0.3680385");
      // this.setState({ username: this.props.username }, () => {
      //   console.log('Enter Event: Occured');
      //   socketServer.emit("enter", this.state.username);
      // });
    });

    socketServer.on("receive_message", (data) => {
      const _username = data.username;
      const _message = data.message;
      setMessageList((arr) => [
        ...arr,
        { id: nextId++, username: _username, message: _message },
      ]);
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const scrollToBottom = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  const handleClickOutside = (event) => {
    try {
      if (wrapperRef && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUserInfo = async (walletAddress_) => {
    setWalletAddress(walletAddress_);
    let _res = await getRequest(
      env.SERVER_URL +
        "/api/user/get_user_info?wallet_address=" +
        walletAddress_
    );
    if (!_res) {
      toast.error("Something wrong with server!");
      setLoadingView(false);
      return;
    }
    if (!_res.result) {
      toast.error(_res.error);
      setLoadingView(false);
      return;
    }
    if (_res.data !== null) {
      if (walletConnectDialogView === true) setWalletConnectDialogView(false);

      setUsername(_res.data.username);
      setAccountCreated(true);
      socketServer.emit("enter", walletAddress_);
    } else {
      if (walletConnectDialogView === true) {
        setAccountCreateDialogView(true);
        setWalletConnectDialogView(false);
      }
    }
  };

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
        // setHistory(gameData.history);
      } else {
        setEndTime(endTime);
        setProgressCountdown(endTime - gameData.time_remaining);
        setStage(gameData.stage);
        setTimeRemaining(gameData.time_remaining);
        // setHistory(gameData.history);
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

  const clearBet = () => {};

  const onCellClick = (item) => {
    // if (stage !== GameStages.PLACE_BET) return;
    let currentChips = chipsData.placedChips;
    let currentChipIterator = currentChips.values();
    let placedSum = 0;
    let curIteratorValue = currentChipIterator.next().value;
    while (curIteratorValue !== undefined) {
      placedSum += curIteratorValue.sum;
      curIteratorValue = currentChipIterator.next().value;
    }
    let chipValue = chipsData.selectedChip;
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
    setChipsData({
      selectedChip: chipsData.selectedChip,
      placedChips: currentChips,
    });
    if (soundon === true) {
      const chip_audio = document.getElementById("chipAudio");
      chip_audio.play();
    }
  };

  const onChipClick = (chip) => {
    if (chip != null) {
      setChipsData({
        selectedChip: chip,
        placedChips: chipsData.placedChips,
      });
    }
  };

  const createAccount = async () => {
    let _res = await postRequest(env.SERVER_URL + "/api/user/create_account", {
      username: username,
      wallet_address: walletAddress,
    });
    if (!_res) {
      toast.error("Something wrong with server!");
      setLoadingView(false);
      return;
    }
    if (!_res.result) {
      toast.error(_res.error);
      setLoadingView(false);
      return;
    }
    setAccountCreateDialogView(false);
    setAccountCreated(true);
  };

  const onHandleSendMsg = () => {
    socketServer.emit("send_message", {
      username: username,
      message: chatMessage,
    });
    setChatMessage("");
  };

  return (
    <>
      <section className="relative flex flex-col justify-between min-h-screen bg-primary">
        <audio id="backgroundAudio" loop>
          <source src={backgroundAudio} type="audio/mp3" />
        </audio>
        <audio id="ballSpinAudio">
          <source src={ballSpinAudio} type="audio/mp3" />
        </audio>
        <audio id="chipAudio">
          <source src={chipAudio} type="audio/mp3" />
        </audio>
        <section className="flex flex-col px-[3vw] pt-8 2xl:pt-12">
          <div className="hidden xl:flex flex-row justify-between bg-secondary rounded-3xl px-12 py-4 font-[Poppins-Regular]">
            <img className="w-[320px] h-fit my-auto" src={logoIcon} />
            <div className="flex items-center gap-8 px-4 h-10 rounded-md bg-[#0B0B0B] border border-primary">
              <img className="w-6 h-fit" src={walletIcon} />
              <p className="text-primary text-md font-bold">0.00 SUI</p>
            </div>
            <div className="flex flex-row gap-6 items-center">
              <div className="flex flex-row gap-4 items-center">
                <img className="w-6 h-fit" src={suiIcon} />
                <p className="text-primary text-md font-bold">$0.4982</p>
              </div>
              <button
                className="flex flex-row gap-4 items-center bg-[#060606] px-4 h-10 rounded-md"
                onClick={() => setHeroswapDialogview(true)}
              >
                <p className="text-primary text-sm font-bold">BUY SUI</p>
                <img className="w-6" src={repeatIcon} />
              </button>
              {accountCreated === false ? (
                <button
                  className="bg-wallet-color px-6 h-10 text-primary text-sm font-bold rounded-md uppercase"
                  onClick={() => {
                    if (!account?.address && accountCreated === false)
                      setWalletConnectDialogView(true);
                    else if (account?.address && accountCreated === false)
                      setAccountCreateDialogView(true);
                  }}
                >
                  {!account?.address && accountCreated === false
                    ? "connect wallet"
                    : account?.address && accountCreated === false
                    ? "create account"
                    : username}
                </button>
              ) : (
                <div className="relative font-[Poppins-Regular] text-md text-primary font-bold">
                  <button
                    ref={wrapperRef}
                    className="bg-wallet-color px-6 h-10 text-primary text-sm font-bold rounded-md uppercase"
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                    }}
                  >
                    {username}
                  </button>
                  <div
                    className={clsx(
                      "absolute right-0 my-2 z-10 bg-[#23262a] divide-y divide-gray-600 rounded-xl shadow w-44",
                      showDropdown === false ? "hidden" : ""
                    )}
                  >
                    <div className="px-4 py-3 hover:cursor-pointer">
                      <p>{username}</p>
                    </div>
                    <div
                      className="flex gap-2 items-center px-4 py-3 hover:cursor-pointer"
                      onClick={() => {
                        setAccountCreated(false);
                        setAllowWalletConnect(false);
                        setUsername("");
                        disconnect();
                      }}
                    >
                      <img className="w-6 h-fit" src={disconnectWalletIcon} />
                      <p>Disconnect</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden flex flex-row justify-between bg-secondary rounded-xl px-2 py-4 font-[Poppins-Regular]">
            <img className="w-10 h-fit my-auto" src={smallLogoIcon} />
            <div className="flex flex-row gap-2 items-center">
              <div className="flex flex-row gap-2 items-center">
                <img className="w-6 h-fit" src={suiIcon} />
                <p className="text-primary text-md font-bold">$0.4982</p>
              </div>
              {accountCreated === false ? (
                <button
                  className="bg-wallet-color px-2 h-10 text-primary text-xs font-bold rounded-md uppercase"
                  onClick={() => {
                    if (!account?.address && accountCreated === false)
                      setWalletConnectDialogView(true);
                    else if (account?.address && accountCreated === false)
                      setAccountCreateDialogView(true);
                  }}
                >
                  {!account?.address && accountCreated === false
                    ? "connect wallet"
                    : account?.address && accountCreated === false
                    ? "create account"
                    : username}
                </button>
              ) : (
                <div className="relative font-[Poppins-Regular] text-md text-primary font-bold">
                  <button
                    ref={wrapperRef}
                    className="bg-wallet-color px-6 h-10 text-primary text-sm font-bold rounded-md uppercase"
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                    }}
                  >
                    {username}
                  </button>
                  <div
                    className={clsx(
                      "absolute right-0 my-2 z-10 bg-[#23262a] divide-y divide-gray-600 rounded-xl shadow w-44",
                      showDropdown === false ? "hidden" : ""
                    )}
                  >
                    <div className="px-4 py-3 hover:cursor-pointer">
                      <p>{username}</p>
                    </div>
                    <div
                      className="flex gap-2 items-center px-4 py-3 hover:cursor-pointer"
                      onClick={() => {
                        setAccountCreated(false);
                        setAllowWalletConnect(false);
                        setUsername("");
                        disconnect();
                      }}
                    >
                      <img className="w-6 h-fit" src={disconnectWalletIcon} />
                      <p>Disconnect</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mt-10 2xl:mt-20 gap-4">
            <div className="hidden xl:flex flex-col gap-4 font-[monumentextended-regular]">
              <p className="text-sm 2xl:text-md text-primary">
                MY RECENT SPINS
              </p>
              <div className="flex flex-col gap-2 px-3 py-3 bg-secondary rounded-lg">
                <div className="flex flex-row items-center px-4 py-3 gap-2 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-red py-1 text-sm text-primary rounded-xl w-10 text-center">
                    33
                  </p>
                  <div className="flex flex-row gap-2 text-md text-number-green">
                    <p>+</p>
                    <p>10</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row items-center px-4 py-3 gap-2 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-green py-1 text-sm text-primary rounded-xl w-10 text-center">
                    0
                  </p>
                  <div className="flex flex-row gap-2 text-md text-number-red">
                    <p>-</p>
                    <p>5</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row items-center px-4 py-3 gap-2 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-black py-1 text-sm text-primary rounded-xl w-10 text-center">
                    18
                  </p>
                  <div className="flex flex-row gap-2 text-md text-number-green">
                    <p>+</p>
                    <p>10</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row items-center px-4 py-3 gap-2 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-red py-1 text-sm text-primary rounded-xl w-10 text-center">
                    33
                  </p>
                  <div className="flex flex-row gap-2 text-md text-number-green">
                    <p>+</p>
                    <p>10</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row items-center px-4 py-3 gap-2 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-green py-1 text-sm text-primary rounded-xl w-10 text-center">
                    0
                  </p>
                  <div className="flex flex-row gap-2 text-md text-number-red">
                    <p>-</p>
                    <p>5</p>
                    <p>SUI</p>
                  </div>
                </div>
                <div className="flex flex-row items-center px-4 py-3 gap-2 bg-[#0E0E0E] rounded-lg">
                  <p className="bg-number-black py-1 text-sm text-primary rounded-xl w-10 text-center">
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
            <div className="flex flex-col gap-2 w-full xl:w-[55vw] 2xl:w-[1063px]">
              <div className="flex flex-row justify-between w-full items-center">
                <div className="hidden xl:flex flex-row gap-2 items-center h-10">
                  <div className="flex flex-row gap-4 items-center bg-secondary rounded-md px-4 h-10">
                    <p className="text-sm font-bold text-primary font-[Poppins-Regular]">
                      Proof of fairness
                    </p>
                    <img className="w-6 h-fit" src={codesvgIcon} />
                  </div>
                  <div
                    className="flex items-center h-full px-3 rounded-md hover:bg-secondary border border-secondary hover:cursor-pointer"
                    onClick={() => {
                      setSoundOn(!soundon);
                      document.getElementById("ballSpinAudio").muted =
                        !document.getElementById("ballSpinAudio").muted;
                      document.getElementById("chipAudio").muted =
                        !document.getElementById("chipAudio").muted;
                    }}
                  >
                    {soundon === true ? (
                      <img className="h-5 w-fit" src={soundonIcon} />
                    ) : (
                      <img className="h-5 w-fit" src={soundoffIcon} />
                    )}
                  </div>
                  <div
                    className="flex items-center h-full px-3 rounded-md hover:bg-secondary border border-secondary hover:cursor-pointer"
                    onClick={() => {
                      if (musicon === true) {
                        setMusicOn(false);
                        document.getElementById("backgroundAudio").muted = true;
                      } else {
                        setMusicOn(true);
                        const background_audio =
                          document.getElementById("backgroundAudio");
                        background_audio.muted = false;
                        background_audio.play();
                      }
                    }}
                  >
                    {musicon === true ? (
                      <img className="h-5 w-fit" src={musicIcon} />
                    ) : (
                      <img className="h-5 w-fit" src={musicMuteIcon} />
                    )}
                  </div>
                </div>
                <div className="flex flex-row w-full xl:w-auto justify-between xl:gap-4 items-center bg-secondary rounded-lg px-2 xl:px-5 py-3 font-[monumentextended-regular]">
                  <p className="text-xs xl:text-md text-primary uppercase">
                    recent spins
                  </p>
                  <div className="flex flex-row gap-1">
                    <p className="bg-number-red py-1 text-sm text-primary rounded-xl w-10 text-center">
                      33
                    </p>
                    <p className="bg-number-black py-1 text-sm text-primary rounded-xl w-10 text-center">
                      18
                    </p>
                    <p className="bg-number-green py-1 text-sm text-primary rounded-xl w-10 text-center">
                      0
                    </p>
                    <p className="bg-number-red py-1 text-sm text-primary rounded-xl w-10 text-center">
                      11
                    </p>
                    <p className="hidden 2xl:block bg-number-red py-1 text-sm text-primary rounded-xl w-10 text-center">
                      9
                    </p>
                    <p className="hidden 2xl:block bg-number-black py-1 text-sm text-primary rounded-xl w-10 text-center">
                      2
                    </p>
                    <p className="hidden 2xl:block bg-number-black py-1 text-sm text-primary rounded-xl w-10 text-center">
                      10
                    </p>
                    <p className="hidden 2xl:block bg-number-black py-1 text-sm text-primary rounded-xl w-10 text-center">
                      28
                    </p>
                    <p className="hidden 2xl:block bg-number-black py-1 text-sm text-primary rounded-xl w-10 text-center">
                      16
                    </p>
                    <p className="hidden 2xl:block bg-number-red py-1 text-sm text-primary rounded-xl w-10 text-center">
                      1
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden xl:block relative min-h-[320px] 2xl:min-h-[435px] bg-[url('/imgs/roulette-background.png')] bg-contain bg-no-repeat bg-center">
                <div className="absolute xl:w-[300px] xl:h-[300px] 2xl:w-[350px] 2xl:h-[350px]">
                  <Wheel
                    rouletteData={rouletteWheelNumbers}
                    number={number}
                    placeBet={placeBet}
                    betsClosing={betsClosing}
                    noMoreBets={noMoreBets}
                    winners={winners}
                  />
                </div>
                <Board
                  onCellClick={onCellClick}
                  chipsData={chipsData}
                  rouletteData={rouletteWheelNumbers}
                />
                <div className="absolute flex flex-row items-center gap-4 2xl:gap-6 left-[47%] 2xl:left-[48%] top-[75%]">
                  <div className="flex gap-2 2xl:gap-4">
                    <img
                      className={clsx(
                        "w-10 h-fit 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                        chipsData.selectedChip === 1 ? "chip_selected" : ""
                      )}
                      onClick={() => onChipClick(1)}
                      src={chip1Icon}
                    />
                    <img
                      className={clsx(
                        "w-10 h-fit 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                        chipsData.selectedChip === 2 ? "chip_selected" : ""
                      )}
                      onClick={() => onChipClick(2)}
                      src={chip2Icon}
                    />
                    <img
                      className={clsx(
                        "w-10 h-fit 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                        chipsData.selectedChip === 5 ? "chip_selected" : ""
                      )}
                      onClick={() => onChipClick(5)}
                      src={chip5Icon}
                    />
                    <img
                      className={clsx(
                        "w-10 h-fit 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                        chipsData.selectedChip === 10 ? "chip_selected" : ""
                      )}
                      onClick={() => onChipClick(10)}
                      src={chip10Icon}
                    />
                  </div>
                  <img
                    className="w-5 2xl:w-6 h-fit hover:cursor-pointer"
                    src={backIcon}
                  />
                  <button className="bg-[#2CB0EE] px-2 2xl:px-4 h-10 text-primary text-sm font-bold rounded-md uppercase">
                    place bet
                  </button>
                </div>
              </div>
              <div className="xl:hidden w-[350px] h-[350px] m-auto">
                <Wheel
                  rouletteData={rouletteWheelNumbers}
                  number={number}
                  placeBet={placeBet}
                  betsClosing={betsClosing}
                  noMoreBets={noMoreBets}
                  winners={winners}
                />
              </div>
              <div className="xl:hidden relative min-h-[400px] bg-[url('/imgs/mobile-roulette-background.png')] bg-contain bg-no-repeat bg-center">
                <Board
                  onCellClick={onCellClick}
                  chipsData={chipsData}
                  rouletteData={rouletteWheelNumbers}
                />
                <div className="absolute flex flex-row items-center justify-center gap-4 2xl:gap-6 left-0 right-0 bottom-20">
                  <div className="flex gap-2 2xl:gap-4">
                    <img
                      className={clsx(
                        "w-10 h-fit 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                        chipsData.selectedChip === 1 ? "chip_selected" : ""
                      )}
                      onClick={() => onChipClick(1)}
                      src={chip1Icon}
                    />
                    <img
                      className={clsx(
                        "w-10 h-fit 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                        chipsData.selectedChip === 2 ? "chip_selected" : ""
                      )}
                      onClick={() => onChipClick(2)}
                      src={chip2Icon}
                    />
                    <img
                      className={clsx(
                        "w-10 h-fit 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                        chipsData.selectedChip === 5 ? "chip_selected" : ""
                      )}
                      onClick={() => onChipClick(5)}
                      src={chip5Icon}
                    />
                    <img
                      className={clsx(
                        "w-10 h-fit 2xl:w-14 cursor-pointer hover:scale-[1.2] hover:transition hover:duration-500 hover:ease-out rounded-full",
                        chipsData.selectedChip === 10 ? "chip_selected" : ""
                      )}
                      onClick={() => onChipClick(10)}
                      src={chip10Icon}
                    />
                  </div>
                  <img
                    className="w-5 2xl:w-6 h-fit hover:cursor-pointer"
                    src={backIcon}
                  />
                  <button className="bg-[#2CB0EE] px-2 2xl:px-4 h-10 text-primary text-sm font-bold rounded-md uppercase">
                    place bet
                  </button>
                </div>
              </div>
              <div className="hidden flex flex-row justify-between">
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
              <div className="hidden flex flex-row px-8 py-4 bg-secondary gap-6 rounded-xl font-[monumentextended-regular]">
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
                <div className="flex flex-row gap-3 items-center">
                  <div className="flex flex-row gap-3">
                    <img className="w-8 h-fit" src={profileIcon} />
                    <div className="flex flex-col">
                      <p className="text-sm text-primary">Player10</p>
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
                      <p className="text-sm text-primary">Player10</p>
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
                <div className="hidden 2xl:flex flex-row gap-3 items-center min-w-fit">
                  <div className="flex flex-row gap-3">
                    <img className="w-8 h-fit" src={profileIcon} />
                    <div className="flex flex-col">
                      <p className="text-sm text-primary">Player10</p>
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
              </div>
            </div>
            <div className="hidden xl:flex flex-col gap-2">
              <p className="text-sm 2xl:text-md text-primary uppercase font-[monumentextended-regular]">
                live chat
              </p>
              <div className="flex flex-col justify-between gap-4 px-6 py-4 bg-secondary border border-[#4E6670] rounded-lg h-[450px] w-[250px] 2xl:w-[300px]">
                <div className="flex flex-col gap-4 font-[Poppins-Regular] max-h-[calc(35vh)] overflow-y-auto">
                  {messageList.map((message) => {
                    return (
                      <div key={message.id} className="flex flex-col gap-4">
                        <div className="flex flex-row gap-2 items-center">
                          <div
                            className={clsx(
                              "w-1.5 h-10 rounded-sm",
                              message.username === username
                                ? "bg-[#56BAD7]"
                                : "bg-[#E54545]"
                            )}
                          ></div>
                          <div className="flex flex-col overflow-x-hidden">
                            <p
                              className={clsx(
                                "text-sm font-bold uppercase",
                                message.username === username
                                  ? "text-chat-green"
                                  : "text-chat-red"
                              )}
                            >
                              {message.username}
                            </p>
                            <p className="text-sm text-primary">
                              {message.message}
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#4E6670] h-[1px]"></div>
                      </div>
                    );
                  })}
                  <div ref={chatRef}></div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="relative bg-[#060606] rounded-lg text-sm text-primary pl-4 pr-16 py-4 border-none focus:ring-0 font-[Poppins-Regular] w-full"
                    placeholder="Message here"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onHandleSendMsg();
                    }}
                  />
                  <button
                    type="button"
                    className="absolute top-0 bottom-0 m-auto h-fit right-2 bg-[#2CB0EE] hover:bg-blue-800 rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2"
                    onClick={() => onHandleSendMsg()}
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
          <div
            className="absolute left-0 right-0 top-0 bottom-0 m-auto w-1/2 h-1/2 bg-[url('/imgs/background.png')] bg-contain bg-no-repeat bg-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="absolute top-8 right-3 w-4 h-fit cursor-pointer"
              src={closeIcon}
              onClick={() => setWalletConnectDialogView(false)}
            />
            <div className="flex flex-col gap-4 w-1/2 h-full items-center font-[Poppins-Regular]">
              <img className="w-[320px] h-fit mt-16" src={logoIcon} />
              {!account?.address && (
                <div className="flex flex-row gap-2 mt-12 w-full px-14">
                  <div
                    className={clsx(
                      "flex flex-row gap-2 justify-center items-center bg-wallet rounded-md py-2 w-1/2",
                      allowWalletConnect === true && suiWalletInstalled === true
                        ? "cursor-pointer"
                        : ""
                    )}
                    onClick={() => {
                      if (allowWalletConnect && suiWalletInstalled) {
                        select("Sui Wallet");
                      }
                    }}
                  >
                    <img className="w-6 h-fit" src={suiIcon} />
                    <p className="text-md text-primary">SUI Wallet</p>
                  </div>
                  <div
                    className={clsx(
                      "flex flex-row gap-2 justify-center items-center bg-wallet rounded-md py-2 w-1/2",
                      allowWalletConnect === true &&
                        ethosWalletInstalled === true
                        ? "cursor-pointer"
                        : ""
                    )}
                    onClick={() => {
                      if (allowWalletConnect && ethosWalletInstalled)
                        select("Ethos Wallet");
                    }}
                  >
                    <img className="w-6" src={ethosIcon} />
                    <p className="text-md text-primary">Ethos Wallet</p>
                  </div>
                </div>
              )}
              {!account?.address && (
                <div className="flex flex-row gap-2 w-full px-14">
                  <div
                    className={clsx(
                      "flex flex-row gap-2 justify-center items-center bg-wallet rounded-md py-2 w-1/2",
                      allowWalletConnect === true &&
                        martianWalletInstalled === true
                        ? "cursor-pointer"
                        : ""
                    )}
                    onClick={() => {
                      if (allowWalletConnect && martianWalletInstalled)
                        select("Martian Sui Wallet");
                    }}
                  >
                    <img className="w-6 h-fit" src={martianIcon} />
                    <p className="text-md text-primary">Martian</p>
                  </div>
                  <div
                    className={clsx(
                      "flex flex-row gap-2 justify-center items-center bg-wallet rounded-md py-2 w-1/2",
                      allowWalletConnect === true &&
                        suietWalletInstalled === true
                        ? "cursor-pointer"
                        : ""
                    )}
                    onClick={() => {
                      if (allowWalletConnect && suietWalletInstalled)
                        select("Suiet");
                    }}
                  >
                    <img className="w-6" src={suietIcon} />
                    <p className="text-md text-primary">Suiet Wallet</p>
                  </div>
                </div>
              )}
              <div className="flex flex-row pt-6 px-16">
                <input
                  id="warning-checkbox"
                  type="checkbox"
                  className="cursor-pointer w-5 h-5 text-blue-600 bg-[#323334] border-[#323334] rounded focus:ring-0 focus:ring-offset-0"
                  onClick={() => {
                    if (allowWalletConnect === false)
                      setAllowWalletConnect(true);
                    else setAllowWalletConnect(false);
                  }}
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
      {accountCreateDialogView === true && (
        <div
          className="fixed bg-blend-lighten top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm"
          onClick={() => setAccountCreateDialogView(false)}
        >
          <div
            className="absolute left-0 right-0 top-0 bottom-0 m-auto w-1/2 h-1/2 bg-[url('/imgs/background.png')] bg-contain bg-no-repeat bg-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="absolute top-8 right-3 w-4 h-fit cursor-pointer"
              src={closeIcon}
              onClick={() => setAccountCreateDialogView(false)}
            />
            <div className="flex flex-col gap-4 w-1/2 h-full items-center font-[Poppins-Regular]">
              <img className="w-[320px] h-fit mt-16" src={logoIcon} />
              <div className="flex flex-col px-24 gap-1 w-full pt-4">
                <p className="text-sm text-[#CFCFCF]">
                  Nickname *(can't be changed later)
                </p>
                <input
                  type="text"
                  className="bg-[#323334] border-[#515151] rounded-md text-md text-[#CFCFCF] focus:ring-0 focus:border-[#515151]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-row pt-6 px-16">
                <input
                  id="warning-checkbox"
                  type="checkbox"
                  className="cursor-pointer w-5 h-5 text-blue-600 bg-[#323334] border-[#323334] rounded focus:ring-0 focus:ring-offset-0"
                  onClick={() => {
                    if (allowWalletConnect === false)
                      setAllowWalletConnect(true);
                    else setAllowWalletConnect(false);
                  }}
                />
                <label
                  htmlFor="warning-checkbox"
                  className="cursor-pointer ml-2 text-xs text-[#7C7E81]"
                >
                  Gambling isn&apos;t forbidden by my local authorities and
                  I&apos;m at least 18 years old.
                </label>
              </div>
              <div className="pt-10 px-24 w-full">
                <button
                  className="w-full bg-gradient-to-r from-[#0066AA] to-[#a5f3fc] h-10 text-primary text-sm rounded-md uppercase"
                  onClick={() => createAccount()}
                >
                  create account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {heroswapDialogview === true && (
        <div
          className="fixed bg-blend-lighten top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-sm"
          onClick={() => setHeroswapDialogview(false)}
        >
          <div
            className="absolute left-0 right-0 top-0 bottom-0 m-auto w-3/5 2xl:w-1/2 h-3/5 2xl:h-1/2 bg-secondary"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="absolute top-2 right-3 w-4 h-fit cursor-pointer"
              src={closeIcon}
              onClick={() => setHeroswapDialogview(false)}
            />
            <div className="flex flex-col gap-4 w-1/2 h-full px-12 py-8 items-center font-[Poppins-Regular] text-primary">
              <div className="flex flex-col items-center">
                <p className="text-lg font-bold">Buy SUI with SUI Roulette</p>
                <p className="text-xs">Powered by HeroSwap</p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex flex-row gap-2 items-center">
                  <img className="w-8 h-fit" src={heroswap1} />
                  <p className="text-md">Select Token Pair</p>
                </div>
                <div className="flex flex-row gap-2">
                  <img className="w-8 h-fit" src={heroswap2} />
                  <p className="text-md">
                    Enter wallet address where you want to receive Sui
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  <img className="w-8 h-fit" src={heroswap3} />
                  <p className="text-md">
                    Preview your swap amount and send token to specified address
                  </p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <img className="w-8 h-fit" src={heroswap4} />
                  <p className="text-md">You&apos;re done!</p>
                </div>
              </div>
            </div>
            <iframe
              className="absolute left-1/2 right-0 xl:top-8 2xl:top-10 m-auto w-[40%] h-full"
              src="https://heroswap.com/widget?affiliateName=heroswap"
            />
          </div>
        </div>
      )}
      {loadingView === true && <LoadingLayout />}
    </>
  );
};

export default MainPage;
