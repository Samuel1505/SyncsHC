import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  principalCV,
  getAddressFromPrivateKey,
} from "@stacks/transactions";
import { createNetwork, ChainId } from "@stacks/network";
import { Wallet } from "@stacks/keychain";

// Configuration
const DEPLOYER_ADDRESS = process.env.CONTRACT_ADDRESS || "SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF";
const NETWORK_NAME = process.env.NETWORK || "mainnet";
const API_URL = NETWORK_NAME === "mainnet"
  ? "https://api.hiro.so"
  : "https://api.testnet.hiro.so";

const network = createNetwork({
  network: NETWORK_NAME === "mainnet" ? "mainnet" : "testnet",
  client: {
    baseUrl: API_URL,
  },
});

interface ContractFunction {
  name: string;
  getArgs: (sender: string) => any[];
}

interface ContractInfo {
  address: string;
  name: string;
  functions: ContractFunction[];
}

const contracts: ContractInfo[] = [
  {
    address: DEPLOYER_ADDRESS,
    name: "piggy-bank",
    functions: [
      { name: "deposit-stx", getArgs: () => [uintCV(1)] },
      { name: "set-lock-duration", getArgs: () => [uintCV(100)] },
      { name: "withdraw", getArgs: () => [uintCV(1)] },
    ]
  },
  {
    address: DEPLOYER_ADDRESS,
    name: "piggy-bank-factory",
    functions: [
      { name: "register-piggy-bank", getArgs: (sender) => [principalCV(`${sender}.dummy-bank-${Math.floor(Math.random() * 1000)}`)] },
      { name: "unregister-piggy-bank", getArgs: (sender) => [principalCV(`${sender}.dummy-bank-${Math.floor(Math.random() * 1000)}`)] },
    ]
  },
  {
    address: DEPLOYER_ADDRESS,
    name: "token-manager",
    functions: [
      { name: "add-supported-token", getArgs: () => [principalCV(`${DEPLOYER_ADDRESS}.dummy-token`)] },
      { name: "remove-supported-token", getArgs: () => [principalCV(`${DEPLOYER_ADDRESS}.dummy-token`)] },
      { name: "transfer-ownership", getArgs: (sender) => [principalCV(sender)] },
    ]
  }
];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAccountInfo(address: string) {
  try {
    const response = await fetch(`${API_URL}/v2/accounts/${address}?proof=0`);
    if (!response.ok) return { balance: BigInt(0), nonce: 0 };
    const account = await response.json();
    return {
      balance: BigInt(account.balance || 0),
      nonce: account.nonce || 0,
    };
  } catch {
    return { balance: BigInt(0), nonce: 0 };
  }
}

async function spamFarm() {
  console.log("🚀 Stacks Transaction Spam Farm (Multi-Contract Edition) 🚀");
  console.log("-----------------------------------------");
  console.log(`Network: ${NETWORK_NAME.toUpperCase()}`);
  console.log(`Deployer: ${DEPLOYER_ADDRESS}`);
  console.log(`Contracts being targeted: ${contracts.map(c => c.name).join(", ")}`);
  console.log("Press Ctrl+C to stop at any time.");
  console.log("-----------------------------------------");

  let privateKey = process.env.STACKS_PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ ERROR: STACKS_PRIVATE_KEY environment variable is not set.");
    console.log("Usage: STACKS_PRIVATE_KEY='your key or mnemonic' tsx scripts/spam-farm.ts");
    process.exit(1);
  }

  // Handle mnemonic
  if (privateKey.trim().split(/\s+/).length >= 12) {
    console.log("📝 Detected mnemonic phrase. Deriving private key...");
    const chainId = NETWORK_NAME === "mainnet" ? ChainId.Mainnet : ChainId.Testnet;
    try {
      const wallet = await Wallet.restore("", privateKey, chainId as any);
      privateKey = wallet.stacksPrivateKey.toString("hex");
    } catch (e: any) {
      console.error("❌ ERROR: Failed to restore wallet from mnemonic:", e.message);
      process.exit(1);
    }
  }

  const senderAddress = getAddressFromPrivateKey(privateKey);
  console.log(`Sender Address: ${senderAddress}`);

  let txCount = 0;
  let keepRunning = true;

  process.on("SIGINT", () => {
    console.log("\n🛑 Stopping spam farm...");
    keepRunning = false;
  });

  // Fetch initial nonce once at the beginning
  const accountInfo = await getAccountInfo(senderAddress);
  let currentNonce = accountInfo.nonce;

  while (keepRunning) {
    try {


      // Pick random contract and function
      const contract = contracts[Math.floor(Math.random() * contracts.length)];
      const func = contract.functions[Math.floor(Math.random() * contract.functions.length)];

      console.log(`\n[TX #${txCount + 1}] Target: ${contract.name} -> ${func.name} (Nonce: ${currentNonce})`);

      const fee = BigInt(2500); // 0.0025 STX fee

      const txOptions = {
        contractAddress: contract.address,
        contractName: contract.name,
        functionName: func.name,
        functionArgs: func.getArgs(senderAddress),
        senderKey: privateKey,
        fee: fee,
        nonce: currentNonce,
        network: network,
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
      };

      const transaction = await makeContractCall(txOptions);
      const broadcastResponse = await broadcastTransaction({ transaction, network });

      if ("error" in broadcastResponse) {
        console.error("❌ Broadcast Error:", broadcastResponse.error);
        if ("reason" in broadcastResponse) {
          console.error("   Reason:", broadcastResponse.reason);
          // If nonce is bad, refresh it
          const reason = broadcastResponse.reason as any;
          if (reason === "BadNonce" || reason === "ConflictingNonceInMempool") {
            console.log(`🔄 Nonce conflict/bad: ${currentNonce}. Incrementing to try next...`);
            currentNonce++; 
          }
        }

      } else {
        console.log(`✅ Success! TXID: 0x${broadcastResponse.txid}`);
        console.log(`🔗 Explorer: https://explorer.hiro.so/txid/0x${broadcastResponse.txid}?chain=${NETWORK_NAME}`);
        txCount++;
        currentNonce++;
      }

      // 10-second delay to stay within Mempool chaining limits and avoid API rate limits
      await sleep(10000);

    } catch (error: any) {
      console.error("⚠️ Unexpected Error:", error.message);
      // If we get an error, wait longer before retrying to let the API/Mempool cool down
      // We DO NOT reset currentNonce here anymore. We trust our count.
      await sleep(5000);
    }


  }

  console.log("-----------------------------------------");
  console.log(`🏁 Summary: Sent ${txCount} transactions.`);
}

spamFarm();
