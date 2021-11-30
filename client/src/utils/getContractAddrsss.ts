import { ChainId, getChainName } from "@usedapp/core";

import deploysMap from "../artifacts/deploys.json";

type getContractAddrsssProps = {
  chainId: ChainId;
  contract: string;
};

export const getContractAddrsss = ({
  chainId,
  contract,
}: getContractAddrsssProps) => {
  const chainName = getChainName(chainId)?.toLocaleLowerCase();

  return (deploysMap as any)[chainId]?.[chainName]?.contracts?.[contract]
    ?.address;
};
