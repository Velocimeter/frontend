import { useState, useMemo, useRef } from "react";
import { makeStyles } from "@mui/styles";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Typography,
  Slider,
} from "@mui/material";
import BigNumber from "bignumber.js";

import { formatCurrency } from "../../utils/utils";
import { Pair, Vote, VestNFT } from "../../stores/types/types";

const headCells = [
  { id: "asset", numeric: false, disablePadding: false, label: "Asset" },
  {
    id: "balance",
    numeric: true,
    disablePadding: false,
    label: "My Stake",
  },
  {
    id: "liquidity",
    numeric: true,
    disablePadding: false,
    label: "Total Liquidity",
  },
  {
    id: "votes_apr",
    numeric: true,
    disablePadding: false,
    label: "Voting APR",
  },
  {
    id: "totalVotes",
    numeric: true,
    disablePadding: false,
    label: "Total Votes",
  },
  {
    id: "apy",
    numeric: true,
    disablePadding: false,
    label: "Bribes",
  },
  {
    id: "myVotes",
    numeric: true,
    disablePadding: false,
    label: "My Votes",
  },
  {
    id: "mvp",
    numeric: true,
    disablePadding: false,
    label: "My Vote %",
  },
] as const;

type OrderBy = (typeof headCells)[number]["id"];

function EnhancedTableHead(props: {
  classes: ReturnType<typeof useStyles>;
  order: "asc" | "desc";
  orderBy: OrderBy;
  onRequestSort: (event: any, property: OrderBy) => void;
}) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: OrderBy) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            className={classes.overrideTableHead}
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              <Typography variant="h5" className={classes.headerText}>
                {headCell.label}
              </Typography>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    // @ts-expect-error The default theme interface, augment this to avoid having to set the theme type everywhere.
    marginBottom: theme.spacing(2),
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  inline: {
    display: "flex",
    alignItems: "center",
  },
  inlineBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 0px",
  },
  textSpaced: {
    lineHeight: "1.5",
    fontWeight: "200",
    fontSize: "12px",
  },
  cell: {},
  skelly: {
    marginBottom: "12px",
    marginTop: "12px",
  },
  skelly1: {
    marginBottom: "12px",
    marginTop: "24px",
  },
  tableContainer: {
    overflowX: "hidden",
  },
  overrideTableHead: {
    borderBottom: "1px solid rgba(104,108,122,0.2) !important",
  },
  headerText: {
    fontWeight: "200",
    fontSize: "12px",
  },
  tooltipContainer: {
    minWidth: "240px",
    padding: "0px 15px",
  },
  doubleImages: {
    display: "flex",
    position: "relative",
    width: "70px",
    height: "35px",
  },
  img1Logo: {
    position: "absolute",
    left: "0px",
    top: "0px",
    border: "3px solid rgb(25, 33, 56)",
    borderRadius: "30px",
  },
  img2Logo: {
    position: "absolute",
    left: "23px",
    zIndex: "1",
    top: "0px",
    border: "3px solid rgb(25, 33, 56)",
    borderRadius: "30px",
  },
  inlineEnd: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
}));

export default function EnhancedTable({
  gauges,
  setParentSliderValues,
  defaultVotes,
  token,
}: {
  gauges: Pair[];
  setParentSliderValues: React.Dispatch<
    React.SetStateAction<
      (Pick<Vote, "address"> & {
        value: number;
      })[]
    >
  >;
  defaultVotes: Array<Pick<Vote, "address"> & { value: number }>;
  token: VestNFT;
}) {
  const classes = useStyles();

  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [orderBy, setOrderBy] = useState<OrderBy>("totalVotes");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [disabledSort, setDisabledSort] = useState(false);
  const votesRef = useRef(null);

  const onSliderChange = (event, value, asset) => {
    if (orderBy === "mvp" || orderBy === "myVotes") {
      setDisabledSort(true);
    }
    let newSliderValues = [...defaultVotes];

    newSliderValues = newSliderValues.map((val) => {
      if (asset?.address === val.address) {
        val.value = value;
      }
      return val;
    });

    setParentSliderValues(newSliderValues);
  };

  const handleRequestSort = (event, property) => {
    if (disabledSort && (property === "mvp" || property === "myVotes")) {
      return;
    } else if (disabledSort) {
      setDisabledSort(false);
    }
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!gauges) {
    return (
      <div className={classes.root}>
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={40}
          className={classes.skelly1}
        />
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={70}
          className={classes.skelly}
        />
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={70}
          className={classes.skelly}
        />
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={70}
          className={classes.skelly}
        />
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={70}
          className={classes.skelly}
        />
        <Skeleton
          variant="rectangular"
          width={"100%"}
          height={70}
          className={classes.skelly}
        />
      </div>
    );
  }

  // const renderTooltip = (pair) => {
  //   return (
  //     <div className={classes.tooltipContainer}>
  //       {pair?.gauge?.bribes.map((bribe, idx) => {
  //         let earned = 0;
  //         if (pair.gauge.bribesEarned && pair.gauge.bribesEarned.length > idx) {
  //           earned = pair.gauge.bribesEarned[idx].earned;
  //         }

  //         return (
  //           <div className={classes.inlineBetween} key={bribe.token.symbol}>
  //             <Typography>Bribe:</Typography>
  //             <Typography>
  //               {formatCurrency(bribe.rewardAmount)} {bribe.token.symbol}
  //             </Typography>
  //           </div>
  //         );
  //       })}
  //     </div>
  //   );
  // };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, gauges.length - page * rowsPerPage);

  const sortedGauges = useMemo(() => {
    if (disabledSort) {
      return votesRef.current;
    }
    votesRef.current = stableSort(
      gauges,
      getComparator(order, orderBy, defaultVotes)
    ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return votesRef.current;
  }, [gauges, order, orderBy, page, rowsPerPage, defaultVotes, disabledSort]);

  return (
    <div className={classes.root}>
      <TableContainer className={classes.tableContainer}>
        <Table
          aria-labelledby="tableTitle"
          size={"medium"}
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {sortedGauges.map((row, index) => {
              if (!row) {
                return null;
              }
              let sliderValue = defaultVotes.find(
                (el) => el.address === row?.address
              )?.value;
              if (sliderValue) {
                sliderValue = BigNumber(sliderValue).toNumber();
              } else {
                sliderValue = 0;
              }

              return (
                <TableRow key={row?.gauge?.address}>
                  <TableCell className={classes.cell}>
                    <div className={classes.inline}>
                      <div className={classes.doubleImages}>
                        <img
                          className={classes.img1Logo}
                          src={
                            row && row.token0 && row.token0.logoURI
                              ? row.token0.logoURI
                              : ``
                          }
                          width="37"
                          height="37"
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src =
                              "/tokens/unknown-logo.png";
                          }}
                        />
                        <img
                          className={classes.img2Logo}
                          src={
                            row && row.token1 && row.token1.logoURI
                              ? row.token1.logoURI
                              : ``
                          }
                          width="37"
                          height="37"
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src =
                              "/tokens/unknown-logo.png";
                          }}
                        />
                      </div>
                      <div>
                        <Typography variant="h2" className={classes.textSpaced}>
                          {row?.symbol}
                        </Typography>
                        <Typography
                          variant="h5"
                          className={classes.textSpaced}
                          color="textSecondary"
                        >
                          {row?.isStable ? "Stable Pool" : "Volatile Pool"}
                        </Typography>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={classes.cell} align="right">
                    <div className={classes.inlineEnd}>
                      <Typography variant="h2" className={classes.textSpaced}>
                        {formatCurrency(
                          BigNumber(row?.gauge?.balance)
                            .div(row?.gauge?.totalSupply)
                            .times(row?.reserve0)
                        )}
                      </Typography>
                      <Typography
                        variant="h5"
                        className={classes.textSpaced}
                        color="textSecondary"
                      >
                        {row?.token0?.symbol}
                      </Typography>
                    </div>
                    <div className={classes.inlineEnd}>
                      <Typography variant="h5" className={classes.textSpaced}>
                        {formatCurrency(
                          BigNumber(row?.gauge?.balance)
                            .div(row?.gauge?.totalSupply)
                            .times(row?.reserve1)
                        )}
                      </Typography>
                      <Typography
                        variant="h5"
                        className={classes.textSpaced}
                        color="textSecondary"
                      >
                        {row?.token1?.symbol}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell className={classes.cell} align="right">
                    <div className={classes.inlineEnd}>
                      <Typography variant="h2" className={classes.textSpaced}>
                        {formatCurrency(BigNumber(row?.reserve0))}
                      </Typography>
                      <Typography
                        variant="h5"
                        className={classes.textSpaced}
                        color="textSecondary"
                      >
                        {row?.token0?.symbol}
                      </Typography>
                    </div>
                    <div className={classes.inlineEnd}>
                      <Typography variant="h5" className={classes.textSpaced}>
                        {formatCurrency(BigNumber(row?.reserve1))}
                      </Typography>
                      <Typography
                        variant="h5"
                        className={classes.textSpaced}
                        color="textSecondary"
                      >
                        {row?.token1?.symbol}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell className={classes.cell} align="right">
                    <Typography variant="h2" className={classes.textSpaced}>
                      {formatCurrency(row?.gauge?.votingApr)} %
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.cell} align="right">
                    <Typography variant="h2" className={classes.textSpaced}>
                      {formatCurrency(row?.gauge?.weight)}
                    </Typography>
                    <Typography
                      variant="h5"
                      className={classes.textSpaced}
                      color="textSecondary"
                    >
                      {formatCurrency(row?.gauge?.weightPercent)} %
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.cell} align="right">
                    <div className="text-xs font-light">
                      ${formatCurrency(row?.gauge?.bribesInUsd)} USD
                    </div>
                    {row?.gauge?.bribes.map((bribe, idx) => {
                      return (
                        <div
                          className={classes.inlineEnd}
                          key={bribe.token.symbol}
                        >
                          <Typography
                            variant="h2"
                            className={classes.textSpaced}
                          >
                            {formatCurrency(bribe.rewardAmount)}
                          </Typography>
                          <Typography
                            variant="h5"
                            className={classes.textSpaced}
                            color="textSecondary"
                          >
                            {bribe.token.symbol}
                          </Typography>
                        </div>
                      );
                    })}
                  </TableCell>
                  <TableCell className={classes.cell} align="right">
                    <Typography variant="h2" className={classes.textSpaced}>
                      {formatCurrency(
                        BigNumber(sliderValue).div(100).times(token?.lockValue)
                      )}
                    </Typography>
                    <Typography
                      variant="h5"
                      className={classes.textSpaced}
                      color="textSecondary"
                    >
                      {formatCurrency(sliderValue)} %
                    </Typography>
                  </TableCell>
                  <TableCell className={classes.cell} align="right">
                    <Slider
                      valueLabelDisplay="auto"
                      value={sliderValue}
                      onChange={(event, value) => {
                        onSliderChange(event, value, row);
                      }}
                      min={0}
                      max={100}
                      marks
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 61 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={gauges.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}

function descendingComparator(
  a: Pair,
  b: Pair,
  orderBy: OrderBy,
  defaultVotes?: Array<Pick<Vote, "address"> & { value: number }>
) {
  if (!a || !b) {
    return 0;
  }

  switch (orderBy) {
    case "balance":
      if (BigNumber(b?.gauge?.balance).lt(a?.gauge?.balance)) {
        return -1;
      }
      if (BigNumber(b?.gauge?.balance).gt(a?.gauge?.balance)) {
        return 1;
      }
      return 0;

    case "liquidity":
      let reserveA = BigNumber(a?.reserve0).plus(a?.reserve1).toNumber();
      let reserveB = BigNumber(b?.reserve0).plus(b?.reserve1).toNumber();

      if (BigNumber(reserveB).lt(reserveA)) {
        return -1;
      }
      if (BigNumber(reserveB).gt(reserveA)) {
        return 1;
      }
      return 0;

    case "votes_apr":
      if (BigNumber(b?.gauge?.votingApr).lt(a?.gauge?.votingApr)) {
        return -1;
      }
      if (BigNumber(b?.gauge?.votingApr).gt(a?.gauge?.votingApr)) {
        return 1;
      }
      return 0;
    case "totalVotes":
      if (BigNumber(b?.gauge?.weightPercent).lt(a?.gauge?.weightPercent)) {
        return -1;
      }
      if (BigNumber(b?.gauge?.weightPercent).gt(a?.gauge?.weightPercent)) {
        return 1;
      }
      return 0;

    case "apy":
      if (BigNumber(b?.gauge?.bribesInUsd).lt(a?.gauge?.bribesInUsd)) {
        return -1;
      }
      if (BigNumber(b?.gauge?.bribesInUsd).gt(a?.gauge?.bribesInUsd)) {
        return 1;
      }
      return 0;

    case "myVotes":
    case "mvp":
      let sliderValue1 = defaultVotes.find(
        (el) => el.address === a?.address
      )?.value;
      let sliderValue2 = defaultVotes.find(
        (el) => el.address === b?.address
      )?.value;
      if (sliderValue2 < sliderValue1) {
        return -1;
      }
      if (sliderValue2 > sliderValue1) {
        return 1;
      }
      return 0;

    default:
      return 0;
  }
}

function getComparator(
  order: "asc" | "desc",
  orderBy: OrderBy,
  defaultVotes?: Array<Pick<Vote, "address"> & { value: number }>
) {
  return order === "desc"
    ? (a: Pair, b: Pair) => descendingComparator(a, b, orderBy, defaultVotes)
    : (a: Pair, b: Pair) => -descendingComparator(a, b, orderBy, defaultVotes);
}

function stableSort(array: Pair[], comparator: (a: Pair, b: Pair) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
