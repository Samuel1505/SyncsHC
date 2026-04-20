import { StacksNetwork } from '@stacks/network';

export interface SDKConfig {
  network: StacksNetwork;
  contractAddress: string;
  contractName: string;
  senderKey?: string;
}

export interface LockInfo {
  amount: bigint;
  unlockBlock: bigint;
  owner: string;
}

export interface BalanceInfo {
  balance: bigint;
}

export type NetworkType = 'mainnet' | 'testnet' | 'devnet';
