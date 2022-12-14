// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Zex_Token.sol";

contract Swapper is ZEXTOKEN {

   /**
    * @dev maps token addresses to a boolean
    * Boolean indicates the availability of the pool
   */
    mapping(address => bool) pools;

    uint256 tokenPrice = 1;
    
    /**
     * Convert an amount of input token_ to an equivalent amount of the output token 
     * 
     * @param token_ address of the token to swap 
     * @param amount amount of token to swap/receive 
     */

    function swap(address token_, uint amount) external {
        require(pools[token_] == true, 'null');
        IERC20(token_).transferFrom(msg.sender,address(this), amount);
        transfer(msg.sender, amount/tokenPrice);
    }

    /**
     * Convert an amount of the output token to an equivalent amount of input token_
     * 
     * @param token_ address of token to receive 
     * @param amount amount of token to swap/receive 
     */
    function unswap(address token_, uint amount) external {
       require(pools[token_] == true, 'null');
       require(balanceOf(msg.sender) >= amount/tokenPrice, 'Unsufficient balance');
       transfer(address(this), amount/tokenPrice);
       IERC20(token_).transfer(msg.sender, amount);
    }

    /**
     * Create a new pool to swap against
     * 
     * @param token_ address of token to be added to the pool
     */
    function createPool(address token_) external onlyOwner {
        require(pools[token_] == false, 'Already exists');
        pools[token_] = true;
    }

    function modifyTokenPrice(uint256 _price) external onlyOwner {
        tokenPrice = _price;
    }
}
