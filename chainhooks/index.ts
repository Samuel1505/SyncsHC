/**
 * Chainhooks Client Integration
 * 
 * This module provides chainhook monitoring for the SyncsHC PiggyBank contracts.
 * Chainhooks allow you to monitor on-chain events and trigger actions based on them.
 */

import { ChainhooksClient } from "@hirosystems/chainhooks-client";

export interface ChainhookConfig {
  baseUrl?: string;
  apiKey?: string;
  network?: "mainnet" | "testnet" | "devnet";
}

export class SyncsHCChainhooks {
  private client: ChainhooksClient;
  private network: string;

  constructor(config: ChainhookConfig = {}) {
    const baseUrl = config.baseUrl || process.env.CHAINHOOKS_BASE_URL || "https://api.chainhooks.com";
    const apiKey = config.apiKey || process.env.CHAINHOOKS_API_KEY || "";
    
    this.network = config.network || process.env.STX_NETWORK || "testnet";
    
    this.client = new ChainhooksClient({
      baseUrl,
      apiKey,
    });
  }

  /**
   * Register a chainhook to monitor PiggyBank deposits
   */
  async registerPiggyBankDepositHook(contractAddress: string, webhookUrl: string) {
    const hookDefinition = {
      uuid: `piggy-bank-deposit-${Date.now()}`,
      name: "PiggyBank Deposit Monitor",
      network: {
        bitcoin: undefined,
        stacks: {
          network: this.network,
          start_block: undefined, // Start from current block
        },
      },
      enabled: true,
      version: 1,
      predicate: {
        scope: "contract_call",
        contract_identifier: contractAddress,
        function_name: "deposit-stx",
      },
      action: {
        http: {
          url: webhookUrl,
          method: "POST",
          authorization_header: process.env.WEBHOOK_AUTH_HEADER || "",
        },
      },
    };

    return await this.client.registerChainhook(hookDefinition);
  }

  /**
   * Register a chainhook to monitor PiggyBank withdrawals
   */
  async registerPiggyBankWithdrawHook(contractAddress: string, webhookUrl: string) {
    const hookDefinition = {
      uuid: `piggy-bank-withdraw-${Date.now()}`,
      name: "PiggyBank Withdraw Monitor",
      network: {
        bitcoin: undefined,
        stacks: {
          network: this.network,
          start_block: undefined,
        },
      },
      enabled: true,
      version: 1,
      predicate: {
        scope: "contract_call",
        contract_identifier: contractAddress,
        function_name: "withdraw",
      },
      action: {
        http: {
          url: webhookUrl,
          method: "POST",
          authorization_header: process.env.WEBHOOK_AUTH_HEADER || "",
        },
      },
    };

    return await this.client.registerChainhook(hookDefinition);
  }

  /**
   * Register a chainhook to monitor PiggyBank registrations in factory
   */
  async registerFactoryRegistrationHook(contractAddress: string, webhookUrl: string) {
    const hookDefinition = {
      uuid: `factory-registration-${Date.now()}`,
      name: "PiggyBank Factory Registration Monitor",
      network: {
        bitcoin: undefined,
        stacks: {
          network: this.network,
          start_block: undefined,
        },
      },
      enabled: true,
      version: 1,
      predicate: {
        scope: "contract_call",
        contract_identifier: contractAddress,
        function_name: "register-piggy-bank",
      },
      action: {
        http: {
          url: webhookUrl,
          method: "POST",
          authorization_header: process.env.WEBHOOK_AUTH_HEADER || "",
        },
      },
    };

    return await this.client.registerChainhook(hookDefinition);
  }

  /**
   * Register a chainhook to monitor token additions in token manager
   */
  async registerTokenAdditionHook(contractAddress: string, webhookUrl: string) {
    const hookDefinition = {
      uuid: `token-addition-${Date.now()}`,
      name: "Token Manager Addition Monitor",
      network: {
        bitcoin: undefined,
        stacks: {
          network: this.network,
          start_block: undefined,
        },
      },
      enabled: true,
      version: 1,
      predicate: {
        scope: "contract_call",
        contract_identifier: contractAddress,
        function_name: "add-supported-token",
      },
      action: {
        http: {
          url: webhookUrl,
          method: "POST",
          authorization_header: process.env.WEBHOOK_AUTH_HEADER || "",
        },
      },
    };

    return await this.client.registerChainhook(hookDefinition);
  }

  /**
   * List all registered chainhooks
   */
  async listChainhooks() {
    return await this.client.listChainhooks();
  }

  /**
   * Get a specific chainhook by UUID
   */
  async getChainhook(uuid: string) {
    return await this.client.getChainhook(uuid);
  }

  /**
   * Delete a chainhook by UUID
   */
  async deleteChainhook(uuid: string) {
    return await this.client.deleteChainhook(uuid);
  }

  /**
   * Update a chainhook
   */
  async updateChainhook(uuid: string, updates: any) {
    return await this.client.updateChainhook(uuid, updates);
  }
}

// Export singleton instance
export const chainhooks = new SyncsHCChainhooks();

