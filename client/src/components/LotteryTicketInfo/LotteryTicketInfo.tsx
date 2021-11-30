import { useEthers } from "@usedapp/core";
import { useGetTicketByAddress } from "../../hooks/useGetTicketByAddress";

export const LotteryTicketInfo = () => {
  const { account } = useEthers();
  const { ticketNumber } = useGetTicketByAddress({
    address: account || "",
  });

  return <div>{ticketNumber}</div>;
};
