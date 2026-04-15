"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Info,
  Lock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { SUPPORTED_TOKENS } from "@/lib/mockData";
import { Token } from "@/types";
import { addDays, formatDate, formatAmount } from "@/lib/utils";
import TokenIcon from "@/components/shared/TokenIcon";
import { usePiggyBankStore } from "@/store/usePiggyBankStore";
import { useWalletStore } from "@/store/useWalletStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const DURATION_PRESETS = [
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "6mo", days: 180 },
  { label: "1yr", days: 365 },
];

const MOCK_BALANCES: Record<string, number> = {
  STX: 1843.5,
  sBTC: 0.12,
  ALEX: 25000,
  USDA: 500,
};

export default function CreatePiggyBankForm() {
  const router = useRouter();
  const { address } = useWalletStore();
  const { createPiggyBank, isLoading } = usePiggyBankStore();

  const [selectedToken, setSelectedToken] = useState<Token>(SUPPORTED_TOKENS[0]);
  const [tokenDropdownOpen, setTokenDropdownOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(90);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const balance = MOCK_BALANCES[selectedToken.symbol] ?? 0;
  const numAmount = parseFloat(amount) || 0;
  const unlockDate = addDays(new Date(), duration);
  const penaltyAmount = numAmount * 0.05;
  const estimatedReceive = numAmount - penaltyAmount;

  useEffect(() => {
    setAmount("");
  }, [selectedToken]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!address) e.wallet = "Please connect your wallet first.";
    if (!amount || numAmount <= 0) e.amount = "Please enter a valid amount.";
    if (numAmount > balance)
      e.amount = `Amount exceeds your balance of ${formatAmount(balance, 4)} ${selectedToken.symbol}.`;
    if (duration < 1 || duration > 365)
      e.duration = "Duration must be between 1 and 365 days.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createPiggyBank({
        token: selectedToken,
        amount: numAmount,
        lockDurationDays: duration,
      });
      toast.success("Piggy Bank created! Your funds are now locked on-chain.");
      setSubmitted(true);
      setTimeout(() => router.push("/dashboard"), 1800);
    } catch {
      toast.error("Transaction failed. Please try again.");
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/[0.04] border border-success/25 rounded-2xl p-10 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={30} className="text-success" />
        </div>
        <h3 className="text-xl font-bold font-display text-white mb-2">
          Piggy Bank Created!
        </h3>
        <p className="text-sm text-muted mb-1">
          {formatAmount(numAmount, 4)} {selectedToken.symbol} locked until{" "}
          {formatDate(unlockDate)}
        </p>
        <p className="text-xs text-subtle">Redirecting to dashboard...</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-5">
        {/* Token selector */}
        <div>
          <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
            Token
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setTokenDropdownOpen((o) => !o)}
              className="w-full flex items-center gap-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-xl px-4 py-3.5 transition-colors text-left"
            >
              <TokenIcon token={selectedToken} size="md" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">
                  {selectedToken.symbol}
                </div>
                <div className="text-xs text-muted">{selectedToken.name}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted">Balance</div>
                <div className="text-sm font-medium text-white tabular-nums">
                  {formatAmount(balance, 4)}
                </div>
              </div>
              <ChevronDown
                size={16}
                className={`text-muted transition-transform ${tokenDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {tokenDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-full left-0 right-0 mt-1.5 z-20 bg-navy-600 border border-white/10 rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              >
                {SUPPORTED_TOKENS.map((token) => (
                  <button
                    key={token.symbol}
                    type="button"
                    onClick={() => {
                      setSelectedToken(token);
                      setTokenDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors"
                  >
                    <TokenIcon token={token} size="sm" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">
                        {token.symbol}
                      </div>
                      <div className="text-xs text-muted">{token.name}</div>
                    </div>
                    <span className="text-xs text-muted tabular-nums">
                      {formatAmount(MOCK_BALANCES[token.symbol] ?? 0, 4)}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Amount input */}
        <div>
          <label className="block text-xs font-medium text-muted uppercase tracking-wider mb-2">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors((prev) => ({ ...prev, amount: "" }));
              }}
              placeholder="0.00"
              min={0}
              step="any"
              className="w-full bg-white/[0.05] border border-white/10 focus:border-accent/50 focus:outline-none rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-subtle transition-colors pr-24"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAmount(balance.toString())}
                className="text-xs text-accent hover:text-accent-400 font-semibold transition-colors px-2 py-0.5 rounded bg-accent/10 border border-accent/20"
              >
                MAX
              </button>
              <span className="text-xs text-muted">{selectedToken.symbol}</span>
            </div>
          </div>
          {errors.amount && (
            <p className="text-xs text-danger mt-1.5 flex items-center gap-1">
              <AlertTriangle size={11} /> {errors.amount}
            </p>
          )}
          {numAmount > 0 && selectedToken.usdPrice && (
            <p className="text-xs text-muted mt-1.5">
              ≈ ${formatAmount(numAmount * selectedToken.usdPrice)} USD
            </p>
          )}
        </div>

        {/* Lock duration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-muted uppercase tracking-wider">
              Lock Duration
            </label>
            <span className="text-sm font-semibold text-accent">
              {duration} day{duration !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Preset buttons */}
          <div className="flex gap-2 mb-3">
            {DURATION_PRESETS.map(({ label, days }) => (
              <button
                key={label}
                type="button"
                onClick={() => setDuration(days)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  duration === days
                    ? "bg-accent/15 border-accent/35 text-accent"
                    : "bg-white/5 border-white/10 text-muted hover:text-white hover:bg-white/10"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min={1}
            max={365}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: "var(--color-accent)" }}
          />

          <div className="flex justify-between text-xs text-subtle mt-1.5">
            <span>1 day</span>
            <span>1 year</span>
          </div>
        </div>

        {/* Unlock date display */}
        <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3.5">
          <div className="flex items-center gap-2 text-xs text-muted">
            <Calendar size={13} />
            Unlock Date
          </div>
          <span className="text-sm font-semibold text-white">
            {formatDate(unlockDate)}
          </span>
        </div>

        {/* Penalty info */}
        <div className="flex items-start gap-3 bg-accent/[0.06] border border-accent/20 rounded-xl px-4 py-3.5">
          <Info size={14} className="text-accent mt-0.5 shrink-0" />
          <p className="text-xs text-muted leading-relaxed">
            <span className="text-accent font-semibold">5% early withdrawal penalty</span> applies if
            you withdraw before the unlock date. After maturity, withdraw the full
            amount with no fee.
          </p>
        </div>

        {/* Estimated maturity panel */}
        {numAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 space-y-2.5"
          >
            <div className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
              Summary
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">You Lock</span>
              <span className="text-white font-semibold tabular-nums">
                {formatAmount(numAmount, 4)} {selectedToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Lock Until</span>
              <span className="text-white font-semibold">{formatDate(unlockDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">If Matured</span>
              <span className="text-success font-semibold tabular-nums">
                {formatAmount(numAmount, 4)} {selectedToken.symbol}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">If Early Exit</span>
              <span className="text-accent font-semibold tabular-nums">
                {formatAmount(estimatedReceive, 4)} {selectedToken.symbol}
              </span>
            </div>
          </motion.div>
        )}

        {/* Wallet error */}
        {errors.wallet && (
          <p className="text-xs text-danger flex items-center gap-1">
            <AlertTriangle size={11} /> {errors.wallet}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !address}
          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl py-3.5 font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(247,147,26,0.3)]"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Locking Funds...
            </>
          ) : (
            <>
              <Lock size={15} />
              Lock Funds
            </>
          )}
        </button>

        {!address && (
          <p className="text-center text-xs text-subtle">
            Connect your wallet to continue
          </p>
        )}
      </div>
    </form>
  );
}
