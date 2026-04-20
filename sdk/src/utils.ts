import {
  standardPrincipalCV,
  contractPrincipalCV,
  ClarityValue,
} from '@stacks/transactions';

/**
 * Parse principal address (supports both standard and contract principals)
 */
export function parsePrincipal(address: string): ClarityValue {
  if (address.includes('.')) {
    const [contractAddress, contractName] = address.split('.');
    return contractPrincipalCV(contractAddress, contractName);
  }
  return standardPrincipalCV(address);
}

/**
 * Format microstacks to STX
 */
export function formatSTX(microstacks: bigint | number): string {
  const num = typeof microstacks === 'bigint' ? Number(microstacks) : microstacks;
  return (num / 1_000_000).toFixed(6);
}

/**
 * Convert STX to microstacks
 */
export function toMicrostacks(stx: number | string): bigint {
  const amount = typeof stx === 'string' ? parseFloat(stx) : stx;
  return BigInt(Math.floor(amount * 1_000_000));
}
