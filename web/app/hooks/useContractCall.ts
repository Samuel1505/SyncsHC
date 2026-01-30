'use client';

import { useState } from 'react';
import { useStacks } from '../contexts/StacksContext';
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  StacksTransaction,
} from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';

export interface UseContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  postConditionMode?: PostConditionMode;
  onSuccess?: (txId: string) => void;
  onError?: (error: Error) => void;
}

export function useContractCall() {
  const { userSession, network, address } = useStacks();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async (options: UseContractCallOptions) => {
    if (!userSession || !address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const transaction = await makeContractCall({
        contractAddress: options.contractAddress,
        contractName: options.contractName,
        functionName: options.functionName,
        functionArgs: options.functionArgs,
        network,
        postConditionMode: options.postConditionMode || PostConditionMode.Deny,
        anchorMode: AnchorMode.Any,
      });

      // Use Connect to sign and broadcast
      openContractCall({
        contractAddress: options.contractAddress,
        contractName: options.contractName,
        functionName: options.functionName,
        functionArgs: options.functionArgs,
        network,
        postConditionMode: options.postConditionMode || PostConditionMode.Deny,
        userSession,
        onFinish: (data) => {
          setIsLoading(false);
          if (data.txId && options.onSuccess) {
            options.onSuccess(data.txId);
          }
        },
        onCancel: () => {
          setIsLoading(false);
          const cancelError = new Error('Transaction cancelled by user');
          setError(cancelError);
          if (options.onError) {
            options.onError(cancelError);
          }
        },
      });
    } catch (err) {
      setIsLoading(false);
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      if (options.onError) {
        options.onError(error);
      }
    }
  };

  return {
    execute,
    isLoading,
    error,
  };
}
