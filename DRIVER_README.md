# PiggyBank Contract Driver Script

A command-line driver script to interact with the deployed PiggyBank smart contract on Stacks mainnet.

## Prerequisites

- Node.js and npm installed
- A Stacks mnemonic phrase (from Leather/Hiro wallet) OR a Stacks private key (hex format, 64 characters)
- The contract deployed on Stacks mainnet

## Installation

The required dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Configuration

Set environment variables (use **either** mnemonic **or** private key):

### Option 1: Using Mnemonic (Recommended for Leather/Hiro Wallet)
```bash
export STACKS_MNEMONIC="your twelve word mnemonic phrase here"
export CONTRACT_ADDRESS=SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF  # Optional, defaults to this
export NETWORK=mainnet  # Optional, defaults to mainnet
```

### Option 2: Using Private Key
```bash
export STACKS_PRIVATE_KEY=<your-private-key-hex>
export CONTRACT_ADDRESS=SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF  # Optional, defaults to this
export NETWORK=mainnet  # Optional, defaults to mainnet
```

## Usage

### Write Operations (Require STACKS_MNEMONIC or STACKS_PRIVATE_KEY)

#### Deposit STX
```bash
# Deposit 1 STX (1000000 microstacks)
tsx driver.ts deposit-stx 1000000

# Or deposit 1.5 STX (will be converted to microstacks)
tsx driver.ts deposit-stx 1.5
```

#### Deposit Fungible Tokens
```bash
# Deposit tokens (amount in smallest unit)
tsx driver.ts deposit-token 1000000 SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token
```

#### Set Lock Duration
```bash
# Set lock duration to 100 blocks
tsx driver.ts set-lock-duration 100
```

#### Withdraw Tokens
```bash
# Withdraw amount (in smallest unit)
tsx driver.ts withdraw 500000
```

### Read Operations (No private key required)

#### Get Balance
```bash
# Get balance for a token and owner
tsx driver.ts get-balance SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF
```

#### Get Lock Info
```bash
# Get lock information for an owner
tsx driver.ts get-lock-info SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF
```

#### Check if Lock Expired
```bash
# Check if lock period has expired
tsx driver.ts is-lock-expired SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF
```

#### Get Remaining Lock Blocks
```bash
# Get remaining blocks until lock expires
tsx driver.ts get-remaining-lock-blocks SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF
```

## Examples

### Complete Workflow

```bash
# 1. Set your mnemonic (from Leather wallet)
export STACKS_MNEMONIC="your twelve word mnemonic phrase here"

# OR set your private key
export STACKS_PRIVATE_KEY=your_private_key_here

# 2. Deposit 10 STX
tsx driver.ts deposit-stx 10

# 3. Set lock duration to 1000 blocks
tsx driver.ts set-lock-duration 1000

# 4. Check your balance
tsx driver.ts get-balance SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF $(tsx driver.ts get-address)

# 5. Check lock info
tsx driver.ts get-lock-info SP1ZE73TWJ4WBFHZBBQJAMJDV23K678RXWPDGNHYF

# 6. Withdraw (after lock expires or with penalty)
tsx driver.ts withdraw 5000000
```

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit your mnemonic or private key to version control
- Use environment variables or a secure secret management system
- Mnemonics should be 12 or 24 words (BIP39 format)
- Private keys should be in hex format (64 characters) if using that option
- The script derives keys using Stacks standard derivation path: `m/44'/5757'/0'/0/0`
- Test on testnet first before using mainnet

## Transaction Fees

- Each transaction requires a fee (paid in STX)
- The script uses a base fee of 1000 microstacks
- Actual fees may vary based on network conditions

## Error Handling

The script will:
- Display clear error messages if transactions fail
- Show transaction IDs for successful broadcasts
- Provide explorer links to view transactions on-chain

## Network Support

- **Mainnet**: `https://api.hiro.so` (default)
- **Testnet**: Set `NETWORK=testnet` to use `https://api.testnet.hiro.so`

## Troubleshooting

### "STACKS_MNEMONIC or STACKS_PRIVATE_KEY environment variable is required"
- Make sure you've exported either:
  - Mnemonic: `export STACKS_MNEMONIC="your twelve word phrase"`
  - OR private key: `export STACKS_PRIVATE_KEY=<your-key>`

### "Transaction failed"
- Check your account has sufficient STX for fees
- Verify the contract address is correct
- Ensure you're using the correct network (mainnet vs testnet)

### "Error fetching nonce"
- Check your internet connection
- Verify the API URL is accessible
- Ensure the address is valid

## Contract Functions Reference

### Public Functions
- `deposit-stx` - Deposit STX into piggy bank
- `deposit-token` - Deposit fungible tokens
- `set-lock-duration` - Set lock duration (can only be set once, before first deposit)
- `withdraw` - Withdraw tokens (may incur penalty if lock hasn't expired)

### Read-Only Functions
- `get-balance` - Get balance for a user and token
- `get-lock-info` - Get lock information for a user
- `is-lock-expired` - Check if lock period has expired
- `get-remaining-lock-blocks` - Get remaining blocks until lock expires

## Support

For issues or questions:
1. Check the contract code in `contracts/piggy-bank.clar`
2. Review transaction on explorer: https://explorer.stacks.co
3. Check Stacks documentation: https://docs.stacks.co
