import { useEthers } from "@usedapp/core";

import { RequireWeb3 } from "../RequireWeb3/RequireWeb3";
import { useGetTicketByAddress } from "../../hooks/useGetTicketByAddress";
import { PurchaseLotteryTicket } from "../PurchaseLotteryTicket/PurchaseLotteryTicket";
import { LotteryTicketInfo } from "../LotteryTicketInfo/LotteryTicketInfo";

export const Lottery = () => {
  const { account } = useEthers();
  const { ticketNumber } = useGetTicketByAddress({
    address: account || "",
  });

  return (
    <div>
      {account && (
        <div>
          {/* {!ticket && <PurchaseLotteryTicket />} */}
          {!!ticketNumber && <LotteryTicketInfo />}
        </div>
      )}
      {!account && <RequireWeb3 />}
    </div>
  );
};
