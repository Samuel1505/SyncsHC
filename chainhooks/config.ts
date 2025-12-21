/**
 * Chainhooks Configuration
 * 
 * Configuration file for chainhook monitoring setup.
 * Set environment variables or modify this file for your deployment.
 */

export interface ChainhookEnvironment {
  baseUrl: string;
  apiKey: string;
  network: "mainnet" | "testnet" | "devnet";
  webhookBaseUrl: string;
  webhookAuthHeader?: string;
}

export const getChainhookConfig = (): ChainhookEnvironment => {
  const network = (process.env.STX_NETWORK || "testnet") as "mainnet" | "testnet" | "devnet";
  
  return {
    baseUrl: process.env.CHAINHOOKS_BASE_URL || "https://api.chainhooks.com",
    apiKey: process.env.CHAINHOOKS_API_KEY || "",
    network,
    webhookBaseUrl: process.env.WEBHOOK_BASE_URL || "https://your-webhook-server.com",
    webhookAuthHeader: process.env.WEBHOOK_AUTH_HEADER,
  };
};

/**
 * Contract addresses configuration
 * Update these with your deployed contract addresses
 */
export const contractAddresses = {
  mainnet: {
    piggyBank: "",
    piggyBankFactory: "",
    piggyBankRegistry: "",
    tokenManager: "",
  },
  testnet: {
    piggyBank: "",
    piggyBankFactory: "",
    piggyBankRegistry: "",
    tokenManager: "",
  },
  devnet: {
    piggyBank: "",
    piggyBankFactory: "",
    piggyBankRegistry: "",
    tokenManager: "",
  },
};

export const getContractAddresses = (network: "mainnet" | "testnet" | "devnet") => {
  return contractAddresses[network];
};

