import {
  uintCV,
  ClarityValue,
  cvToHex,
  hexToCV,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
} from '@stacks/transactions';
import { SDKConfig } from '../types';
import { parsePrincipal } from '../utils';

export class Registry {
  constructor(private config: SDKConfig) {}

  private async callReadOnly(functionName: string, functionArgs: ClarityValue[]): Promise<any> {
    const { network, contractAddress } = this.config;
    const contractName = 'piggy-bank-registry';
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
      contractName: 'piggy-bank-registry',
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

  async registerPiggyBank(piggyBank: string, owner: string, factory: string) {
    return this.broadcastTx('register-piggy-bank', [
      parsePrincipal(piggyBank),
      parsePrincipal(owner),
      parsePrincipal(factory),
    ]);
  }

  async unregisterPiggyBank(piggyBank: string) {
    return this.broadcastTx('unregister-piggy-bank', [parsePrincipal(piggyBank)]);
  }

  async getMetadata(piggyBank: string) {
    return this.callReadOnly('get-piggy-bank-metadata', [parsePrincipal(piggyBank)]);
  }

  async getOwnerPiggyBanks(owner: string) {
    return this.callReadOnly('get-owner-piggy-banks', [parsePrincipal(owner)]);
  }

  async getTotalPiggyBanks() {
    return this.callReadOnly('get-total-piggy-banks', []);
  }

  async getPiggyBankByIndex(index: bigint) {
    return this.callReadOnly('get-piggy-bank-by-index', [uintCV(index)]);
  }
}
