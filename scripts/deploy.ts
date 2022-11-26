import { ethers } from "hardhat";

async function main() {
  const lockedAmount = ethers.utils.parseEther("1");

  const ArrToken = await ethers.getContractFactory("ARRTOKEN");
  const arrToken = await ArrToken.deploy()
  await arrToken.deployed();
  console.log(`Contract deployed at address: ${arrToken.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
