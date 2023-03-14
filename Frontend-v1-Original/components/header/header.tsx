import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import {
  Typography,
  Button,
  SvgIcon,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { withStyles, withTheme } from "@mui/styles";
import {
  List,
  ArrowDropDown,
  AccountBalanceWalletOutlined,
} from "@mui/icons-material";

import Navigation from "../navigation/navigation";
import Unlock from "../unlock/unlockModal";
import TransactionQueue from "../transactionQueue/transactionQueue";
import Info from "./info";

import useScrollPosition from "../../hooks/useScrollPosition";
import { ACTIONS } from "../../stores/constants/constants";
import stores from "../../stores";
import { formatAddress } from "../../utils/utils";

type EthWindow = Window &
  typeof globalThis & {
    ethereum?: any;
  };

function SiteLogo(props: { className?: string }) {
  const { className } = props;
  return (
    <Image
      className={className}
      src="/images/vcm_logo.png"
      alt="velocimeter logo"
      height={38}
      width={256}
    />
  );
}

const { CONNECT_WALLET, ACCOUNT_CONFIGURED, ACCOUNT_CHANGED } = ACTIONS;

function WrongNetworkIcon(props: { className: string }) {
  const { className } = props;
  return (
    <SvgIcon viewBox="0 0 64 64" strokeWidth="1" className={className}>
      <g strokeWidth="2" transform="translate(0, 0)">
        <path
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="square"
          strokeMiterlimit="10"
          d="M33.994,42.339 C36.327,43.161,38,45.385,38,48c0,3.314-2.686,6-6,6c-2.615,0-4.839-1.673-5.661-4.006"
          strokeLinejoin="miter"
        ></path>{" "}
        <path
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="square"
          strokeMiterlimit="10"
          d="M47.556,32.444 C43.575,28.462,38.075,26,32,26c-6.075,0-11.575,2.462-15.556,6.444"
          strokeLinejoin="miter"
        ></path>{" "}
        <path
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="square"
          strokeMiterlimit="10"
          d="M59.224,21.276 C52.256,14.309,42.632,10,32,10c-10.631,0-20.256,4.309-27.224,11.276"
          strokeLinejoin="miter"
        ></path>{" "}
        <line
          data-color="color-2"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="square"
          strokeMiterlimit="10"
          x1="10"
          y1="54"
          x2="58"
          y2="6"
          strokeLinejoin="miter"
        ></line>
      </g>
    </SvgIcon>
  );
}

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: "none",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "#FFF",
      },
    },
  },
}))(MenuItem);

const StyledBadge = withStyles((theme) => ({
  badge: {
    background: "#06D3D7",
    color: "#000",
  },
}))(Badge);

const switchChain = async () => {
  let hexChain = "0x" + Number(process.env.NEXT_PUBLIC_CHAINID).toString(16);
  try {
    await (window as EthWindow).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChain }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await (window as EthWindow).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hexChain,
              chainName: "Canto",
              nativeCurrency: {
                name: "CANTO",
                symbol: "CANTO",
                decimals: 18,
              },
              rpcUrls: [
                "https://canto.slingshot.finance/",
                "https://canto.gravitychain.io/",
                "https://canto.neobase.one/",
                "https://canto.evm.chandrastation.com/",
                "https://jsonrpc.canto.nodestake.top/",
              ],
              blockExplorerUrls: [
                "https://tuber.build/",
                "https://evm.explorer.canto.io/",
              ],
            },
          ],
        });
      } catch (addError) {
        console.log("add error", addError);
      }
    }
    console.log("switch error", switchError);
  }
};

function Header() {
  const accountStore = stores.accountStore.getStore("account");
  const router = useRouter();

  const [account, setAccount] = useState(accountStore);
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [chainInvalid, setChainInvalid] = useState(false);
  const [transactionQueueLength, setTransactionQueueLength] = useState(0);

  const scrollPosition = useScrollPosition();

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore("account");
      setAccount(accountStore);
      closeUnlock();
    };
    const connectWallet = () => {
      onAddressClicked();
    };
    const accountChanged = () => {
      const invalid = stores.accountStore.getStore("chainInvalid");
      setChainInvalid(invalid);
    };

    const invalid = stores.accountStore.getStore("chainInvalid");
    setChainInvalid(invalid);

    stores.emitter.on(ACCOUNT_CONFIGURED, accountConfigure);
    stores.emitter.on(CONNECT_WALLET, connectWallet);
    stores.emitter.on(ACCOUNT_CHANGED, accountChanged);
    return () => {
      stores.emitter.removeListener(ACCOUNT_CONFIGURED, accountConfigure);
      stores.emitter.removeListener(CONNECT_WALLET, connectWallet);
      stores.emitter.removeListener(ACCOUNT_CHANGED, accountChanged);
    };
  }, []);

  const onAddressClicked = () => {
    setUnlockOpen(true);
  };

  const closeUnlock = () => {
    setUnlockOpen(false);
  };

  const setQueueLength = (length) => {
    setTransactionQueueLength(length);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        className={`z-10 grid w-full grid-flow-row border-cantoGreen border-opacity-50 transition-all duration-200 ${
          scrollPosition > 0
            ? "border-b-[0.25px] bg-[rgba(0,0,0,0.973)] opacity-90 backdrop-blur-2xl"
            : "border-b-0 border-none"
        }`}
      >
        <Info />
        <div className="flex min-h-[60px] items-center justify-between rounded-none border-none py-5 px-8 md:max-[1200px]:flex-col">
          <a
            onClick={() => router.push("/home")}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-[40px] py-1"
          >
            <SiteLogo />
            <Typography className="text-2xl font-bold">v2</Typography>
          </a>
          <Navigation />
          <div className="flex justify-end gap-1 md:max-[1200px]:w-full md:max-[1200px]:items-end md:max-[1200px]:px-8 xl:w-[260px]">
            {process.env.NEXT_PUBLIC_CHAINID === "740" && (
              <div>
                <Typography className="rounded-xl border border-cantoGreen bg-[#0e110c] p-4 text-sm">
                  Testnet
                </Typography>
              </div>
            )}
            {transactionQueueLength > 0 && (
              <IconButton
                className="flex min-h-[40px] items-center rounded-3xl border-none bg-[#040105] px-4 text-[rgba(255,255,255,0.87)] sm:min-h-[50px]"
                color="primary"
                onClick={() => {
                  stores.emitter.emit(ACTIONS.TX_OPEN);
                }}
              >
                <StyledBadge
                  badgeContent={transactionQueueLength}
                  color="secondary"
                  overlap="circular"
                >
                  <List className="text-white" />
                </StyledBadge>
              </IconButton>
            )}
            {account && account.address ? (
              <>
                <Button
                  disableElevation
                  className="flex min-h-[40px] items-center rounded-3xl border border-solid border-cantoGreen border-opacity-60 bg-[#040105] px-4 text-[rgba(255,255,255,0.87)] opacity-90 sm:min-h-[50px]"
                  variant="contained"
                  color="primary"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <Typography className="text-sm font-bold">
                    {formatAddress(account.address)}
                  </Typography>
                  <ArrowDropDown className="ml-1 -mr-2 -mt-1 text-[#7e99b0]" />
                </Button>
                <Menu
                  elevation={0}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  id="customized-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <StyledMenuItem onClick={onAddressClicked}>
                    <ListItemIcon className="p-0 text-cantoGreen">
                      <AccountBalanceWalletOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Switch Wallet Provider" />
                  </StyledMenuItem>
                </Menu>
              </>
            ) : (
              <Button
                disableElevation
                className="flex min-h-[40px] items-center rounded-3xl border-none bg-[#040105] px-4 text-[rgba(255,255,255,0.87)] sm:min-h-[50px]"
                variant="contained"
                color={"primary"}
                onClick={onAddressClicked}
              >
                <Typography className="text-sm font-bold">
                  Connect Wallet
                </Typography>
              </Button>
            )}
          </div>
          {unlockOpen && (
            <Unlock modalOpen={unlockOpen} closeModal={closeUnlock} />
          )}
          <TransactionQueue setQueueLength={setQueueLength} />
        </div>
      </div>
      {chainInvalid ? (
        <div className="fixed left-0 top-0 z-[1100] flex h-screen min-w-full flex-1 flex-wrap items-center justify-center bg-[rgba(17,23,42,0.9)] text-center">
          <div>
            <WrongNetworkIcon className="mb-5 text-8xl" />
            <Typography className="max-w-md text-2xl text-white">
              The chain you're connected to isn't supported. Please check that
              your wallet is connected to Canto Mainnet.
            </Typography>
            <Button
              className="scale-90 rounded-3xl border border-solid border-green-300 bg-green-300 px-6 pt-3 pb-4 font-bold transition-all duration-300 hover:scale-95 hover:bg-emerald-300"
              variant="contained"
              onClick={() => switchChain()}
            >
              Switch to{" "}
              {process.env.NEXT_PUBLIC_CHAINID == "740"
                ? "Canto testnet"
                : "Canto"}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default withTheme(Header);
