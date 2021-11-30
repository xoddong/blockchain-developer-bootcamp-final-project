/* eslint-disable node/no-unpublished-import */
import { HardhatRuntimeEnvironment } from "hardhat/types";
// eslint-disable-next-line node/no-missing-import
import { DeployFunction } from "hardhat-deploy/types";
import { Deployment } from "hardhat-deploy/dist/types";
import { networkConfig } from "../helper-hardhat-config";

const deployLottery: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  let linkTokenAddress: string,
    vrfCoordinatorAddress: string,
    linkToken: Deployment,
    VRFCoordinatorMock: Deployment;
  let additionalMessage = "";

  // kovan
  if (chainId === "31337") {
    linkToken = await get("LinkToken");
    VRFCoordinatorMock = await get("VRFCoordinatorMock");
    linkTokenAddress = linkToken.address;
    vrfCoordinatorAddress = VRFCoordinatorMock.address;
    additionalMessage = " --linkaddress " + linkTokenAddress;
  } else {
    linkTokenAddress = networkConfig[chainId].linkToken!;
    vrfCoordinatorAddress = networkConfig[chainId].vrfCoordinator!;
  }
  const keyHash: string = networkConfig[chainId].keyHash;
  const chainlinkFee: string = networkConfig[chainId].chainlinkFee;
  const ticketPrice: string = networkConfig[chainId].ticketPrice;
  const maxTicketCount: string = networkConfig[chainId].maxTicketCount;

  const lottery = await deploy("Lottery", {
    from: deployer,
    args: [
      linkTokenAddress,
      keyHash,
      vrfCoordinatorAddress,
      chainlinkFee,
      ticketPrice,
      maxTicketCount,
    ],
    log: true,
  });
  const networkWorkName: string = networkConfig[chainId].name;

  log("Run the following command to fund contract with LINK:");
  log(
    "npx hardhat fund-link --contract " +
      lottery.address +
      " --network " +
      networkWorkName +
      additionalMessage
  );
};
export default deployLottery;
deployLottery.tags = ["all", "lottery"];
