#!/usr/bin/env tsx
/**
 * Driver script to interact with the deployed PiggyBank contract on Stacks mainnet
 * 
 * Usage:
 *   STACKS_MNEMONIC="your twelve word mnemonic phrase" tsx driver.ts <command> [args...]
 *   STACKS_ACCOUNT_INDEX=0 tsx driver.ts <command> [args...]  # Optional: account index (default: 0)
 *   OR
 *   STACKS_PRIVATE_KEY=<your-key> tsx driver.ts <command> [args...]
 * 
 * To find your wallet address: tsx driver.ts list-addresses
 * 
 * Commands:
 *   deposit-stx <amount>                    - Deposit STX (amount in microstacks)
 *   deposit-token <amount> <token-address>  - Deposit fungible tokens
 *   set-lock-duration <duration>            - Set lock duration in blocks
 *   withdraw <amount>                       - Withdraw tokens
 *   get-balance <token-address> <owner>     - Get balance for owner
 *   get-lock-info <owner>                   - Get lock information
 *   is-lock-expired <owner>                 - Check if lock period expired
 *   get-remaining-lock-blocks <owner>       - Get remaining lock blocks
 *   get-account-balance                     - Get your STX account balance
 *   list-addresses [target-address] [max-index] - Search for your wallet address or list all addresses
 */

import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  getAddressFromPrivateKey,
  standardPrincipalCV,
  uintCV,
  contractPrincipalCV,
  ClarityValue,
  cvToHex,
} from '@stacks/transactions';
import { createNetwork } from '@stacks/network';
import type { StacksNetwork } from '@stacks/network';
import { deriveRootKeychainFromMnemonic } from '@stacks/keychain';

// Configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || 'SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF';
const CONTRACT_NAME = 'piggy-bank';
const NETWORK_NAME = process.env.NETWORK || 'mainnet';
const API_URL = NETWORK_NAME === 'mainnet' 
  ? 'https://api.hiro.so' 
  : 'https://api.testnet.hiro.so';

// Initialize network
const network: StacksNetwork = createNetwork({
  network: NETWORK_NAME === 'mainnet' ? 'mainnet' : 'testnet',
  client: {
    baseUrl: API_URL,
  },
});

/**
 * Derive private key from mnemonic using a specific derivation path
 */
async function derivePrivateKeyFromPath(mnemonic: string, derivationPath: string): Promise<string> {
  const rootKeychain = await deriveRootKeychainFromMnemonic(mnemonic);
  const stxKeychain = rootKeychain.derivePath(derivationPath);
  const privateKeyBuffer = stxKeychain.privateKey;
  if (!privateKeyBuffer) {
    throw new Error('Failed to derive private key from mnemonic');
  }
  // Convert Buffer to hex string
  return privateKeyBuffer.toString('hex');
}

/**
 * Derive private key from mnemonic for a specific account index
 */
async function derivePrivateKeyFromMnemonic(mnemonic: string, accountIndex: number = 0): Promise<string> {
  // Use custom derivation path if set, otherwise use standard path
  const customPath = process.env.STACKS_DERIVATION_PATH;
  if (customPath) {
    return await derivePrivateKeyFromPath(mnemonic, customPath);
  }
  // Default: Derive using Stacks standard path: m/44'/5757'/0'/0/{accountIndex}
  // Stacks coin type is 5757
  return await derivePrivateKeyFromPath(mnemonic, `m/44'/5757'/0'/0/${accountIndex}`);
}

/**
 * Get private key from mnemonic or use provided private key
 */
async function getPrivateKey(): Promise<string> {
  const mnemonic = process.env.STACKS_MNEMONIC;
  const privateKey = process.env.STACKS_PRIVATE_KEY;
  const accountIndex = parseInt(process.env.STACKS_ACCOUNT_INDEX || '0', 10);

  if (mnemonic) {
    // Derive private key from mnemonic using Stacks derivation path
    return await derivePrivateKeyFromMnemonic(mnemonic, accountIndex);
  } else if (privateKey) {
    return privateKey;
  } else {
    throw new Error('Either STACKS_MNEMONIC or STACKS_PRIVATE_KEY must be set');
  }
}

/**
 * Get the sender address from private key or mnemonic
 */
async function getSenderAddress(): Promise<string> {
  const privateKey = await getPrivateKey();
  return getAddressFromPrivateKey(privateKey);
}

/**
 * Get account information (balance, nonce, etc.)
 */
async function getAccountInfo(address: string): Promise<{ balance: bigint; nonce: number }> {
  try {
    const response = await fetch(`${API_URL}/v2/accounts/${address}?proof=0`);
    if (!response.ok) {
      throw new Error(`Failed to fetch account: ${response.statusText}`);
    }
    const account = await response.json();
    return {
      balance: BigInt(account.balance || 0),
      nonce: account.nonce || 0,
    };
  } catch (error) {
    console.error('Error fetching account info:', error);
    return { balance: BigInt(0), nonce: 0 };
  }
}

/**
 * Get the current nonce for an address
 */
async function getCurrentNonce(address: string): Promise<number> {
  const accountInfo = await getAccountInfo(address);
  return accountInfo.nonce;
}

/**
 * Broadcast a contract call transaction
 */
async function broadcastContractCall(
  functionName: string,
  functionArgs: ClarityValue[],
  amount?: bigint
): Promise<void> {
  try {
    const privateKey = await getPrivateKey();
    const senderAddress = await getSenderAddress();
    const nonce = await getCurrentNonce(senderAddress);

    const accountIndex = process.env.STACKS_ACCOUNT_INDEX || '0';
    console.log(`\n📤 Broadcasting transaction:`);
    console.log(`   Function: ${functionName}`);
    console.log(`   Sender: ${senderAddress}`);
    if (process.env.STACKS_MNEMONIC) {
      console.log(`   Account Index: ${accountIndex}`);
    }
    console.log(`   Nonce: ${nonce}`);
    if (amount) {
      console.log(`   STX Amount: ${amount} microstacks (${Number(amount) / 1_000_000} STX)`);
    }

    // Check account balance before proceeding
    const accountInfo = await getAccountInfo(senderAddress);
    const estimatedFee = BigInt(5000); // Conservative fee estimate (5,000 microstacks = 0.005 STX)
    const totalRequired = (amount || BigInt(0)) + estimatedFee;
    
    console.log(`   Account Balance: ${accountInfo.balance} microstacks (${formatSTX(accountInfo.balance)} STX)`);
    console.log(`   Estimated Fee: ${estimatedFee} microstacks (${formatSTX(estimatedFee)} STX)`);
    
    if (accountInfo.balance < totalRequired) {
      console.error(`\n❌ Insufficient funds!`);
      console.error(`   Required: ${totalRequired} microstacks (${formatSTX(totalRequired)} STX)`);
      console.error(`   Available: ${accountInfo.balance} microstacks (${formatSTX(accountInfo.balance)} STX)`);
      console.error(`   Shortfall: ${totalRequired - accountInfo.balance} microstacks (${formatSTX(totalRequired - accountInfo.balance)} STX)`);
      process.exit(1);
    }

    const txOptions = {
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: functionName,
      functionArgs: functionArgs,
      senderKey: privateKey,
      fee: estimatedFee,
      nonce: nonce,
      network: network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      ...(amount && { amount: amount }),
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction({ transaction, network });

    if ('error' in broadcastResponse) {
      console.error(`\n❌ Transaction failed:`, broadcastResponse.error);
      if ('reason' in broadcastResponse) {
        console.error(`   Reason:`, broadcastResponse.reason);
      }
      process.exit(1);
    }

    console.log(`\n✅ Transaction broadcasted successfully!`);
    console.log(`   TXID: ${broadcastResponse.txid}`);
    console.log(`   View on explorer: https://explorer.stacks.co/txid/${broadcastResponse.txid}`);
  } catch (error: any) {
    console.error(`\n❌ Error broadcasting transaction:`, error.message);
    if (error.stack) {
      console.error(`   Stack:`, error.stack);
    }
    process.exit(1);
  }
}

/**
 * Call a read-only function
 */
async function callReadOnly(
  functionName: string,
  functionArgs: ClarityValue[],
  callerAddress?: string
): Promise<any> {
  try {
    const argsHex = functionArgs.map(arg => cvToHex(arg));
    const caller = callerAddress || CONTRACT_ADDRESS;
    
    const url = `${API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/${functionName}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: caller,
        arguments: argsHex,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`\n❌ Error calling read-only function:`, error.message);
    throw error;
  }
}

/**
 * Parse principal address (supports both standard and contract principals)
 */
function parsePrincipal(address: string): ClarityValue {
  if (address.includes('.')) {
    const [contractAddress, contractName] = address.split('.');
    return contractPrincipalCV(contractAddress, contractName);
  }
  return standardPrincipalCV(address);
}

/**
 * Parse amount string (supports STX and microstacks)
 */
function parseAmount(amountStr: string): bigint {
  if (amountStr.includes('.')) {
    // Convert STX to microstacks
    const stx = parseFloat(amountStr);
    return BigInt(Math.floor(stx * 1_000_000));
  }
  return BigInt(amountStr);
}

/**
 * Format microstacks to STX
 */
function formatSTX(microstacks: bigint | number): string {
  const num = typeof microstacks === 'bigint' ? Number(microstacks) : microstacks;
  return (num / 1_000_000).toFixed(6);
}

/**
 * Main command handler
 */
async function main() {
  const mnemonic = process.env.STACKS_MNEMONIC;
  const privateKey = process.env.STACKS_PRIVATE_KEY;
  const readOnlyCommands = ['get-balance', 'get-lock-info', 'is-lock-expired', 'get-remaining-lock-blocks', 'list-addresses'];
  const needsAuth = !readOnlyCommands.includes(process.argv[2] || '');
  
  if (needsAuth && !mnemonic && !privateKey) {
    console.error('❌ Error: STACKS_MNEMONIC or STACKS_PRIVATE_KEY environment variable is required for write operations');
    console.error('   Set mnemonic with: export STACKS_MNEMONIC="your twelve word mnemonic phrase"');
    console.error('   OR set private key with: export STACKS_PRIVATE_KEY=<your-private-key>');
    console.error('   Private key should be in hex format (64 characters)');
    process.exit(1);
  }

  const command = process.argv[2];
  const args = process.argv.slice(3);

  console.log(`\n🔗 Connecting to Stacks ${NETWORK_NAME.toUpperCase()}`);
  console.log(`   Contract: ${CONTRACT_ADDRESS}.${CONTRACT_NAME}`);
  console.log(`   API: ${API_URL}\n`);

  try {
    switch (command) {
      case 'deposit-stx': {
        if (args.length < 1) {
          console.error('Usage: deposit-stx <amount>');
          console.error('   amount: Amount in microstacks (or STX with decimal, e.g., 1.5)');
          process.exit(1);
        }
        const amount = parseAmount(args[0]);
        await broadcastContractCall(
          'deposit-stx',
          [uintCV(amount)],
          amount // Include STX in the transaction
        );
        break;
      }

      case 'deposit-token': {
        if (args.length < 2) {
          console.error('Usage: deposit-token <amount> <token-address>');
          console.error('   amount: Amount in smallest unit');
          console.error('   token-address: Contract address (e.g., SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token)');
          process.exit(1);
        }
        const amount = BigInt(args[0]);
        const tokenAddress = parsePrincipal(args[1]);
        await broadcastContractCall(
          'deposit-token',
          [uintCV(amount), tokenAddress]
        );
        break;
      }

      case 'set-lock-duration': {
        if (args.length < 1) {
          console.error('Usage: set-lock-duration <duration>');
          console.error('   duration: Lock duration in blocks');
          process.exit(1);
        }
        const duration = BigInt(args[0]);
        await broadcastContractCall(
          'set-lock-duration',
          [uintCV(duration)]
        );
        break;
      }

      case 'withdraw': {
        if (args.length < 1) {
          console.error('Usage: withdraw <amount>');
          console.error('   amount: Amount to withdraw');
          process.exit(1);
        }
        const amount = BigInt(args[0]);
        await broadcastContractCall(
          'withdraw',
          [uintCV(amount)]
        );
        break;
      }

      case 'get-balance': {
        if (args.length < 2) {
          console.error('Usage: get-balance <token-address> <owner-address>');
          console.error('   token-address: Token contract address or principal');
          console.error('   owner-address: Owner principal address');
          process.exit(1);
        }
        const tokenAddress = parsePrincipal(args[0]);
        const ownerAddress = parsePrincipal(args[1]);
        const response = await callReadOnly('get-balance', [tokenAddress, ownerAddress]);
        console.log('\n📊 Balance:', response.result || response);
        break;
      }

      case 'get-lock-info': {
        if (args.length < 1) {
          console.error('Usage: get-lock-info <owner-address>');
          process.exit(1);
        }
        const ownerAddress = parsePrincipal(args[0]);
        const response = await callReadOnly('get-lock-info', [ownerAddress]);
        console.log('\n📊 Lock Info:', response.result || response);
        break;
      }

      case 'is-lock-expired': {
        if (args.length < 1) {
          console.error('Usage: is-lock-expired <owner-address>');
          process.exit(1);
        }
        const ownerAddress = parsePrincipal(args[0]);
        const response = await callReadOnly('is-lock-expired', [ownerAddress]);
        console.log('\n📊 Lock Expired:', response.result || response);
        break;
      }

      case 'get-remaining-lock-blocks': {
        if (args.length < 1) {
          console.error('Usage: get-remaining-lock-blocks <owner-address>');
          process.exit(1);
        }
        const ownerAddress = parsePrincipal(args[0]);
        const response = await callReadOnly('get-remaining-lock-blocks', [ownerAddress]);
        console.log('\n📊 Remaining Lock Blocks:', response.result || response);
        break;
      }

      case 'get-account-balance': {
        try {
          const senderAddress = await getSenderAddress();
          const accountInfo = await getAccountInfo(senderAddress);
          console.log('\n💰 Account Balance:');
          console.log(`   Address: ${senderAddress}`);
          console.log(`   Balance: ${accountInfo.balance} microstacks (${formatSTX(accountInfo.balance)} STX)`);
          console.log(`   Nonce: ${accountInfo.nonce}`);
        } catch (error: any) {
          console.error('\n❌ Error:', error.message);
          if (needsAuth && !mnemonic && !privateKey) {
            console.error('   STACKS_MNEMONIC or STACKS_PRIVATE_KEY required to get your account balance');
          }
          process.exit(1);
        }
        break;
      }

      case 'list-addresses': {
        const mnemonic = process.env.STACKS_MNEMONIC;
        if (!mnemonic) {
          console.error('❌ Error: STACKS_MNEMONIC environment variable is required');
          console.error('   Set it with: export STACKS_MNEMONIC="your twelve word mnemonic phrase"');
          process.exit(1);
        }
        const targetAddress = args.length > 0 ? args[0] : null;
        const maxIndex = args.length > 1 ? parseInt(args[1], 10) : 10;
        
        console.log(`\n🔍 Searching for addresses...`);
        if (targetAddress) {
          console.log(`   Target address: ${targetAddress}`);
        }
        console.log('   Trying different derivation paths...\n');
        
        const rootKeychain = await deriveRootKeychainFromMnemonic(mnemonic);
        let found = false;
        
        // Try different derivation path patterns
        const pathPatterns = [
          { pattern: "m/44'/5757'/0'/0/{i}", name: "Standard (m/44'/5757'/0'/0/{i})" },
          { pattern: "m/44'/5757'/0/0/{i}", name: "Alternative (m/44'/5757'/0/0/{i})" },
          { pattern: "m/44'/5757'/{i}'/0/0", name: "Account-based (m/44'/5757'/{i}'/0/0)" },
          { pattern: "m/44'/5757'/{i}/0/0", name: "Account-based alt (m/44'/5757'/{i}/0/0)" },
        ];
        
        for (const pathInfo of pathPatterns) {
          console.log(`\n   Trying pattern: ${pathInfo.name}`);
          for (let i = 0; i <= maxIndex; i++) {
            try {
              const path = pathInfo.pattern.replace('{i}', i.toString());
              const keychain = rootKeychain.derivePath(path);
              const privateKeyBuffer = keychain.privateKey;
              if (!privateKeyBuffer) continue;
              
              const privateKey = privateKeyBuffer.toString('hex');
              const address = getAddressFromPrivateKey(privateKey);
              
              if (targetAddress && address === targetAddress) {
                console.log(`\n   ✅ FOUND! Address matches at:`);
                console.log(`      Path: ${path}`);
                console.log(`      Address: ${address}`);
                console.log(`      Private Key: ${privateKey}`);
                console.log(`\n   Set this in your environment:`);
                console.log(`      export STACKS_DERIVATION_PATH="${path}"`);
                found = true;
                break;
              } else if (!targetAddress) {
                const accountInfo = await getAccountInfo(address);
                const hasBalance = accountInfo.balance > BigInt(0);
                const marker = hasBalance ? ' ⭐ (has balance)' : '';
                console.log(`      ${path}: ${address}${marker}`);
              }
            } catch (error: any) {
              // Skip invalid paths
            }
          }
          if (found) break;
        }
        
        if (targetAddress && !found) {
          console.log(`\n   ❌ Address ${targetAddress} not found in tested paths.`);
          console.log(`   You may need to export the private key directly from Leather wallet.`);
        } else if (!targetAddress) {
          console.log('\n💡 Tip: To search for a specific address, use:');
          console.log('   npx tsx driver.ts list-addresses <your-address>');
        }
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        console.error('\nAvailable commands:');
        console.error('  deposit-stx <amount>');
        console.error('  deposit-token <amount> <token-address>');
        console.error('  set-lock-duration <duration>');
        console.error('  withdraw <amount>');
        console.error('  get-balance <token-address> <owner-address>');
        console.error('  get-lock-info <owner-address>');
        console.error('  is-lock-expired <owner-address>');
        console.error('  get-remaining-lock-blocks <owner-address>');
        console.error('  get-account-balance');
        console.error('  list-addresses [max-index]');
        process.exit(1);
    }
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run main function
main().catch(console.error);
