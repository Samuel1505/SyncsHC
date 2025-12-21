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
  network?: "mainnet" | "testnet";
}

export class SyncsHCChainhooks {
  private client: ChainhooksClient;
  private network: string;

  constructor(config: ChainhookConfig = {}) {
    const baseUrl = config.baseUrl || process.env.CHAINHOOKS_BASE_URL || "https://api.chainhooks.com";
    const apiKey = config.apiKey || process.env.CHAINHOOKS_API_KEY || "";
    
    this.network = (config.network || (process.env.STX_NETWORK as "mainnet" | "testnet") || "testnet") as "mainnet" | "testnet";
    
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
      name: "PiggyBank Deposit Monitor",
      version: "1" as const,
      chain: "stacks" as const,
      network: this.network as "mainnet" | "testnet",
      filters: {
        events: [
          {
            type: "contract_call" as const,
            contract_identifier: contractAddress,
            function_name: "deposit-stx",
          },
        ],
      },
      action: {
        type: "http_post" as const,
        url: webhookUrl,
      },
    };

    return await this.client.registerChainhook(hookDefinition);
  }

  /**
   * Register a chainhook to monitor PiggyBank withdrawals
   */
  async registerPiggyBankWithdrawHook(contractAddress: string, webhookUrl: string) {
    const hookDefinition = {
      name: "PiggyBank Withdraw Monitor",
      version: "1" as const,
      chain: "stacks" as const,
      network: this.network as "mainnet" | "testnet",
      filters: {
        events: [
          {
            type: "contract_call" as const,
            contract_identifier: contractAddress,
            function_name: "withdraw",
          },
        ],
      },
      action: {
        type: "http_post" as const,
        url: webhookUrl,
      },
    };

    return await this.client.registerChainhook(hookDefinition);
  }

  /**
   * Register a chainhook to monitor PiggyBank registrations in factory
   */
  async registerFactoryRegistrationHook(contractAddress: string, webhookUrl: string) {
    const hookDefinition = {
      name: "PiggyBank Factory Registration Monitor",
      version: "1" as const,
      chain: "stacks" as const,
      network: this.network as "mainnet" | "testnet",
      filters: {
        events: [
          {
            type: "contract_call" as const,
            contract_identifier: contractAddress,
            function_name: "register-piggy-bank",
          },
        ],
      },
      action: {
        type: "http_post" as const,
        url: webhookUrl,
      },
    };

    return await this.client.registerChainhook(hookDefinition);
  }

  /**
   * Register a chainhook to monitor token additions in token manager
   */
  async registerTokenAdditionHook(contractAddress: string, webhookUrl: string) {
    const hookDefinition = {
      name: "Token Manager Addition Monitor",
      version: "1" as const,
      chain: "stacks" as const,
      network: this.network as "mainnet" | "testnet",
      filters: {
        events: [
          {
            type: "contract_call" as const,
            contract_identifier: contractAddress,
            function_name: "add-supported-token",
          },
        ],
      },
      action: {
        type: "http_post" as const,
        url: webhookUrl,
      },
    };

    return await this.client.registerChainhook(hookDefinition);
  }

  /**
   * List all registered chainhooks
   */
  async listChainhooks(options?: { offset?: number; limit?: number }) {
    return await this.client.getChainhooks(options);
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

