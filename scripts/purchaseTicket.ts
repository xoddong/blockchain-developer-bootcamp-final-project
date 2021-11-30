/* eslint-disable no-process-exit */
import { /* run, */ ethers, deployments } from "hardhat";

export async function purchaseTicket() {
  // await run('compile') only needed when deploying in a script
  const { get } = deployments;

  const accounts = await ethers.getSigners();

  const Lottery = await ethers.getContractFactory("Lottery");
  const LotteryDeployment = await get("Lottery");
  // // eslint-disable-next-line no-undef
  const lottery = new ethers.Contract(
    LotteryDeployment.address,
    Lottery.interface,
    accounts[0]
  );
  const ticketPrice = await lottery.ticketPrice();
  const purchaseTx = await lottery.purchaseTicket({
    value: ticketPrice.toString(),
  });
  await purchaseTx.wait();
  console.log("You have purchased a ticket!");
  return purchaseTx;
}

purchaseTicket()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
