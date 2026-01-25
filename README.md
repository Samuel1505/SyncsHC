# SyncsHC

SyncsHC is a decentralized savings protocols built on the Stacks blockchain. It allows users to create individual "Piggy Banks" for locking STX and SIP-010 tokens for a specified duration. Users can withdraw funds early by paying a penalty fee, or wait for the lock period to expire for penalty-free withdrawals.

## Features

- **Time-Locked Savings**: Lock STX or supported SIP-010 tokens for a specific block duration.
- **Flexible Withdrawals**: Ability to withdraw funds before the lock expires, subject to a penalty fee.
- **Factory Pattern**: Users can easily create and manage their own Piggy Bank contracts.
- **Token Management**: Controlled list of supported tokens.
- **Registry System**: Global tracking of all created Piggy Banks.

## Contract Architecture

The project consists of several interacting contracts:

- **`piggy-bank.clar`**: The core logic for individual savings accounts. Handles deposits, locks, and withdrawals.
- **`piggy-bank-factory.clar`**: A factory contract that simplifies the creation and user assignment of new Piggy Banks.
- **`piggy-bank-registry.clar`**: Maintains a global registry of all valid Piggy Banks and their metadata.
- **`token-manager.clar`**: Manages the list of allowed fungible tokens that can be deposited.

## Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet): For smart contract development and testing.
- [Node.js](https://nodejs.org/): For running the test suite and scripts.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd SyncsHC
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development & Testing

This project includes a comprehensive test suite using Vitest and Clarinet SDK.

### Running Tests

To run all tests:
```bash
npm test
```

For detailed coverage reports:
```bash
npm run test:report
```

For more details on testing, please refer to [TESTING.md](./TESTING.md).

## Chainhooks

SyncsHC integrates with Chainhooks for off-chain event monitoring. The configuration and handlers are located in the `chainhooks/` directory.

- **Setup**: `npm run chainhooks:setup`
- **List**: `npm run chainhooks:list`

See `chainhooks/README.md` for full documentation on event handling.
