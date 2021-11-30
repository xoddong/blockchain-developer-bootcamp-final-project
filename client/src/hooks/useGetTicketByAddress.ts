import { useContractCall } from "@usedapp/core";

import { useGetLotteryContract } from "./useGetLotteryContract";

type UseGetTicketNumberByAddressProps = {
  address: string;
};

export const useGetTicketByAddress = ({
  address,
}: UseGetTicketNumberByAddressProps): {
  ticketNumber: string;
} => {
  const { lotteryInterface, lotteryContractAddress } = useGetLotteryContract();

  const [, ticketNumber] =
    useContractCall({
      abi: lotteryInterface,
      address: lotteryContractAddress,
      method: "ticketHoldersToTicket",
      args: [address],
    }) ?? [];

  return {
    ticketNumber: ticketNumber?.toString(),
  };
};
