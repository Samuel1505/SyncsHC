"use client";

export interface WalletConnectOptions {
  onSuccess: (address: string) => void;
  onCancel: () => void;
}

export async function connectStacksWallet({
  onSuccess,
  onCancel,
}: WalletConnectOptions): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const { connect } = await import("@stacks/connect");
    
    // This will trigger the wallet popup
    const response = await connect();
    
    if (response && response.addresses && response.addresses.length > 0) {
      // Index 2 is often the Stacks address in some wallets, 
      // but let's be safe and look for the one that looks like a Stacks address 
      // or just use the one at the requested index if specified.
      // Based on the user's snippet, they want index 2.
      const address = response.addresses[2]?.address || response.addresses[0]?.address;
      
      if (address) {
        onSuccess(address);
      } else {
        onCancel();
      }
    } else {
      onCancel();
    }
  } catch (err) {
    console.error("Wallet connection failed:", err);
    onCancel();
  }
}

export async function disconnectStacksWallet(): Promise<void> {
  try {
    const { disconnect } = await import("@stacks/connect");
    disconnect();
  } catch (err) {
    console.error("Disconnect failed:", err);
  }
}

/**
 * Fetches the BNS name for a given Stacks address.
 * Uses the BNS V2 API (testnet by default as per requirement).
 */
export async function fetchBnsName(address: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.bnsv2.com/testnet/names/address/${address}/valid`
    );
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data && data.names && data.names.length > 0) {
      return data.names[0].full_name;
    }
  } catch (err) {
    console.warn("Failed to fetch BNS name:", err);
  }
  return null;
}

export const MAINNET_CONTRACT = "SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02";
export const PIGGY_BANK_CONTRACT = `${MAINNET_CONTRACT}.piggy-bank-registry`;
export const PENALTY_FEE_PERCENT = 5;
