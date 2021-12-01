import { useContractCall } from "@usedapp/core";

import { useGetLotteryContract } from "./useGetLotteryContract";

export const useGetWinningNumber = (): {
  winningNumber: string;
} => {
  const { lotteryInterface, lotteryContractAddress } = useGetLotteryContract();

  const [winningNumber] =
    useContractCall({
      abi: lotteryInterface,
      address: lotteryContractAddress,
      method: "winningNumber",
      args: [],
    }) ?? [];

  return {
    winningNumber: winningNumber?.toString(),
  };
};
