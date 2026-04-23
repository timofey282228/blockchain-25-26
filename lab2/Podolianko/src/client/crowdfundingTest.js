#! /usr/bin/env node

import { createPublicClient, createWalletClient, http, createTestClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { getContract } from 'viem'
import { hardhat } from "viem/chains"

import crowdfundingArtifact from "../artifacts/contracts/Crowdfunding.sol/Crowdfunding.json" with { type: 'json' };


// default hardhat contract address
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const targetChain = hardhat

export const testClient = createTestClient({
    chain: targetChain,
    mode: 'hardhat',
    transport: http(),
})

// top-3 default hardhat accounts
const accounts = ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a'
]

const publicClient = createPublicClient({
    chain: targetChain,
    transport: http(),
})

const [
    client0, client1, client2
] = accounts.map(
    (privateKey) => createWalletClient(
        {
            account: privateKeyToAccount(privateKey),
            chain: targetChain,
            transport: http()
        }
    )
)

const [
    client0crowdfunding, client1crowdfunding, client2crowdfunding
] = [
    client0, client1, client2
].map(
    (walletClient) => getContract({
        address: contractAddress,
        abi: crowdfundingArtifact.abi,
        client: {
            public: publicClient,
            wallet: walletClient,
        }
    })
)

console.log(`Initial crowdfunding balance: ${await client0crowdfunding.read.getBalance()}`)
await client1crowdfunding.write.contribute([], {
    address: contractAddress,
    value: 10,
    chainId: targetChain.id,
})
console.log(`Crowdfunding balance after contribution by 1: ${await client0crowdfunding.read.getBalance()}`)

await client2crowdfunding.write.contribute([], {
    address: contractAddress,
    value: 1000000000000000007n,
    chainId: targetChain.id,
})

console.log(`Crowdfunding balance after contribution by 2: ${await client0crowdfunding.read.getBalance()}`)
await testClient.increaseTime({
    seconds: 4000
})

const oldBalance = await publicClient.getBalance({
    address: client0.account.address,
})
console.log(`Owner balance: ${oldBalance}`)

await client0crowdfunding.write.withdraw([], {
    address: contractAddress,
    chainId: targetChain.id,
})

const newBalance = await publicClient.getBalance({
    address: client0.account.address,
})

console.log(`Owner balance after withdrawal (increased: ${newBalance > oldBalance}): ${newBalance}`)
