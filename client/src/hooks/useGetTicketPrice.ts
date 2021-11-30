import { useContractCall } from "@usedapp/core";

import { useGetLotteryContract } from "./useGetLotteryContract";

export const useGetTicketPrice = (): {
  ticketPrice: string;
} => {
  const { lotteryInterface, lotteryContractAddress } = useGetLotteryContract();

  const [ticketPrice] =
    useContractCall({
      abi: lotteryInterface,
      address: lotteryContractAddress,
      method: "ticketPrice",
      args: [],
    }) ?? [];

  return {
    ticketPrice: ticketPrice?.toString(),
  };
};
