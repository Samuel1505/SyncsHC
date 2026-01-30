import {
  makeContractCall,
  broadcastTransaction,
  PostConditionMode,
  standardPrincipalCV,
  uintCV,
  contractPrincipalCV,
  ClarityValue,
  StacksTransactionWire,
  SignedContractCallOptions,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';

// Contract addresses - update these with your deployed contract addresses
const CONTRACTS = {
  PIGGY_BANK_FACTORY: process.env.NEXT_PUBLIC_PIGGY_BANK_FACTORY_ADDRESS || '',
  PIGGY_BANK_REGISTRY: process.env.NEXT_PUBLIC_PIGGY_BANK_REGISTRY_ADDRESS || '',
  TOKEN_MANAGER: process.env.NEXT_PUBLIC_TOKEN_MANAGER_ADDRESS || '',
};

// Helper function to create contract call options
export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  network: StacksNetwork;
  senderKey?: string;
  postConditionMode?: PostConditionMode;
}

/**
 * Create a contract call transaction
 */
export async function createContractCall({
  contractAddress,
  contractName,
  functionName,
  functionArgs,
  network,
  postConditionMode = PostConditionMode.Deny,
}: ContractCallOptions): Promise<StacksTransactionWire> {
  return makeContractCall({
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    network,
    postConditionMode,
  } as SignedContractCallOptions);
}

/**
 * Create a Piggy Bank via the factory contract
 */
export async function createPiggyBank(
  lockDuration: number,
  network: StacksNetwork,
  senderKey?: string
): Promise<StacksTransactionWire> {
  return createContractCall({
    contractAddress: CONTRACTS.PIGGY_BANK_FACTORY.split('.')[0],
    contractName: CONTRACTS.PIGGY_BANK_FACTORY.split('.')[1] || 'piggy-bank-factory',
    functionName: 'create-piggy-bank',
    functionArgs: [uintCV(lockDuration)],
    network,
  });
}

/**
 * Deposit STX into a Piggy Bank
 */
export async function depositSTX(
  piggyBankAddress: string,
  amount: bigint,
  network: StacksNetwork,
  senderKey?: string
): Promise<StacksTransactionWire> {
  const [contractAddress, contractName] = piggyBankAddress.split('.');
  
  return createContractCall({
    contractAddress,
    contractName,
    functionName: 'deposit-stx',
    functionArgs: [uintCV(amount)],
    network,
    postConditionMode: PostConditionMode.Allow,
  });
}

/**
 * Deposit SIP-010 token into a Piggy Bank
 */
export async function depositToken(
  piggyBankAddress: string,
  tokenContract: string,
  amount: bigint,
  network: StacksNetwork,
  senderKey?: string
): Promise<StacksTransactionWire> {
  const [contractAddress, contractName] = piggyBankAddress.split('.');
  const [tokenAddress, tokenName] = tokenContract.split('.');
  
  return createContractCall({
    contractAddress,
    contractName,
    functionName: 'deposit-token',
    functionArgs: [
      uintCV(amount),
      contractPrincipalCV(tokenAddress, tokenName),
    ],
    network,
    postConditionMode: PostConditionMode.Allow,
  });
}

/**
 * Set lock duration for a Piggy Bank
 */
export async function setLockDuration(
  piggyBankAddress: string,
  duration: number,
  network: StacksNetwork,
  senderKey?: string
): Promise<StacksTransactionWire> {
  const [contractAddress, contractName] = piggyBankAddress.split('.');
  
  return createContractCall({
    contractAddress,
    contractName,
    functionName: 'set-lock-duration',
    functionArgs: [uintCV(duration)],
    network,
  });
}

/**
 * Withdraw from a Piggy Bank
 */
export async function withdraw(
  piggyBankAddress: string,
  amount: bigint,
  network: StacksNetwork,
  senderKey?: string
): Promise<StacksTransactionWire> {
  const [contractAddress, contractName] = piggyBankAddress.split('.');
  
  return createContractCall({
    contractAddress,
    contractName,
    functionName: 'withdraw',
    functionArgs: [uintCV(amount)],
    network,
    postConditionMode: PostConditionMode.Allow,
  });
}

/**
 * Read-only function: Get balance from a Piggy Bank
 */
export function getBalanceCall(
  piggyBankAddress: string,
  tokenAddress: string,
  ownerAddress: string,
  network: StacksNetwork
): Promise<StacksTransactionWire> {
  const [contractAddress, contractName] = piggyBankAddress.split('.');
  const [tokenContractAddress, tokenContractName] = tokenAddress.includes('.') 
    ? tokenAddress.split('.') 
    : [tokenAddress, ''];
  
  return createContractCall({
    contractAddress,
    contractName,
    functionName: 'get-balance',
    functionArgs: [
      contractPrincipalCV(tokenContractAddress, tokenContractName),
      standardPrincipalCV(ownerAddress),
    ],
    network,
  });
}

/**
 * Read-only function: Get lock info from a Piggy Bank
 */
export function getLockInfoCall(
  piggyBankAddress: string,
  ownerAddress: string,
  network: StacksNetwork
): Promise<StacksTransactionWire> {
  const [contractAddress, contractName] = piggyBankAddress.split('.');
  
  return createContractCall({
    contractAddress,
    contractName,
    functionName: 'get-lock-info',
    functionArgs: [standardPrincipalCV(ownerAddress)],
    network,
  });
}

/**
 * Read-only function: Check if lock is expired
 */
export function isLockExpiredCall(
  piggyBankAddress: string,
  ownerAddress: string,
  network: StacksNetwork
): Promise<StacksTransactionWire> {
  const [contractAddress, contractName] = piggyBankAddress.split('.');
  
  return createContractCall({
    contractAddress,
    contractName,
    functionName: 'is-lock-expired',
    functionArgs: [standardPrincipalCV(ownerAddress)],
    network,
  });
}

/**
 * Read-only function: Get remaining lock blocks
 */
export function getRemainingLockBlocksCall(
  piggyBankAddress: string,
  ownerAddress: string,
  network: StacksNetwork
): Promise<StacksTransactionWire> {
  const [contractAddress, contractName] = piggyBankAddress.split('.');
  
  return createContractCall({
    contractAddress,
    contractName,
    functionName: 'get-remaining-lock-blocks',
    functionArgs: [standardPrincipalCV(ownerAddress)],
    network,
  });
}

/**
 * Broadcast a signed transaction
 */
export async function broadcastTx(
  transaction: StacksTransactionWire,
  network: StacksNetwork
): Promise<string> {
  const response = await broadcastTransaction({ transaction, network });
  return response.txid;
}
