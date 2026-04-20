import { createNetwork, StacksNetwork } from '@stacks/network';
import { PiggyBank } from './contracts/piggy-bank';
import { TokenManager } from './contracts/token-manager';
import { Registry } from './contracts/registry';
import { SDKConfig, NetworkType } from './types';

export class SyncsClient {
  public piggyBank: PiggyBank;
  public tokenManager: TokenManager;
  public registry: Registry;
  private config: SDKConfig;

  constructor(options: {
    network?: NetworkType | StacksNetwork;
    contractAddress: string;
    contractName?: string;
    senderKey?: string;
  }) {
    let network: StacksNetwork;
    
    if (typeof options.network === 'string') {
      const networkType = options.network === 'mainnet' ? 'mainnet' : 'testnet';
      const baseUrl = options.network === 'mainnet' ? 'https://api.hiro.so' : 'https://api.testnet.hiro.so';
      network = createNetwork({ network: networkType, client: { baseUrl } });
    } else if (options.network) {
      network = options.network;
    } else {
      network = createNetwork({ network: 'mainnet', client: { baseUrl: 'https://api.hiro.so' } });
    }

    this.config = {
      network,
      contractAddress: options.contractAddress,
      contractName: options.contractName || 'piggy-bank',
      senderKey: options.senderKey,
    };

    this.piggyBank = new PiggyBank(this.config);
    this.tokenManager = new TokenManager(this.config);
    this.registry = new Registry(this.config);
  }

  setSenderKey(key: string) {
    this.config.senderKey = key;
  }
}
