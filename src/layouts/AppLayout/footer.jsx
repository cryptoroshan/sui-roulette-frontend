import discordIcon from "/imgs/discord.png";
import twitterIcon from "/imgs/twitter.png";
import mailIcon from "/imgs/mail.png";

const Footer = () => {
  return (
    <footer className="bg-footer font-[Poppins-Regular]">
      <section className="flex flex-col w-3/4 2xl:w-2/3 mx-auto">
        <div className="flex flex-row justify-between px-16 py-16 w-full">
          <div className="flex flex-col gap-2">
            <p className="text-3xl text-primary font-bold">DeSuiLabs</p>
            <p className="text-sm text-secondary">
              SuiRoulette.com is a DeSuiLabs product.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-sm text-primary">Platform</p>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-secondary">Provability Explained</p>
              <p className="text-sm text-secondary">Source Code</p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-sm text-primary">About Us</p>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-secondary">FAQ</p>
              <p className="text-sm text-secondary">How to play</p>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-sm text-primary">Community</p>
            <div className="flex flex-row gap-4">
              <a href="https://discord.com/" target="_blank" rel="noreferrer">
                <img className="w-6" src={discordIcon} />
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noreferrer">
                <img className="w-6" src={twitterIcon} />
              </a>
              <a href="https://mail.google.com/" target="_blank" rel="noreferrer">
                <img className="w-6" src={mailIcon} />
              </a>
            </div>
          </div>
        </div>
        <div className="w-full h-1 bg-[#282B31]"></div>
        <p className="text-sm text-secondary pt-12 pb-8 px-16">
          Copyright © 2023 SuiRoulette.com - All rights reserved.
        </p>
      </section>
    </footer>
  );
};

export default Footer;
