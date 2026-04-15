export const truncateAddress = (address: string, chars = 4): string => {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const formatAmount = (amount: number, decimals = 2): string => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(2)}K`;
  return amount.toFixed(decimals);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return Math.round(value).toLocaleString();
};

export const calculateProgress = (lockDate: Date, unlockDate: Date): number => {
  const now = Date.now();
  const lock = lockDate.getTime();
  const unlock = unlockDate.getTime();
  if (unlock <= lock) return 100;
  const progress = ((now - lock) / (unlock - lock)) * 100;
  return Math.min(100, Math.max(0, progress));
};

export const getDaysRemaining = (unlockDate: Date): number => {
  const now = Date.now();
  const unlock = unlockDate.getTime();
  return Math.max(0, Math.ceil((unlock - now) / (1000 * 60 * 60 * 24)));
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const calcPenalty = (amount: number, penaltyPercent: number): number => {
  return amount * (penaltyPercent / 100);
};

export const calcEarlyWithdrawal = (
  amount: number,
  penaltyPercent: number
): { receive: number; penalty: number } => {
  const penalty = calcPenalty(amount, penaltyPercent);
  return { receive: amount - penalty, penalty };
};

export const CONTRACT_ADDRESS =
  "SP2JXKMSH007NPYAQHKJPQMAQYAD90NQGTVJVQ02.piggy-bank-registry";
