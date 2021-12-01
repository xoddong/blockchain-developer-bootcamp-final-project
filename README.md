# Simple Lottery

Simple Lottery is a decentralized take on reddit's /r/millionairemakers.
A player can purchase a lottery ticket with a "one ticket per address" limitation.
When all the tickets are sold, the winning number is drawn via Chainlink VRF.
The total prize pool is then automatically fowarded to the winner.

## My Ethereum address

0x9d3aDec7fb41447f1e744Fd3e73520AEf19Cc551

## Live

Visit https://blockchain-developer-bootcamp-final-project-6a69w4aq1-xoddong.vercel.app/

## Screencast

Part 1: https://www.loom.com/share/3b79fe9ffc3d41c584a06154014ee0b6?sharedAppSource=personal_library
Part 2: https://www.loom.com/share/1c8917da1b78474aad2ff444369f7622?sharedAppSource=personal_library

# Quickstart

## Requirements

- [nodejs](https://nodejs.org/en/)
  - Expected version "^12.0.0 || ^14.0.0 || >=16.0.0"
- [NPM](https://www.npmjs.com/) or [YARN](https://yarnpkg.com/)

## Installation

```sh
git clone https://github.com/xoddong/blockchain-developer-bootcamp-final-project
cd blockchain-developer-bootcamp-final-project

# install
yarn install
```

If you see the following error, please try running `yarn install` with [nvm](https://github.com/nvm-sh/nvm)

```sh
error hardhat@2.7.0: The engine "node" is incompatible with this module.
```

## Compile

```sh
yarn compile
```

Hardhat produces an `artifacts` directory for all the contrat builds. This project has configured the `artifacts` directory path to be "./client/src/artifacts" via hardhat.config.ts

## Deploy

```sh
yarn deploy:kovan
```

When deploying the contracts, please utilize the yarn commands.
The yarn commands add the flag [--export-all](https://github.com/wighawag/hardhat-deploy) to produce a mapping of all the contracts.
The frontend utilizes these files to get the deployed contract address

## Test

```sh
yarn test
```

Running the test will:

1. Deploy the contracts that match the fixture

```ts
await deployments.fixture(["lottery"]); // deploys files that have the matching tag: "lottery"
```

2. Runs the test

## Deploy to Kovan

To deploy to a testnet or a live network, you need the following environment variables:

1. KOVAN_RPC_URL=https://eth-ropsten.alchemyapi.io/v2/<YOUR ALCHEMY KEY>
2. PRIVATE_KEY=0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1

Your `KOVAN_RPC_URL` is the URL of your blockchain node, for example, from [alchemy](https://www.alchemy.com/).

Your `MNEMONIC` is the mnemonic phrases of your MetaMask.

You can set them in a file named `.env`. Please make sure you do not commit this file.

You'll also need testnet ETH and testnet LINK. You can [find both here.](https://faucets.chain.link/)

Once you do so, you can run:

```
yarn deploy:kovan
```

Fund your contract with LINK.

```
npx hardhat fund-link --contract insert-contract-address-here --network kovan
```

And purchase a lottery ticket

```
npx hardhat run scripts/purchaseTicket.ts --network kovan
```

## Client

You can interact with the deployed contract on Kovan in our client app.
To start the app:

```sh
cd client
yarn install
yarn start
```
