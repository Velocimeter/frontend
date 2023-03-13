import { useState, useEffect, useCallback } from "react";
import { Typography } from "@mui/material";
import type { Pair } from "../../stores/types/types";

import classes from "./ssLiquidityPairs.module.css";

import PairsTable from "./ssLiquidityPairsTable";

import stores from "../../stores";
import { ACTIONS } from "../../stores/constants/constants";

export default function ssLiquidityPairs() {
  const [, updateState] = useState<{}>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [pairs, setPairs] = useState<Pair[]>([]);

  useEffect(() => {
    const stableSwapUpdated = () => {
      setPairs(stores.stableSwapStore.getStore("pairs"));
      forceUpdate();
    };

    setPairs(stores.stableSwapStore.getStore("pairs"));

    stores.emitter.on(ACTIONS.UPDATED, stableSwapUpdated);
    return () => {
      stores.emitter.removeListener(ACTIONS.UPDATED, stableSwapUpdated);
    };
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.descriptionTvlBox}>
        <div className={classes.descriptionBox}>
          <Typography variant="h1">Liquidity Pools</Typography>
          <Typography variant="body2">
            Pair your tokens to provide liquidity. Stake the LP tokens to earn
            FLOW
          </Typography>
        </div>
      </div>
      <PairsTable pairs={pairs} />
    </div>
  );
}
