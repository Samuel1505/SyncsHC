import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  getAddressFromPrivateKey,
  Cl
} from '@stacks/transactions';
import { STACKS_MAINNET } from '@stacks/network';
import { generateWallet } from '@stacks/wallet-sdk';

// We use the Mainnet network as requested
const network = STACKS_MAINNET;

// Deployer address provided by user
const deployerAddress = 'SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF';

async function main() {
  // Pass the mnemonic phrase here instead of the hex private key
  const SENDER_MNEMONIC = process.env.SENDER_KEY;

  if (!SENDER_MNEMONIC) {
    console.error("❌ Missing SENDER_KEY environment variable!");
    console.error("Usage: SENDER_KEY=\"your twenty four word mnemonic phrase here\" npx tsx scripts/spam-farm.ts");
    process.exit(1);
  }

  console.log("Deriving private key from mnemonic...");
  
  // Generate wallet from mnemonic
  const wallet = await generateWallet({
    secretKey: SENDER_MNEMONIC,
    password: 'password' // A generic password as we don't store the encrypted wallet
  });

  // Since generateWallet generates only 1 account by default, account 0 is wallet.accounts[0]
  const SENDER_KEY = wallet.accounts[0].stxPrivateKey;

  const senderAddress = getAddressFromPrivateKey(SENDER_KEY, "mainnet");

  console.log(`🌾 Starting SyncsHC farming script for address: ${senderAddress}`);

  let currentNonce = await getCurrentNonce(senderAddress);
  console.log(`🚀 Starting with nonce: ${currentNonce}`);

  // Define the list of smart contract functions to randomly/sequentially interact with.
  // We include every public function found in the SyncsHC contracts.
  const actions = [
    // --- piggy-bank-factory ---
    {
      contractName: 'piggy-bank-factory',
      functionName: 'register-piggy-bank',
      functionArgs: [Cl.contractPrincipal(deployerAddress, 'sysnc')]
    },
    {
      contractName: 'piggy-bank-factory',
      functionName: 'unregister-piggy-bank',
      functionArgs: [Cl.contractPrincipal(deployerAddress, 'sysnc')]
    },

    // --- piggy-bank ---
    {
      contractName: 'piggy-bank',
      functionName: 'deposit-stx',
      functionArgs: [Cl.uint(1000000)] // 1 STX
    },
    {
      contractName: 'piggy-bank',
      functionName: 'set-lock-duration',
      functionArgs: [Cl.uint(144)] // ~1 day (144 blocks)
    },
    {
      contractName: 'piggy-bank',
      functionName: 'withdraw',
      functionArgs: [Cl.uint(500000)] 
    },
    {
      contractName: 'piggy-bank',
      functionName: 'deposit-token',
      functionArgs: [Cl.uint(1000), Cl.contractPrincipal(deployerAddress, 'sysnc')]
    },

    // --- token-manager ---
    {
      contractName: 'token-manager',
      functionName: 'add-supported-token',
      functionArgs: [Cl.contractPrincipal(deployerAddress, 'sysnc')]
    },
    {
      contractName: 'token-manager',
      functionName: 'remove-supported-token',
      functionArgs: [Cl.contractPrincipal(deployerAddress, 'sysnc')]
    },
    {
      contractName: 'token-manager',
      functionName: 'transfer-ownership',
      functionArgs: [Cl.standardPrincipal(senderAddress)]
    },

  ];

  let actionIndex = 0;

  console.log("Press Ctrl+C to stop the terminal and end the looping... \n");

  while (true) {
    const action = actions[actionIndex % actions.length];
    
    console.log(`\n⏳ Crafting Tx (Nonce: ${currentNonce}): ${deployerAddress}.${action.contractName} -> ${action.functionName}`);
    
    try {
      const txOptions = {
        contractAddress: deployerAddress,
        contractName: action.contractName,
        functionName: action.functionName,
        functionArgs: action.functionArgs,
        senderKey: SENDER_KEY,
        validateWithAbi: false,
        network,
        postConditionMode: PostConditionMode.Allow, // Allows changing any state
        anchorMode: AnchorMode.Any,
        nonce: BigInt(currentNonce),
        fee: 10000n // 0.01 STX transaction fee.
      };

      // 1. Make the contract call transaction
      const transaction = await makeContractCall(txOptions);
      
      // 2. Broadcast the transaction
      const broadcastResponse = await broadcastTransaction({ transaction, network });

      if ('error' in broadcastResponse) {
        console.error(`❌ Broadcast failed: ${broadcastResponse.reason} - ${broadcastResponse.error}`);
        // If nonce error or other error, delay a bit and refetch nonce
        console.log("Retrying in 10 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 10000));
        currentNonce = await getCurrentNonce(senderAddress); 
      } else {
        console.log(`✅ Tx published! TxID: ${broadcastResponse.txid}`);
        // Locally increment nonce for the next immediate transaction without waiting for block confirmation
        currentNonce++; 
      }
    } catch (error) {
      console.error(`❌ Error creating/broadcasting transaction:`, error);
      // Wait a bit before next attempt on error
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    actionIndex++;
    
    // Configurable delay (e.g. 5000 ms) before the next tx
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

async function getCurrentNonce(senderAddress: string) {
  try {
    const url = `${network.client.baseUrl}/v2/accounts/${senderAddress}?proof=0`;
    const res = await fetch(url);
    const data = (await res.json()) as { nonce: number };
    return data.nonce;
  } catch (error) {
    console.error("Failed to fetch nonce, defaulting to 0", error);
    return 0;
  }
}

main().catch(console.error);
