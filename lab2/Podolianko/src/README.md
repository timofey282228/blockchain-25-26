# Blockchain... Lab 2

`contracts/SimpleAuction.sol` was taken from [Solidity by Example](https://docs.soliditylang.org/en/latest/solidity-by-example.html).
`contracts/SimpleAuctionOptimized.sol` is its modified version.

```shell
REPORT_GAS=true npx hardhat test
npx hardhat node &
npx hardhat ignition deploy ignition/modules/Crowdfunding.ts --network localhost
# run some operations on deployed Crowdfunding contract
./client/crowdfundingTest.js
```
