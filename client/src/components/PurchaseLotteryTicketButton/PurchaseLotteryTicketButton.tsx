import { useCallback } from "react";
import styled from "styled-components";

import { usePurchaseTicket } from "../../hooks/usePurchaseTicket";
import { useGetTicketPrice } from "../../hooks/useGetTicketPrice";

export const PurchaseLotteryTicketButton = () => {
  const { ticketPrice } = useGetTicketPrice();
  const { send: sendPurchaseTicket } = usePurchaseTicket();

  const onClick = useCallback(() => {
    sendPurchaseTicket({ value: ticketPrice });
  }, [ticketPrice, sendPurchaseTicket]);

  if (!ticketPrice) {
    return null;
  }

  return (
    <PurchaseButton onClick={onClick}>Purchase lottery ticket</PurchaseButton>
  );
};

const PurchaseButton = styled.button`
  width: 100%;
  margin-top: 60px;
  padding: 12px 16px;
  font-size: 18px;
  background: #ff5733;
  color: #ffffff;
  font-weight: bold;

  cursor: pointer;

  border: 0;
  border-radius: 4px;

  &:hover {
    background: #cc5500;
  }
`;
