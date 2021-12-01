import styled from "styled-components";

type LotteryTicketInfoProps = {
  ticketNumber: string;
};

export const LotteryTicketInfo = ({ ticketNumber }: LotteryTicketInfoProps) => {
  return (
    <LotteryTicketInfoWrapper>
      <LotteryTicket>
        <TicketLabel>Your ticket number is</TicketLabel>
        {ticketNumber}
      </LotteryTicket>
    </LotteryTicketInfoWrapper>
  );
};

const LotteryTicketInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
`;

const LotteryTicket = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  padding: 40px;
  border-radius: 4px;
  background: #ff5733;
  color: #ffffff;
  font-size: 50px;
  font-weight: bold;
  vertical-align: baseline;
  line-height: 1;
`;

const TicketLabel = styled.div`
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 20px;
`;
