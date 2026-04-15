import { PiggyBank, Transaction, ProtocolStats, TVLDataPoint, Token } from "@/types";

export const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: "STX",
    name: "Stacks",
    color: "#F7931A",
    decimals: 6,
    usdPrice: 1.82,
  },
  {
    symbol: "sBTC",
    name: "Stacks BTC",
    color: "#F59E0B",
    decimals: 8,
    usdPrice: 97420,
    contractAddress: "SP4SZE494VC2YC5JYG7AYFQ44F5Q4PYV7DVMDPBG.sbtc-token",
  },
  {
    symbol: "ALEX",
    name: "ALEX Lab",
    color: "#8B5CF6",
    decimals: 8,
    usdPrice: 0.084,
    contractAddress: "SP102V8P0F7JX67ARQ77WEA3D3CFB5XW39REDT0AM.token-alex",
  },
  {
    symbol: "USDA",
    name: "USDA Stable",
    color: "#10B981",
    decimals: 6,
    usdPrice: 1.0,
    contractAddress: "SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.usda-token",
  },
];

const DEMO_ADDRESS = "SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02";

export const MOCK_PIGGY_BANKS: PiggyBank[] = [
  {
    id: "pb-001",
    token: SUPPORTED_TOKENS[0],
    amountLocked: 500,
    lockDate: new Date("2025-09-15"),
    unlockDate: new Date("2026-09-15"),
    status: "locked",
    penaltyFeePercent: 5,
    owner: DEMO_ADDRESS,
  },
  {
    id: "pb-002",
    token: SUPPORTED_TOKENS[1],
    amountLocked: 0.05,
    lockDate: new Date("2026-01-10"),
    unlockDate: new Date("2026-07-10"),
    status: "locked",
    penaltyFeePercent: 5,
    owner: DEMO_ADDRESS,
  },
  {
    id: "pb-003",
    token: SUPPORTED_TOKENS[2],
    amountLocked: 10000,
    lockDate: new Date("2025-04-01"),
    unlockDate: new Date("2026-04-01"),
    status: "matured",
    penaltyFeePercent: 5,
    owner: DEMO_ADDRESS,
  },
  {
    id: "pb-004",
    token: SUPPORTED_TOKENS[3],
    amountLocked: 250,
    lockDate: new Date("2024-11-01"),
    unlockDate: new Date("2025-05-01"),
    status: "withdrawn",
    penaltyFeePercent: 5,
    owner: DEMO_ADDRESS,
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-001",
    type: "deposit",
    token: SUPPORTED_TOKENS[0],
    amount: 500,
    date: new Date("2025-09-15"),
    txHash: "0x7f3a8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
    piggyBankId: "pb-001",
    status: "confirmed",
  },
  {
    id: "tx-002",
    type: "deposit",
    token: SUPPORTED_TOKENS[1],
    amount: 0.05,
    date: new Date("2026-01-10"),
    txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    piggyBankId: "pb-002",
    status: "confirmed",
  },
  {
    id: "tx-003",
    type: "deposit",
    token: SUPPORTED_TOKENS[2],
    amount: 10000,
    date: new Date("2025-04-01"),
    txHash: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    piggyBankId: "pb-003",
    status: "confirmed",
  },
  {
    id: "tx-004",
    type: "withdrawal",
    token: SUPPORTED_TOKENS[2],
    amount: 10000,
    date: new Date("2026-04-02"),
    txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    piggyBankId: "pb-003",
    status: "confirmed",
  },
  {
    id: "tx-005",
    type: "deposit",
    token: SUPPORTED_TOKENS[3],
    amount: 250,
    date: new Date("2024-11-01"),
    txHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
    piggyBankId: "pb-004",
    status: "confirmed",
  },
  {
    id: "tx-006",
    type: "penalty_withdrawal",
    token: SUPPORTED_TOKENS[3],
    amount: 237.5,
    fee: 12.5,
    date: new Date("2025-02-14"),
    txHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    piggyBankId: "pb-004",
    status: "confirmed",
  },
];

export const PROTOCOL_STATS: ProtocolStats = {
  tvl: 12_450_000,
  totalPiggyBanks: 3842,
  totalUsers: 1204,
  totalPenalties: 89_430,
  supportedTokens: 4,
};

// Generate 30 days of TVL data (Mar 15 → Apr 14, 2026)
const generateTVLHistory = (): TVLDataPoint[] => {
  const data: TVLDataPoint[] = [];
  const baseValues = [
    8100000, 8350000, 8280000, 8520000, 8790000, 8650000, 8900000, 9100000,
    9050000, 9280000, 9400000, 9550000, 9480000, 9720000, 9900000, 10050000,
    9950000, 10200000, 10350000, 10480000, 10600000, 10750000, 10900000,
    11100000, 10980000, 11300000, 11550000, 11800000, 12100000, 12450000,
  ];
  const startDate = new Date("2026-03-16");
  baseValues.forEach((tvl, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      tvl,
    });
  });
  return data;
};

export const TVL_HISTORY: TVLDataPoint[] = generateTVLHistory();
