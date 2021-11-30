import { useEthers } from "@usedapp/core";
import { utils, constants } from "ethers";

import Lottery from "../artifacts/contracts/Lottery.sol/Lottery.json";
import { getContractAddrsss } from "../utils/getContractAddrsss";

export const useGetLotteryContract = (): {
  lotteryContractAddress: string;
  lotteryInterface: utils.Interface;
} => {
  const { chainId } = useEthers();
  const { abi } = Lottery;
  const lotteryContractAddress = chainId
    ? getContractAddrsss({
        chainId,
        contract: "Lottery",
      })
    : constants.AddressZero;
  const lotteryInterface = new utils.Interface(abi);

  return {
    lotteryContractAddress,
    lotteryInterface,
  };
};
