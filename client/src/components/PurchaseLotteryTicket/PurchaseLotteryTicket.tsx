import { ethers } from "ethers";

import { useGetCurrentTicketNumber } from "../../hooks/useGetCurrentTicketNumber";
import { useGetMaxTicketCount } from "../../hooks/useGetMaxTicketCount";
import { useGetTicketPrice } from "../../hooks/useGetTicketPrice";

import { PurchaseLotteryTicketButton } from "../PurchaseLotteryTicketButton/PurchaseLotteryTicketButton";

export const PurchaseLotteryTicket = () => {
  const { ticketPrice } = useGetTicketPrice();
  const { currentTicketNumber } = useGetCurrentTicketNumber();
  const { maxTicketCount } = useGetMaxTicketCount();

  return (
    <div>
      <div>
        Total pize pool:{" "}
        {ethers.utils.formatEther(
          (BigInt(ticketPrice) * BigInt(maxTicketCount)).toString()
        )}{" "}
        eth
      </div>
      <div>
        Current ticket: {currentTicketNumber} out of {maxTicketCount}
      </div>
      <div>
        Buy ticket:
        <PurchaseLotteryTicketButton />
      </div>
    </div>
  );
};
