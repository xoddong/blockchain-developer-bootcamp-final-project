import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import styled from "styled-components";

import { useGetCurrentTicketNumber } from "../../hooks/useGetCurrentTicketNumber";
import { useGetLotteryState } from "../../hooks/useGetLotteryState";
import { useGetMaxTicketCount } from "../../hooks/useGetMaxTicketCount";
import { useGetTicketByAddress } from "../../hooks/useGetTicketByAddress";
import { useGetTicketPrice } from "../../hooks/useGetTicketPrice";
import { useGetWinningNumber } from "../../hooks/useGetWinningNumber";
import { LotteryTicketInfo } from "../LotteryTicketInfo/LotteryTicketInfo";

import { PurchaseLotteryTicketButton } from "../PurchaseLotteryTicketButton/PurchaseLotteryTicketButton";

export const PurchaseLotteryTicket = () => {
  const { account } = useEthers();
  const { ticketPrice } = useGetTicketPrice();
  const { currentTicketNumber } = useGetCurrentTicketNumber();
  const { maxTicketCount } = useGetMaxTicketCount();
  const { ticketNumber: userTicketNumber } = useGetTicketByAddress({
    address: account,
  });
  const { state } = useGetLotteryState();
  const { winningNumber } = useGetWinningNumber();

  const lotteryCompleted = state === 1 && !!winningNumber;

  return (
    <div>
      {lotteryCompleted && (
        <LotteryEndNotice>
          The winning number been drawn for this lottery. The winning number is{" "}
          {winningNumber}
        </LotteryEndNotice>
      )}
      <Section>
        <SectionLabel>Total prize:</SectionLabel>{" "}
        {!!ticketPrice && !!maxTicketCount && (
          <SectionContent>
            {ethers.utils.formatEther(
              (BigInt(ticketPrice) * BigInt(maxTicketCount)).toString()
            )}{" "}
            ETH
          </SectionContent>
        )}
      </Section>
      <Section>
        <SectionLabel>Available tickets:</SectionLabel>
        {!!currentTicketNumber && !!maxTicketCount && (
          <SectionContent>
            {(BigInt(maxTicketCount) - BigInt(currentTicketNumber)).toString()}
          </SectionContent>
        )}
      </Section>
      <Section>
        <SectionLabel>Total tickets available</SectionLabel>
        {maxTicketCount && <SectionContent>{maxTicketCount}</SectionContent>}
      </Section>
      <Section>
        <SectionLabel>Ticket price:</SectionLabel>
        {!!ticketPrice && (
          <SectionContent>
            {ethers.utils.formatEther(ticketPrice)} ETH
          </SectionContent>
        )}
      </Section>

      {!lotteryCompleted && userTicketNumber === "0" && (
        <PurchaseLotteryTicketButton />
      )}
      {userTicketNumber !== "0" && (
        <LotteryTicketInfo ticketNumber={userTicketNumber} />
      )}
    </div>
  );
};

const LotteryEndNotice = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-size: 20px;
  color: white;
  background: green;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
`;
const SectionLabel = styled.div`
  font-size: 20px;
  padding-right: 8px;
`;

const SectionContent = styled.div`
  font-size: 20px;
  font-weight: bold;
`;
