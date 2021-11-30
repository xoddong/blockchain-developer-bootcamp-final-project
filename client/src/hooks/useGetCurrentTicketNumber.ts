import { useContractCall } from "@usedapp/core";

import { useGetLotteryContract } from "./useGetLotteryContract";

export const useGetCurrentTicketNumber = (): {
  currentTicketNumber: string;
} => {
  const { lotteryInterface, lotteryContractAddress } = useGetLotteryContract();

  const [currentTicketNumber] =
    useContractCall({
      abi: lotteryInterface,
      address: lotteryContractAddress,
      method: "getCurrentTicketNumber",
      args: [],
    }) ?? [];

  return {
    currentTicketNumber: currentTicketNumber?.toString(),
  };
};
