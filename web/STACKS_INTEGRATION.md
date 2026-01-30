# Stacks Integration Guide

This project has been integrated with `@stacks/connect` and `@stacks/transactions` to enable wallet connectivity and smart contract interactions on the Stacks blockchain.

## Overview

The integration includes:
- **Stacks Connect**: Wallet connection and authentication
- **Stacks Transactions**: Smart contract interaction utilities
- **React Context**: Global state management for wallet connection
- **Custom Hooks**: Easy-to-use hooks for contract calls
- **Example Components**: Reference implementations

## Setup

### Environment Variables

Add these to your `.env.local` file:

```env
# Stacks Network (mainnet or testnet)
NEXT_PUBLIC_STACKS_NETWORK=testnet

# Your app domain
NEXT_PUBLIC_STACKS_DOMAIN=localhost

# Contract addresses (update with your deployed contracts)
NEXT_PUBLIC_PIGGY_BANK_FACTORY_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.piggy-bank-factory
NEXT_PUBLIC_PIGGY_BANK_REGISTRY_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.piggy-bank-registry
NEXT_PUBLIC_TOKEN_MANAGER_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.token-manager
```

## Usage

### 1. Wallet Connection

The `WalletConnect` component is already integrated into the Navigation. Users can connect their Stacks wallet (Hiro Wallet, Xverse, etc.) directly from the navigation bar.

### 2. Using the Stacks Context

Access wallet state and network information using the `useStacks` hook:

```tsx
import { useStacks } from '@/app/contexts/StacksContext';

function MyComponent() {
  const { isConnected, address, userData, network, connectWallet, disconnectWallet } = useStacks();

  if (!isConnected) {
    return <button onClick={connectWallet}>Connect Wallet</button>;
  }

  return (
    <div>
      <p>Connected: {address}</p>
      <button onClick={disconnectWallet}>Disconnect</button>
    </div>
  );
}
```

### 3. Making Contract Calls

Use the `useContractCall` hook for easy contract interactions:

```tsx
import { useContractCall } from '@/app/hooks/useContractCall';
import { uintCV } from '@stacks/transactions';
import { PostConditionMode } from '@stacks/transactions';

function DepositComponent() {
  const { execute, isLoading, error } = useContractCall();

  const handleDeposit = async () => {
    await execute({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'piggy-bank',
      functionName: 'deposit-stx',
      functionArgs: [uintCV(1000000)], // 1 STX (in micro-STX)
      postConditionMode: PostConditionMode.Allow,
      onSuccess: (txId) => {
        console.log('Transaction ID:', txId);
      },
      onError: (error) => {
        console.error('Error:', error);
      },
    });
  };

  return (
    <button onClick={handleDeposit} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Deposit STX'}
    </button>
  );
}
```

### 4. Using Contract Utilities

Import utility functions from `@/app/lib/stacks-contracts`:

```tsx
import { depositSTX, createPiggyBank } from '@/app/lib/stacks-contracts';
import { useStacks } from '@/app/contexts/StacksContext';

function MyComponent() {
  const { network } = useStacks();

  const handleCreate = async () => {
    const tx = await createPiggyBank(100, network); // 100 blocks lock duration
    // Transaction will be signed via Connect modal
  };
}
```

## Available Contract Functions

### Piggy Bank Factory
- `createPiggyBank(lockDuration, network)` - Create a new piggy bank

### Piggy Bank
- `depositSTX(piggyBankAddress, amount, network)` - Deposit STX
- `depositToken(piggyBankAddress, tokenContract, amount, network)` - Deposit SIP-010 token
- `setLockDuration(piggyBankAddress, duration, network)` - Set lock duration
- `withdraw(piggyBankAddress, amount, network)` - Withdraw funds

### Read-Only Functions
- `getBalanceCall(piggyBankAddress, tokenAddress, ownerAddress, network)` - Get balance
- `getLockInfoCall(piggyBankAddress, ownerAddress, network)` - Get lock information
- `isLockExpiredCall(piggyBankAddress, ownerAddress, network)` - Check if lock expired
- `getRemainingLockBlocksCall(piggyBankAddress, ownerAddress, network)` - Get remaining blocks

## Example Component

See `app/components/ContractInteraction.tsx` for a complete example of how to interact with contracts.

## Important Notes

1. **Amounts**: STX amounts are in micro-STX (1 STX = 1,000,000 micro-STX)
2. **Network**: The network is determined by `NEXT_PUBLIC_STACKS_NETWORK` environment variable
3. **Post Conditions**: Use `PostConditionMode.Allow` for deposits/withdrawals, `PostConditionMode.Deny` for read-only operations
4. **Transaction Signing**: All transactions are signed via the Stacks Connect modal
5. **Error Handling**: Always handle errors and provide user feedback

## Resources

- [Stacks Connect Documentation](https://docs.hiro.so/build-apps/connect)
- [Stacks Transactions Documentation](https://docs.hiro.so/stacks.js/modules/transactions)
- [Stacks Network Documentation](https://docs.stacks.co/)
