import { useState, useEffect } from "react";
import { Typography, Button, Paper, SvgIcon } from "@mui/material";

import Vesting from "../../../components/ssVest/ssVest";
import Unlock from "../../../components/unlock/unlockModal";

import stores from "../../../stores";
import { ACTIONS } from "../../../stores/constants/constants";

function BalanceIcon({ className }: { className: string }) {
  return (
    <SvgIcon viewBox="0 0 64 64" strokeWidth="1" className={className}>
      <g strokeWidth="1" transform="translate(0, 0)">
        <rect
          data-color="color-2"
          x="9"
          y="10"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeLinecap="square"
          strokeMiterlimit="10"
          width="46"
          height="40"
          strokeLinejoin="miter"
        ></rect>{" "}
        <line
          data-color="color-2"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeLinecap="square"
          strokeMiterlimit="10"
          x1="14"
          y1="57"
          x2="14"
          y2="61"
          strokeLinejoin="miter"
        ></line>{" "}
        <line
          data-color="color-2"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeLinecap="square"
          strokeMiterlimit="10"
          x1="50"
          y1="57"
          x2="50"
          y2="61"
          strokeLinejoin="miter"
        ></line>{" "}
        <rect
          x="2"
          y="3"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeLinecap="square"
          strokeMiterlimit="10"
          width="60"
          height="54"
          strokeLinejoin="miter"
        ></rect>{" "}
        <line
          data-cap="butt"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeMiterlimit="10"
          x1="27.757"
          y1="25.757"
          x2="22.103"
          y2="20.103"
          strokeLinejoin="miter"
          strokeLinecap="butt"
        ></line>{" "}
        <line
          data-cap="butt"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeMiterlimit="10"
          x1="36.243"
          y1="25.757"
          x2="41.897"
          y2="20.103"
          strokeLinejoin="miter"
          strokeLinecap="butt"
        ></line>{" "}
        <line
          data-cap="butt"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeMiterlimit="10"
          x1="36.243"
          y1="34.243"
          x2="41.897"
          y2="39.897"
          strokeLinejoin="miter"
          strokeLinecap="butt"
        ></line>{" "}
        <line
          data-cap="butt"
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeMiterlimit="10"
          x1="27.757"
          y1="34.243"
          x2="22.103"
          y2="39.897"
          strokeLinejoin="miter"
          strokeLinecap="butt"
        ></line>{" "}
        <circle
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeLinecap="square"
          strokeMiterlimit="10"
          cx="32"
          cy="30"
          r="14"
          strokeLinejoin="miter"
        ></circle>{" "}
        <circle
          fill="none"
          stroke="#4585d6"
          strokeWidth="1"
          strokeLinecap="square"
          strokeMiterlimit="10"
          cx="32"
          cy="30"
          r="6"
          strokeLinejoin="miter"
        ></circle>
      </g>
    </SvgIcon>
  );
}

function Vest() {
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
          <Vesting />
        </div>
      ) : (
        <Paper className="fixed top-0 flex h-[calc(100%-150px)] w-[calc(100%-80px)] flex-col flex-wrap items-center justify-center bg-[rgba(17,23,41,0.2)] p-12 text-center shadow-none max-lg:my-auto max-lg:mt-24 max-lg:mb-0 lg:h-[100vh] lg:w-full">
          <BalanceIcon className="mb-8 -mt-20 text-7xl sm:text-8xl" />
          <Typography
            className="text-center font-['Monument'] text-2xl font-thin text-white sm:text-3xl"
            variant="h1"
          >
            Vest
          </Typography>
          <Typography
            className="color-[#7e99b0] my-7 mx-auto max-w-3xl text-center text-base sm:text-lg"
            variant="body2"
          >
            Lock your FLOW to earn rewards and governance rights. Each locked
            position is created and represented as an NFT, meaning you can hold
            multiple locked positions.
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

export default Vest;
