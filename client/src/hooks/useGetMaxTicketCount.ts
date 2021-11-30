import { useContractCall } from "@usedapp/core";

import { useGetLotteryContract } from "./useGetLotteryContract";

export const useGetMaxTicketCount = (): {
  maxTicketCount: string;
} => {
  const { lotteryInterface, lotteryContractAddress } = useGetLotteryContract();

  const [maxTicketCount] =
    useContractCall({
      abi: lotteryInterface,
      address: lotteryContractAddress,
      method: "maxTicketCount",
      args: [],
    }) ?? [];

  return {
    maxTicketCount: maxTicketCount?.toString(),
  };
};
