export interface networkConfigItem {
  name: string;
  chainlinkFee: string;
  ticketPrice: string;
  keyHash: string;
  entranceFee: string;
  linkToken?: string;
  vrfCoordinator?: string;
  maxTicketCount: string;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  default: {
    name: "hardhat",
    chainlinkFee: "100000000000000000",
    entranceFee: "100000000000000000",
    ticketPrice: "100000000000000000",
    keyHash:
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    maxTicketCount: "2",
  },
  31337: {
    name: "localhost",
    chainlinkFee: "100000000000000000",
    entranceFee: "100000000000000000",
    ticketPrice: "100000000000000000",
    keyHash:
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    maxTicketCount: "2",
  },
  42: {
    name: "kovan",
    linkToken: "0xa36085F69e2889c224210F603D836748e7dC0088",
    keyHash:
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    vrfCoordinator: "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    chainlinkFee: "100000000000000000",
    entranceFee: "100000000000000000",
    ticketPrice: "100000000000000000",
    maxTicketCount: "4",
  },
};

export const developmentChains = ["hardhat", "localhost"];
