# Chainhooks Integration

This directory contains the chainhooks client integration for monitoring SyncsHC PiggyBank contracts on the Stacks blockchain.

## Overview

Chainhooks allow you to monitor on-chain events and trigger actions (like webhooks) when specific contract functions are called. This integration provides:

- Monitoring of PiggyBank deposits
- Monitoring of PiggyBank withdrawals
- Monitoring of factory registrations
- Monitoring of token additions

## Setup

### 1. Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Chainhooks API Configuration
CHAINHOOKS_BASE_URL=https://api.chainhooks.com
CHAINHOOKS_API_KEY=your-api-key-here

# Stacks Network
STX_NETWORK=testnet  # or "mainnet" or "devnet"

# Webhook Configuration
WEBHOOK_BASE_URL=https://your-webhook-server.com
WEBHOOK_AUTH_HEADER=Bearer your-auth-token
```

### 2. Update Contract Addresses

Edit `chainhooks/config.ts` and update the contract addresses for your deployed contracts:

```typescript
export const contractAddresses = {
  testnet: {
    piggyBank: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.piggy-bank",
    piggyBankFactory: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.piggy-bank-factory",
    piggyBankRegistry: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.piggy-bank-registry",
    tokenManager: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token-manager",
  },
  // ... other networks
};
```

### 3. Register Chainhooks

Run the setup script to register all chainhooks:

```bash
npm run chainhooks:setup
```

Or use the TypeScript file directly:

```bash
npx tsx chainhooks/setup.ts
```

## Usage

### Basic Usage

```typescript
import { SyncsHCChainhooks } from "./chainhooks/index.js";

const chainhooks = new SyncsHCChainhooks({
  network: "testnet",
  apiKey: "your-api-key",
});

// Register a deposit hook
const hook = await chainhooks.registerPiggyBankDepositHook(
  "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.piggy-bank",
  "https://your-server.com/webhooks/deposit"
);

console.log("Hook registered:", hook.uuid);
```

### List All Hooks

```typescript
const hooks = await chainhooks.listChainhooks();
console.log("Registered hooks:", hooks);
```

### Delete a Hook

```typescript
await chainhooks.deleteChainhook("hook-uuid-here");
```

## Webhook Server Example

Create a webhook server to receive chainhook events:

```typescript
import express from "express";
import { handleWebhook, ChainhookEvent } from "./chainhooks/webhook-handlers.js";

const app = express();
app.use(express.json());

app.post("/webhooks/piggy-bank/deposit", (req, res) => {
  const event: ChainhookEvent = req.body;
  handleWebhook(event, "deposit");
  res.status(200).send("OK");
});

app.post("/webhooks/piggy-bank/withdraw", (req, res) => {
  const event: ChainhookEvent = req.body;
  handleWebhook(event, "withdraw");
  res.status(200).send("OK");
});

app.listen(3000, () => {
  console.log("Webhook server listening on port 3000");
});
```

## API Reference

### SyncsHCChainhooks Class

#### Methods

- `registerPiggyBankDepositHook(contractAddress, webhookUrl)` - Register hook for deposits
- `registerPiggyBankWithdrawHook(contractAddress, webhookUrl)` - Register hook for withdrawals
- `registerFactoryRegistrationHook(contractAddress, webhookUrl)` - Register hook for factory registrations
- `registerTokenAdditionHook(contractAddress, webhookUrl)` - Register hook for token additions
- `listChainhooks()` - List all registered hooks
- `getChainhook(uuid)` - Get a specific hook
- `deleteChainhook(uuid)` - Delete a hook
- `updateChainhook(uuid, updates)` - Update a hook

## Webhook Event Structure

Chainhook events follow this structure:

```typescript
{
  uuid: string;
  name: string;
  network: {
    stacks: {
      network: string;
      block_height: number;
      block_hash: string;
      timestamp: number;
    };
  };
  payload: {
    apply: Array<{
      block_identifier: { index: number; hash: string };
      transactions: Array<{
        transaction_identifier: { hash: string };
        metadata: {
          contract_call: {
            contract_identifier: string;
            function_name: string;
            function_args: Array<{ hex: string; repr: string }>;
          };
        };
      }>;
    }>;
  };
}
```

## Testing

Test your chainhooks setup:

```bash
# List registered hooks
npm run chainhooks:list

# Test webhook handlers
npm run chainhooks:test
```

## Troubleshooting

1. **Hook not triggering**: Check that your webhook URL is accessible and returns 200 OK
2. **Authentication errors**: Verify your API key is correct
3. **Network mismatch**: Ensure the network in config matches your deployed contracts
4. **Contract not found**: Verify contract addresses are correct and contracts are deployed

## Resources

- [Chainhooks Documentation](https://docs.hiro.so/chainhook)
- [Chainhooks Client NPM Package](https://www.npmjs.com/package/@hirosystems/chainhooks-client)

