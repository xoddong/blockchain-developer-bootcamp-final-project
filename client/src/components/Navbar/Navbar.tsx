import { useEthers, shortenAddress } from "@usedapp/core";

import styled from "styled-components";

export const Navbar = () => {
  const { account, activateBrowserWallet } = useEthers();

  const onConnect = async () => {
    await activateBrowserWallet();
  };

  return (
    <NavbarWrapper>
      <Title>Simple Lottery</Title>
      <div>
        {!account && <Button onClick={onConnect}>Connect wallet</Button>}
        {account && <p>Account: {shortenAddress(account)}</p>}
      </div>
    </NavbarWrapper>
  );
};

const NavbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: bold;

  font-size: 24px;
`;

const Button = styled.button`
  background: #ff5733;
  color: #ffffff;

  border: 0;
  border-radius: 4px;
  padding: 8px 16px;

  cursor: pointer;
  &:hover {
    background: #cc5500;
  }
`;
