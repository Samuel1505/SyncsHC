# SyncsHC TypeScript SDK

A robust, type-safe TypeScript SDK for interacting with the SyncsHC smart contracts on the Stacks network.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Modules](#modules)
  - [PiggyBank](#piggybank)
  - [TokenManager](#tokenmanager)
  - [Registry](#registry)
- [Development](#development)
- [License](#license)

## Features

- **Type Safety**: Built with TypeScript for a superior developer experience.
- **Multi-Format Support**: Bundled as ESM and CommonJS.
- **Comprehensive Wrappers**: Covers PiggyBank, TokenManager, and Registry contracts.
- **Easy Configuration**: Supports Mainnet and Testnet out of the box.

## Installation

```bash
npm install @syncshc/sdk
```

*(Note: This package is currently for internal use. If using locally, you can link it via `npm link`.)*

## Quick Start

```typescript
import { SyncsClient } from '@syncshc/sdk';

async function main() {
  // Initialize the client
  const client = new SyncsClient({
    network: 'mainnet', // or 'testnet'
    contractAddress: 'SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF',
    senderKey: 'your-private-key' // Required for write operations
  });

  // Read-only call
  const total = await client.registry.getTotalPiggyBanks();
  console.log(`Total Piggy Banks: ${total}`);

  // Write operation (requires senderKey)
  const txid = await client.piggyBank.depositStx(1000000n); // 1 STX
  console.log(`Transaction Broadcasted: ${txid}`);
}

main();
```

## Modules

### PiggyBank
Manages individual savings accounts with lock durations.
- `depositStx(amount: bigint)`
- `depositToken(amount: bigint, tokenAddress: string)`
- `withdraw(amount: bigint)`
- `setLockDuration(duration: bigint)`
- `getBalance(tokenAddress: string, ownerAddress: string)`

### TokenManager
Handles supported tokens for the PiggyBank system.
- `isTokenSupported(token: string)`
- `addSupportedToken(token: string)` (Owner only)
- `removeSupportedToken(token: string)` (Owner only)

### Registry
Central registry tracking all deployed PiggyBank instances.
- `getMetadata(piggyBank: string)`
- `getOwnerPiggyBanks(owner: string)`
- `getTotalPiggyBanks()`
- `getPiggyBankByIndex(index: bigint)`

## Development

### Build
To bundle the SDK for production:
```bash
npm run build
```

### Development Mode
Watch for changes and rebuild automatically:
```bash
npm run dev
```

### Linting
Check for TypeScript errors:
```bash
npm run lint
```

## License

ISC
