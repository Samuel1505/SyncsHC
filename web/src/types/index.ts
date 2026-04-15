export type TokenSymbol = "STX" | "sBTC" | "ALEX" | "USDA" | "xBTC";
export type PiggyBankStatus = "locked" | "matured" | "withdrawn";
export type TransactionType = "deposit" | "withdrawal" | "penalty_withdrawal";

export interface Token {
  symbol: TokenSymbol | string;
  name: string;
  color: string;
  decimals: number;
  contractAddress?: string;
  usdPrice?: number;
}

export interface PiggyBank {
  id: string;
  token: Token;
  amountLocked: number;
  lockDate: Date;
  unlockDate: Date;
  status: PiggyBankStatus;
  penaltyFeePercent: number;
  owner: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  token: Token;
  amount: number;
  fee?: number;
  date: Date;
  txHash: string;
  piggyBankId: string;
  status: "confirmed" | "pending" | "failed";
}

export interface ProtocolStats {
  tvl: number;
  totalPiggyBanks: number;
  totalUsers: number;
  totalPenalties: number;
  supportedTokens: number;
}

export interface TVLDataPoint {
  date: string;
  tvl: number;
}

export interface CreatePiggyBankParams {
  token: Token;
  amount: number;
  lockDurationDays: number;
}
