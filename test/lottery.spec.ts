import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, deployments, network, run, getChainId } from "hardhat";
import { Deployment } from "hardhat-deploy/dist/types";
import { LinkToken, Lottery } from "../typechain";

const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");

describe("Lottery", function () {
  let runTest = false;
  let lottery: Lottery;
  let link: LinkToken;
  let LinkToken: Deployment;
  let VRFCoordinatorMock: Deployment;
  let owner: SignerWithAddress;
  let oracle: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;

  beforeEach(async () => {
    // Ensure we only run the tests in development chains
    if (developmentChains.includes(network.name)) {
      runTest = true;
    }
    // Assign accounts
    [owner, oracle, alice, bob] = await ethers.getSigners();

    // Deploy necesary contracts
    await deployments.fixture(["lottery"]);
    const LotteryDeployment = await deployments.get("Lottery");
    LinkToken = await deployments.get("LinkToken");
    VRFCoordinatorMock = await deployments.get("VRFCoordinatorMock");

    // Save the Lottery contract
    lottery = await ethers.getContractAt(
      "Lottery",
      LotteryDeployment.address,
      owner
    );
    link = await ethers.getContractAt("LinkToken", LinkToken.address, owner);
  });

  it("Contract initializes with correct state", async () => {
    if (!runTest) {
      return;
    }
    const chainId = await getChainId();
    const ticketPrice: string = networkConfig[chainId].ticketPrice;
    const maxTicketCount: string = networkConfig[chainId].maxTicketCount;

    expect(await lottery.ticketPrice()).to.equal(ticketPrice);
    expect(await lottery.maxTicketCount()).to.equal(maxTicketCount);
    expect(await lottery.isPrizeClaimAttempted()).to.be.false;
    expect(await lottery.lotteryState()).to.equal(0);
  });

  it("User can purchase a ticket for the correct amount", async () => {
    if (!runTest) {
      return;
    }

    const ticketPrice = await lottery.ticketPrice();

    // Alice purchases a ticket.
    const transaction = await lottery.connect(alice).purchaseTicket({
      value: ticketPrice.toString(),
    });
    await transaction.wait();

    const purchasedTicket = await lottery.ticketHoldersToTicket(alice.address);
    const currentLotteryNumber = await lottery.getCurrentTicketNumber();
    expect(purchasedTicket.number).to.equal(1);
    expect(currentLotteryNumber).to.equal(1);
  });

  it("User can't purchase a ticket for the incorrect amount", async () => {
    if (!runTest) {
      return;
    }

    await expect(
      lottery.connect(alice).purchaseTicket({
        value: "0",
      })
    ).to.be.revertedWith("Please pay the correct amount for the lottery");
  });

  it("User can't purchase more than one ticket", async () => {
    if (!runTest) {
      return;
    }

    const ticketPrice = await lottery.ticketPrice();

    // Alice purchases a ticket.
    const transaction = await lottery.connect(alice).purchaseTicket({
      value: ticketPrice.toString(),
    });
    await transaction.wait();

    await expect(
      lottery.connect(alice).purchaseTicket({
        value: ticketPrice.toString(),
      })
    ).to.be.revertedWith("This wallet has already entered the lottery");
  });

  it("Winning number is drawn when lottery is at capacity", async () => {
    if (!runTest) {
      return;
    }

    // Fund our contract with LINK
    await run("fund-link", {
      contract: lottery.address,
      linkaddress: LinkToken.address,
    });

    const ticketPrice = await lottery.ticketPrice();

    // Alice purchases a ticket
    const firstTransaction = await lottery.connect(alice).purchaseTicket({
      value: ticketPrice.toString(),
    });
    await firstTransaction.wait();

    // Bob purchases a ticket
    const secondTransaction = await lottery.connect(bob).purchaseTicket({
      value: ticketPrice.toString(),
    });
    const secondTransactionReceipt = await secondTransaction.wait();

    // Obtain the VRF requestId from the second(bob's) transaction
    const secondTransactionRequestId =
      secondTransactionReceipt.events![4].topics[1];

    // Mock the VRF coordinator
    const vrfCoordinatorMock = await ethers.getContractAt(
      "VRFCoordinatorMock",
      VRFCoordinatorMock.address,
      oracle
    );
    await vrfCoordinatorMock.callBackWithRandomness(
      secondTransactionRequestId,
      9999999,
      lottery.address
    );

    expect(await lottery.winningNumber()).to.equal(2);
  });

  it("Lottery balance is transferred to the winner", async () => {
    if (!runTest) {
      return;
    }

    // Fund our contract with LINK
    await run("fund-link", {
      contract: lottery.address,
      linkaddress: LinkToken.address,
    });

    const ticketPrice = await lottery.ticketPrice();

    // Alice purchases a ticket
    const initialTicketHolderBalance = await alice.getBalance();
    const firstTransaction = await lottery.connect(alice).purchaseTicket({
      value: ticketPrice.toString(),
    });
    await firstTransaction.wait();

    // Bob purchases a ticket
    const initialWinnerBalance = await bob.getBalance();
    const secondTransaction = await lottery.connect(bob).purchaseTicket({
      value: ticketPrice.toString(),
    });
    const secondTransactionReceipt = await secondTransaction.wait();

    // Obtain the VRF requestId from the second(bob's) transaction
    const secondTransactionRequestId =
      secondTransactionReceipt.events![4].topics[1];

    // Mock the VRF coordinator
    const vrfCoordinatorMock = await ethers.getContractAt(
      "VRFCoordinatorMock",
      VRFCoordinatorMock.address,
      oracle
    );
    await vrfCoordinatorMock.callBackWithRandomness(
      secondTransactionRequestId,
      9999999,
      lottery.address
    );

    const lotteryBalance = await lottery.getLotteryBalance();
    const lotteryState = await lottery.lotteryState();
    const isPrizeClaimAttempted = await lottery.isPrizeClaimAttempted();
    const winnerBalance = await bob.getBalance();
    const ticketHolderBalance = await alice.getBalance();

    expect(lotteryBalance).to.equal("0");
    expect(lotteryState).to.equal(1);
    expect(isPrizeClaimAttempted).to.be.true;
    expect(winnerBalance.gt(initialWinnerBalance)).to.be.true;
    expect(ticketHolderBalance.lt(initialTicketHolderBalance)).to.be.true;
  });
  it("Owner can withdraw leftover LINK", async () => {
    if (!runTest) {
      return;
    }

    // Fund our contract with LINK
    await run("fund-link", {
      contract: lottery.address,
      linkaddress: LinkToken.address,
    });

    const receipt = await lottery.withdrawERC20(link.address, owner.address);

    expect(receipt.to).to.eq(lottery.address);
  });
  it("Non owner can't withdraw leftover LINK", async () => {
    if (!runTest) {
      return;
    }

    // Fund our contract with LINK
    await run("fund-link", {
      contract: lottery.address,
      linkaddress: LinkToken.address,
    });

    await expect(
      lottery.connect(alice).withdrawERC20(link.address, owner.address)
    ).to.be.revertedWith("");
  });
});
