import { useContractFunction } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";

import { useGetLotteryContract } from "./useGetLotteryContract";

export const usePurchaseTicket = () => {
  const { lotteryInterface, lotteryContractAddress } = useGetLotteryContract();

  const lotteryContract = new Contract(
    lotteryContractAddress,
    lotteryInterface
  );

  return useContractFunction(lotteryContract, "purchaseTicket", {
    transactionName: "Purchase ticket",
  });
};
