import { useContractCall } from "@usedapp/core";

import { useGetLotteryContract } from "./useGetLotteryContract";

type UseGetTicketNumberByAddressProps = {
  address: string | null | undefined;
};

export const useGetTicketByAddress = ({
  address,
}: UseGetTicketNumberByAddressProps): {
  ticketNumber: string;
} => {
  const { lotteryInterface, lotteryContractAddress } = useGetLotteryContract();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, ticketNumber] =
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
