import { ethers } from "hardhat";

async function main() {
  const ArrToken = await ethers.getContractFactory("ARRTOKEN")
  const DbxToken = await ethers.getContractFactory("DBXTOKEN")
  const Swapper = await ethers.getContractFactory("Swapper")
  const arrToken = await ArrToken.deploy()
  const dbxToken = await DbxToken.deploy()
  const swapper = await Swapper.deploy()
  await arrToken.deployed()
  await dbxToken.deployed()
  await swapper.deployed()
  console.log(`Arr token contract deployed to: ${arrToken.address}`)
  console.log(`Dbx token contract deployed to: ${dbxToken.address}`)
  console.log(`Swapper contract deployed to: ${swapper.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
