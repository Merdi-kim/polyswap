import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ARRTOKEN, Swapper } from "../typechain-types";

const {log} = console

describe('Swapper contract', () => {

  /********** ARR TOKEN **********/
  let arrDeployer: SignerWithAddress;
  let arrAddress: string;
  let arrContract: ARRTOKEN;

  /********** DBX TOKEN **********/
  let dbxDeployer: SignerWithAddress;
  let dbxAddress: string;
  let dbxContract: ARRTOKEN;

  /********** swapper contract **********/
  let swapperContract: Swapper;

  it('should deploy ARR token', async() => {
    const [user1, user2] = await ethers.getSigners()
    const ARR = await ethers.getContractFactory("ARRTOKEN")
    const DBX = await ethers.getContractFactory("DBXTOKEN")
    const arr = await ARR.connect(user2).deploy()
    const dbx = await DBX.connect(user2).deploy()
    arrAddress = arr.address
    arrContract = arr
    arrDeployer = user2
    dbxAddress = dbx.address
    dbxContract = dbx
    dbxDeployer = user2
    const arrDeployerBalance =ethers.utils.formatEther(await arr.balanceOf(user2.address))
    const dbxDeployerBalance =ethers.utils.formatEther(await dbx.balanceOf(user2.address))
    expect(Number(arrDeployerBalance)).to.equal(20000)
    expect(Number(dbxDeployerBalance)).to.equal(20000)
    expect(await arr.owner()).to.equal(user2.address)
    expect(await dbx.owner()).to.equal(user2.address)
  })

  it('should swap ARR and DBX tokens', async() => {
    const [user1, user2] = await ethers.getSigners()
    const Swapper = await ethers.getContractFactory("Swapper") 
    const swapper = await Swapper.connect(user2).deploy() 
    swapperContract = swapper
    const tokensToSwap = ethers.utils.parseEther('15000')
    await arrContract.connect(arrDeployer).approve(swapper.address, tokensToSwap)
    await dbxContract.connect(dbxDeployer).approve(swapper.address, tokensToSwap)
    await swapper.connect(arrDeployer).swap(arrAddress, tokensToSwap)
    await swapper.connect(dbxDeployer).swap(dbxAddress, tokensToSwap)
    const contractBalance1 = ethers.utils.formatEther( await arrContract.balanceOf(swapper.address) )
    const contractBalance2 = ethers.utils.formatEther( await dbxContract.balanceOf(swapper.address) )
    log({contractBalance1, contractBalance2})
  })

  it('should unswap ZEX TOKENS', async() => {
    const tokensToSwap = ethers.utils.parseEther('15000')
    //await swapperContract.connect(arrDeployer).approve(swapperContract.address, tokensToSwap)
    await swapperContract.connect(arrDeployer).unswap(arrAddress, tokensToSwap)
  })
})