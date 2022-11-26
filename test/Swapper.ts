import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ARRTOKEN, Swapper } from "../typechain-types";

describe('Swapper contract', () => {

  /********** ARR TOKEN **********/
  let arrContract: ARRTOKEN;
  let deployer: SignerWithAddress;

  /********** DBX TOKEN **********/
  let dbxContract: ARRTOKEN;
  
  /********** swapper contract **********/
  let swapperContract: Swapper;

  describe('Contracts deployments', () => {
    it('should deploy ARR token and DBX token', async() => {
      const [user1, user2] = await ethers.getSigners()
      const ARR = await ethers.getContractFactory("ARRTOKEN")
      const DBX = await ethers.getContractFactory("DBXTOKEN")
      const arr = await ARR.connect(user2).deploy()
      const dbx = await DBX.connect(user2).deploy()
      arrContract = arr
      deployer = user2
      dbxContract = dbx
      const arrDeployerBalance =ethers.utils.formatEther(await arr.balanceOf(user2.address))
      const dbxDeployerBalance =ethers.utils.formatEther(await dbx.balanceOf(user2.address))
      expect(Number(arrDeployerBalance)).to.equal(20000)
      expect(Number(dbxDeployerBalance)).to.equal(20000)
      expect(await arr.owner()).to.equal(user2.address)
      expect(await dbx.owner()).to.equal(user2.address)
    })
    it('should deploy the swapper contract and add token pools', async() => {
      const [user1, user2] = await ethers.getSigners()
      const Swapper = await ethers.getContractFactory("Swapper")
      const swapper = await Swapper.connect(user2).deploy() 
      swapperContract = swapper
      await swapper.connect(deployer).createPool(arrContract.address)
      await swapper.connect(deployer).createPool(dbxContract.address)
      expect(swapper.address).not.to.equal(ethers.constants.AddressZero)
    })
  })

  describe('Swapper functionalities', () => {
    it('should swap ARR and DBX tokens', async() => {
      const [user1, user2] = await ethers.getSigners()
      const tokensToSwap = ethers.utils.parseEther('10000')
      await arrContract.connect(deployer).approve(swapperContract.address, tokensToSwap)
      await dbxContract.connect(deployer).approve(swapperContract.address, tokensToSwap)
      await swapperContract.connect(deployer).swap(arrContract.address, tokensToSwap)
      await swapperContract.connect(deployer).swap(dbxContract.address, tokensToSwap)
      const contractBalance = ethers.utils.formatEther( await arrContract.balanceOf(swapperContract.address) )
      expect(Number(contractBalance)).to.equal(10000)
    })
  
    it('should unswap ZEX TOKENS', async() => {
      const tokensToSwap = ethers.utils.parseEther('10000')
      //await swapperContract.connect(deployer).approve(swapperContract.address, tokensToSwap)
      await swapperContract.connect(deployer).unswap(arrContract.address, tokensToSwap)
    })
  })

  describe('should swap and unswap with new token price', () => {
    it('should modify token price', async() => {
      await swapperContract.connect(deployer).modifyTokenPrice(2)
    })

    it('should successfuly swap ARR with new price', async() => {
      const tokensToSwap = ethers.utils.parseEther('5000')
      await arrContract.connect(deployer).approve(swapperContract.address, tokensToSwap)
      await swapperContract.connect(deployer).swap(arrContract.address, tokensToSwap)
      const userBalance = ethers.utils.formatEther( await arrContract.balanceOf(deployer.address) )
      expect(Number(userBalance)).to.equal(15000)
    })

    it('should successfully swap ZEX tokens to ARR tokens', async() => {
      const tokensToReceive = ethers.utils.parseEther('5000')
      await swapperContract.connect(deployer).unswap(arrContract.address, tokensToReceive)
      const swapperBalance = ethers.utils.formatEther( await arrContract.balanceOf(deployer.address))
      expect(Number(swapperBalance)).to.equal(20000)
    })
  })

})