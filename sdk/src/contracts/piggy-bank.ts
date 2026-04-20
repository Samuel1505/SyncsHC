import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  ClarityValue,
  cvToHex,
  hexToCV,
} from '@stacks/transactions';
import { SDKConfig } from '../types';
import { parsePrincipal } from '../utils';

export class PiggyBank {
  constructor(private config: SDKConfig) {}

  private async callReadOnly(functionName: string, functionArgs: ClarityValue[]): Promise<any> {
    const { network, contractAddress, contractName } = this.config;
    const argsHex = functionArgs.map(arg => cvToHex(arg));
    
    const url = `${network.client.baseUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: contractAddress,
        arguments: argsHex,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return hexToCV(data.result);
  }

  private async broadcastTx(functionName: string, functionArgs: ClarityValue[]) {
    if (!this.config.senderKey) {
      throw new Error('Sender key is required for write operations');
    }

    const txOptions = {
      contractAddress: this.config.contractAddress,
      contractName: this.config.contractName,
      functionName,
      functionArgs,
      senderKey: this.config.senderKey,
      network: this.config.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
    };

    const transaction = await makeContractCall(txOptions);
    const result = await broadcastTransaction({ transaction, network: this.config.network });
    
    if ('error' in result) {
      throw new Error(`Transaction failed: ${result.error}`);
    }
    
    return result.txid;
  }

  // --- Contract Methods ---

  async depositStx(amount: bigint) {
    return this.broadcastTx('deposit-stx', [uintCV(amount)]);
  }

  async depositToken(amount: bigint, tokenAddress: string) {
    return this.broadcastTx('deposit-token', [uintCV(amount), parsePrincipal(tokenAddress)]);
  }

  async setLockDuration(duration: bigint) {
    return this.broadcastTx('set-lock-duration', [uintCV(duration)]);
  }

  async withdraw(amount: bigint) {
    return this.broadcastTx('withdraw', [uintCV(amount)]);
  }

  async getBalance(tokenAddress: string, ownerAddress: string) {
    return this.callReadOnly('get-balance', [parsePrincipal(tokenAddress), parsePrincipal(ownerAddress)]);
  }

  async getLockInfo(ownerAddress: string) {
    return this.callReadOnly('get-lock-info', [parsePrincipal(ownerAddress)]);
  }

  async isLockExpired(ownerAddress: string) {
    return this.callReadOnly('is-lock-expired', [parsePrincipal(ownerAddress)]);
  }
}
