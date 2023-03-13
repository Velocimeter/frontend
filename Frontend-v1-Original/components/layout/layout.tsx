import Head from "next/head";
import classes from "./layout.module.css";
import Header from "../header/header";
import SnackbarController from "../snackbar/snackbarController";

export default function Layout({
  children,
  configure,
}: {
  children: React.ReactNode;
  configure?: boolean;
}) {
  return (
    <div className={classes.container}>
      <Head>
        <link rel="icon" href="/images/logo-icon.png" />
        <link
          rel="preload"
          href="/fonts/Inter/Inter-Regular.ttf"
          as="font"
          crossOrigin=""
        />
        <meta
          name="description"
          content="Velocimeter allows low cost, near 0 slippage trades on uncorrelated or tightly correlated assets built on Arbitrum."
        />
        <meta name="og:title" content="Velocimeter" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={classes.background} />
      <div className={classes.greyGlow} />
      <div className={classes.greenGlow} />
      <div className={classes.content}>
        {!configure && <Header />}
        <SnackbarController />
        <main>{children}</main>
      </div>
    </div>
  );
}
