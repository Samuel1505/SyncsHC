'use client';

import { useState } from 'react';
import { useStacks } from '../contexts/StacksContext';
import { useContractCall } from '../hooks/useContractCall';
import { uintCV, contractPrincipalCV, standardPrincipalCV } from '@stacks/transactions';
import { PostConditionMode } from '@stacks/transactions';

/**
 * Example component demonstrating how to interact with Stacks contracts
 * This can be used as a reference for building your own contract interaction components
 */
export default function ContractInteraction() {
  const { isConnected, address } = useStacks();
  const { execute, isLoading, error } = useContractCall();
  const [txId, setTxId] = useState<string | null>(null);

  // Example: Create a Piggy Bank
  const handleCreatePiggyBank = async () => {
    const lockDuration = 100; // 100 blocks (~1000 minutes)
    
    await execute({
      contractAddress: process.env.NEXT_PUBLIC_PIGGY_BANK_FACTORY_ADDRESS?.split('.')[0] || '',
      contractName: process.env.NEXT_PUBLIC_PIGGY_BANK_FACTORY_ADDRESS?.split('.')[1] || 'piggy-bank-factory',
      functionName: 'create-piggy-bank',
      functionArgs: [uintCV(lockDuration)],
      onSuccess: (txId) => {
        setTxId(txId);
        console.log('Transaction successful:', txId);
      },
      onError: (error) => {
        console.error('Transaction failed:', error);
      },
    });
  };

  // Example: Deposit STX
  const handleDepositSTX = async (piggyBankAddress: string, amount: bigint) => {
    const [contractAddress, contractName] = piggyBankAddress.split('.');
    
    await execute({
      contractAddress,
      contractName,
      functionName: 'deposit-stx',
      functionArgs: [uintCV(amount)],
      postConditionMode: PostConditionMode.Allow,
      onSuccess: (txId) => {
        setTxId(txId);
        console.log('Deposit successful:', txId);
      },
      onError: (error) => {
        console.error('Deposit failed:', error);
      },
    });
  };

  // Example: Deposit Token
  const handleDepositToken = async (
    piggyBankAddress: string,
    tokenContract: string,
    amount: bigint
  ) => {
    const [contractAddress, contractName] = piggyBankAddress.split('.');
    const [tokenAddress, tokenName] = tokenContract.split('.');
    
    await execute({
      contractAddress,
      contractName,
      functionName: 'deposit-token',
      functionArgs: [
        uintCV(amount),
        contractPrincipalCV(tokenAddress, tokenName),
      ],
      postConditionMode: PostConditionMode.Allow,
      onSuccess: (txId) => {
        setTxId(txId);
        console.log('Token deposit successful:', txId);
      },
      onError: (error) => {
        console.error('Token deposit failed:', error);
      },
    });
  };

  // Example: Withdraw
  const handleWithdraw = async (piggyBankAddress: string, amount: bigint) => {
    const [contractAddress, contractName] = piggyBankAddress.split('.');
    
    await execute({
      contractAddress,
      contractName,
      functionName: 'withdraw',
      functionArgs: [uintCV(amount)],
      postConditionMode: PostConditionMode.Allow,
      onSuccess: (txId) => {
        setTxId(txId);
        console.log('Withdrawal successful:', txId);
      },
      onError: (error) => {
        console.error('Withdrawal failed:', error);
      },
    });
  };

  if (!isConnected) {
    return (
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <p className="text-white/60">Please connect your wallet to interact with contracts</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white/5 rounded-lg border border-white/10 space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">Contract Interactions</h3>
      
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
          Error: {error.message}
        </div>
      )}

      {txId && (
        <div className="p-3 bg-green-500/20 border border-green-500/50 rounded text-green-200 text-sm">
          Transaction ID: {txId}
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={handleCreatePiggyBank}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-white text-black hover:bg-white/90 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Create Piggy Bank (Example)'}
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-white/60 text-sm">
          Connected: {address?.slice(0, 10)}...{address?.slice(-8)}
        </p>
        <p className="text-white/40 text-xs mt-2">
          This is an example component. Customize it for your specific use cases.
        </p>
      </div>
    </div>
  );
}
