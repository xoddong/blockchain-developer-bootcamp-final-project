import { useContractCall } from "@usedapp/core";

import { useGetLotteryContract } from "./useGetLotteryContract";

export const useGetLotteryState = (): {
  state: number;
} => {
  const { lotteryInterface, lotteryContractAddress } = useGetLotteryContract();

  const [state] =
    useContractCall({
      abi: lotteryInterface,
      address: lotteryContractAddress,
      method: "lotteryState",
      args: [],
    }) ?? [];

  return {
    state,
  };
};
