import { useState, useEffect } from "react";
import { Typography, Button, Paper, SvgIcon } from "@mui/material";

import SSBribes from "../../components/ssBribes/ssBribes";
import Unlock from "../../components/unlock/unlockModal";

import { ACTIONS } from "../../stores/constants/constants";
import stores from "../../stores";

function BalanceIcon({ className }: { className: string }) {
  return (
    <SvgIcon viewBox="0 0 64 64" strokeWidth="1" className={className}>
      <g strokeWidth="1" transform="translate(0, 0)">
        <path
          data-color="color-2"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeLinecap="square"
          strokeMiterlimit="10"
          d="M40,28 c0-3.8,6-10,6-10s6,6.2,6,10s-3,6-6,6S40,31.8,40,28z"
          strokeLinejoin="miter"
        ></path>{" "}
        <path
          data-color="color-2"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeLinecap="square"
          strokeMiterlimit="10"
          d="M20,14 c0-3.8,6-10,6-10s6,6.2,6,10s-3,6-6,6S20,17.8,20,14z"
          strokeLinejoin="miter"
        ></path>{" "}
        <path
          data-cap="butt"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeMiterlimit="10"
          d="M10,34h2c4.6,0,9.6,2.4,12,6h8 c4,0,8,4,8,8H22"
          strokeLinejoin="miter"
          strokeLinecap="butt"
        ></path>{" "}
        <path
          data-cap="butt"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeMiterlimit="10"
          d="M38.8,44H52c7.2,0,8,4,8,4L31.4,59.6 c-2.2,1-4.8,0.8-7-0.2L10,52"
          strokeLinejoin="miter"
          strokeLinecap="butt"
        ></path>{" "}
        <rect
          x="2"
          y="30"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeLinecap="square"
          strokeMiterlimit="10"
          width="8"
          height="26"
          strokeLinejoin="miter"
        ></rect>
      </g>
    </SvgIcon>
  );
}

function Bribes() {
  const accountStore = stores.accountStore.getStore("account");
  const [account, setAccount] = useState(accountStore);
  const [unlockOpen, setUnlockOpen] = useState(false);

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore("account");
      setAccount(accountStore);
      closeUnlock();
    };
    const connectWallet = () => {
      onAddressClicked();
    };

    stores.emitter.on(ACTIONS.ACCOUNT_CONFIGURED, accountConfigure);
    stores.emitter.on(ACTIONS.CONNECT_WALLET, connectWallet);
    return () => {
      stores.emitter.removeListener(
        ACTIONS.ACCOUNT_CONFIGURED,
        accountConfigure
      );
      stores.emitter.removeListener(ACTIONS.CONNECT_WALLET, connectWallet);
    };
  }, []);

  const onAddressClicked = () => {
    setUnlockOpen(true);
  };

  const closeUnlock = () => {
    setUnlockOpen(false);
  };

  return (
    <div className="relative mt-0 flex h-full w-full flex-col pt-8">
      {account && account.address ? (
        <div>
          <SSBribes />
        </div>
      ) : (
        <Paper className="fixed top-0 flex h-[calc(100%-150px)] w-[calc(100%-80px)] flex-col flex-wrap items-center justify-center bg-[rgba(17,23,41,0.2)] p-12 text-center shadow-none max-lg:my-auto max-lg:mt-24 max-lg:mb-0 lg:h-[100vh] lg:w-full">
          <BalanceIcon className="mb-8 -mt-20 text-7xl sm:text-8xl" />
          <Typography
            className="text-center font-['Monument'] text-2xl font-thin text-white sm:text-3xl"
            variant="h1"
          >
            Bribes
          </Typography>
          <Typography
            className="color-[#7e99b0] my-7 mx-auto max-w-3xl text-center text-base sm:text-lg"
            variant="body2"
          >
            Use your veFLOW to vote for your selected pool&apos;s rewards
            distribution or create a bribe to encourage others to do the same.
          </Typography>
          <Button
            disableElevation
            className="scale-90 rounded-3xl border border-solid border-green-300 bg-green-300 px-6 pt-3 pb-4 font-bold transition-all duration-300 hover:scale-95 hover:bg-emerald-300"
            variant="contained"
            onClick={onAddressClicked}
          >
            <Typography>Connect Wallet to Continue</Typography>
          </Button>
        </Paper>
      )}
      {unlockOpen && <Unlock modalOpen={unlockOpen} closeModal={closeUnlock} />}
    </div>
  );
}

export default Bribes;
