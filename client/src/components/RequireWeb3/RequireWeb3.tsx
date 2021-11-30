import { useEthers } from "@usedapp/core";

type RequireWeb3Props = {
  error?: Error;
};

export const RequireWeb3 = ({ error }: RequireWeb3Props) => {
  const { activateBrowserWallet, deactivate, account } = useEthers();

  return (
    <div>
      <div>MetaMask is required to use this application.</div>
      <div>
        If you do not have a MetaMask, you can download it{" "}
        <a
          rel="noopener noreferrer nofollow"
          target="_blank"
          href="https://metamask.io/download"
        >
          here
        </a>
      </div>
      {account ? (
        <button onClick={() => deactivate()}>Disconnect</button>
      ) : (
        <div>
          <button onClick={() => activateBrowserWallet()}>Connect</button>
        </div>
      )}
      {account && <p>Account: {account}</p>}
    </div>
  );
};
