import { useCallback } from "react";

import { usePurchaseTicket } from "../../hooks/usePurchaseTicket";
import { useGetTicketPrice } from "../../hooks/useGetTicketPrice";

export const PurchaseLotteryTicketButton = () => {
  const { ticketPrice } = useGetTicketPrice();
  const { send: sendPurchaseTicket } = usePurchaseTicket();

  const onClick = useCallback(() => {
    sendPurchaseTicket({ value: ticketPrice });
  }, [ticketPrice, sendPurchaseTicket]);

  return <button onClick={onClick}>Purchase lottery ticket</button>;
};
