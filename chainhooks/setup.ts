/**
 * Chainhooks Setup Script
 * 
 * This script registers all chainhooks for monitoring SyncsHC contracts.
 * Run this after deploying your contracts to set up monitoring.
 * 
 * Usage:
 *   npm run chainhooks:setup
 *   or
 *   tsx chainhooks/setup.ts
 */

import { SyncsHCChainhooks } from "./index.js";
import { getChainhookConfig, getContractAddresses, toChainhookNetwork } from "./config.js";

async function setupChainhooks() {
  const config = getChainhookConfig();
  const contracts = getContractAddresses(config.network);
  // Convert network to chainhook-compatible network (devnet -> testnet)
  const chainhooks = new SyncsHCChainhooks({
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
    network: toChainhookNetwork(config.network),
  });

  console.log(`Setting up chainhooks for ${config.network} network...`);
  console.log(`Contracts:`, contracts);

  try {
    // Register PiggyBank deposit hook
    if (contracts.piggyBank) {
      const depositHook = await chainhooks.registerPiggyBankDepositHook(
        contracts.piggyBank,
        `${config.webhookBaseUrl}/webhooks/piggy-bank/deposit`
      );
      console.log("✅ Registered deposit hook:", depositHook.uuid);
    }

    // Register PiggyBank withdraw hook
    if (contracts.piggyBank) {
      const withdrawHook = await chainhooks.registerPiggyBankWithdrawHook(
        contracts.piggyBank,
        `${config.webhookBaseUrl}/webhooks/piggy-bank/withdraw`
      );
      console.log("✅ Registered withdraw hook:", withdrawHook.uuid);
    }

    // Register Factory registration hook
    if (contracts.piggyBankFactory) {
      const factoryHook = await chainhooks.registerFactoryRegistrationHook(
        contracts.piggyBankFactory,
        `${config.webhookBaseUrl}/webhooks/factory/register`
      );
      console.log("✅ Registered factory registration hook:", factoryHook.uuid);
    }

    // Register Token addition hook
    if (contracts.tokenManager) {
      const tokenHook = await chainhooks.registerTokenAdditionHook(
        contracts.tokenManager,
        `${config.webhookBaseUrl}/webhooks/token-manager/add`
      );
      console.log("✅ Registered token addition hook:", tokenHook.uuid);
    }

    console.log("\n✅ All chainhooks registered successfully!");
    
    // List all registered hooks
    const hooksResponse = await chainhooks.listChainhooks();
    console.log("\n📋 Registered chainhooks:");
    hooksResponse.results.forEach((hook) => {
      console.log(`  - ${hook.definition.name} (${hook.uuid})`);
    });

  } catch (error) {
    console.error("❌ Error setting up chainhooks:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupChainhooks();
}

export { setupChainhooks };

