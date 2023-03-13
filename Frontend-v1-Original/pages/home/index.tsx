import { useRouter } from "next/router";
import { Typography, Button, Grid } from "@mui/material";

import { useScrollTo } from "react-use-window-scroll";

function Home() {
  const router = useRouter();

  const scrollTo = useScrollTo();

  return (
    <div className="relative mt-0 flex h-full w-full flex-col pt-8">
      <div className="w-100 relative h-screen">
        <Grid
          container
          spacing={2}
          className="absolute top-1/2 left-1/2 z-[2] h-auto max-w-[50vw] -translate-x-1/2 -translate-y-1/2 text-center md:max-w-[80vw]"
        >
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography
              variant="h1"
              className="relative bottom-0 mb-5 animate-titleAnim font-['Monument'] text-lg font-thin uppercase tracking-wider text-cantoGreen delay-[0s]"
            >
              Canto Liquidity Layer
            </Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography
              variant="h1"
              className="relative bottom-0 mb-6 animate-titleAnim text-center font-['Monument'] text-3xl delay-200 sm:text-4xl md:mb-8 md:text-6xl"
            >
              Low cost stable coin swaps
            </Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Grid container spacing={2}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Button
                  className="relative bottom-0 min-w-full animate-titleAnim bg-[#212b48] pl-3 pt-5 pr-[10px] pb-5 font-['Monument'] capitalize text-[#7e99b0] delay-[400ms] max-md:float-none max-md:m-0 max-md:w-full"
                  onClick={() =>
                    scrollTo({ top: 1000, left: 0, behavior: "smooth" })
                  }
                >
                  Learn More
                </Button>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Button
                  className="relative bottom-0 min-w-full animate-titleAnim bg-[#06d3d71a] pl-3 pt-5 pr-[10px] pb-5 font-['Monument'] capitalize text-cantoGreen delay-[600ms] max-md:float-none max-md:m-0 max-md:w-full"
                  onClick={() => router.push("/swap")}
                >
                  Enter App
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div id="info" className="relative h-screen w-full">
        <div className="hidden md:absolute md:top-[5%] md:left-1/2 md:z-[1] md:block md:h-[600px] md:w-[600px] md:-translate-x-1/2 md:-translate-y-1/2 md:bg-homePage md:bg-cover md:bg-no-repeat md:opacity-50 md:mix-blend-lighten"></div>
        <Grid
          container
          spacing={3}
          className="absolute top-1/2 left-1/2 z-[2] h-auto max-w-[80vw] -translate-x-1/2 -translate-y-1/2 text-center md:max-w-[50vw]"
        >
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography
              variant="h1"
              className="mb-5 text-center font-['Monument'] text-lg sm:text-3xl"
            >
              Welcome to Velocimeter
            </Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Typography
              variant="body1"
              className="mb-5 text-sm text-white sm:text-base md:text-lg"
            >
              Velocimeter officially launched in January 2023 with a collective
              goal of fair and balanced access to DeFi. Velocimeter is a
              decentralized exchange that has launched on the Canto network with
              low fees, near 0 slippage on correlated assets and a strong focus
              on secondary markets for tokenized locks as NFT&apos;s.
            </Typography>
            <Typography
              variant="body2"
              className="mb-5 text-xs text-[#f2f2f2] sm:text-sm md:text-base"
            >
              One segment of the cryptocurrency landscape that has shown
              incredible potential is the swapping of stablecoins and volatile
              assets. Velocimeter Swap offers users quick, seamless and cheap
              transactions while utilizing strategies to maximize their yield.
            </Typography>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Button
              className="min-w-full bg-[#06d3d71a] pl-3 pt-5 pr-[10px] pb-5 font-['Monument'] capitalize text-cantoGreen max-md:w-full"
              onClick={() => router.push("/swap")}
            >
              Enter App
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Home;
