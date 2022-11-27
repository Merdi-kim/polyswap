# Polyswap

This project demonstrates a multi token swap feature. 

## CONTRACTS ADDRESSES ON MUMBAI TESTNET
- ARR TOKEN : 0x71EeA9bfD72769Cc91F9930d6dbC916536918165
- DBX TOKEN : 0xb7Fe00aa24B59667DC33cA96A6E56EE2E928D0a9
- SWAPPER : 0xC9829eF669E073FCC2ae68AbeB93A26d3C72229b

## PSEUDO CALL FOR SWAPPING
To be able to swap the ARR token to ZEX token, you'll do the following: 
- deploy ARR token (Done already)
- deploy the swapper (Done already)
- In the swapper contract, call **swap** function with two 
parameters(address of the deployed ARR token and the amount of ARR that you wish to swap)
- Once this is done, you'll receive ZEX tokens that are equivalent to the ARR tokens you provide according to the price. 

Then if you wish to go from ZEX tokens to DBX tokens, you'll do the following:
- call the **unswap** function from the swapper contract. This function takes in two parameters(address of the deployed DBX token and the amount of DBX that you wish to get). The function will let you know whether the DBX tokens that you wish to receive,
correspond to the amount of ZEX tokens that you currently hold.

## SET NEW PRICE FOR ZEX TOKEN
To set the new price for ZEX tokens, you will need to call a function nammed **modifyTokenPrice**. 
This function takes one parameter(the new token price). Only the owner of the contract can call this function.

## SWAP AGAIN WITH NEW PRICE 
This process will be the same as before but the output will change according to the new token price(ref tests).

Disclaimer: The contracts above are not meant to use in a production environment. They need to be tested heavily and reviewed. 