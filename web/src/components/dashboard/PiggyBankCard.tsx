"use client";

import { motion } from "framer-motion";
import { Lock, Unlock, Clock, ArrowUpRight } from "lucide-react";
import { PiggyBank } from "@/types";
import { calculateProgress, getDaysRemaining, formatDate, formatAmount } from "@/lib/utils";
import TokenIcon from "@/components/shared/TokenIcon";
import ProgressBar from "@/components/shared/ProgressBar";
import { usePiggyBankStore } from "@/store/usePiggyBankStore";

interface PiggyBankCardProps {
  bank: PiggyBank;
  index: number;
}

const STATUS_CONFIG = {
  locked: {
    label: "Locked",
    icon: Lock,
    className: "bg-accent/10 text-accent border-accent/25",
  },
  matured: {
    label: "Matured",
    icon: Unlock,
    className: "bg-success/10 text-success border-success/25",
  },
  withdrawn: {
    label: "Withdrawn",
    icon: Clock,
    className: "bg-white/5 text-muted border-white/10",
  },
};

export default function PiggyBankCard({ bank, index }: PiggyBankCardProps) {
  const openWithdrawModal = usePiggyBankStore((s) => s.openWithdrawModal);
  const progress = calculateProgress(bank.lockDate, bank.unlockDate);
  const daysLeft = getDaysRemaining(bank.unlockDate);
  const statusConfig = STATUS_CONFIG[bank.status];
  const StatusIcon = statusConfig.icon;
  const isActive = bank.status !== "withdrawn";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.14] rounded-2xl p-5 transition-all"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <TokenIcon token={bank.token} size="md" />
          <div>
            <div className="font-semibold text-white text-sm">{bank.token.name}</div>
            <div className="text-xs text-muted">{bank.token.symbol}</div>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${statusConfig.className}`}
        >
          <StatusIcon size={10} />
          {statusConfig.label}
        </span>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <div className="text-2xl font-bold text-white tabular-nums">
          {formatAmount(bank.amountLocked, 4)} {bank.token.symbol}
        </div>
        {bank.token.usdPrice && (
          <div className="text-xs text-muted mt-0.5">
            ≈ ${formatAmount(bank.amountLocked * bank.token.usdPrice)} USD
          </div>
        )}
      </div>

      {/* Progress */}
      {bank.status !== "withdrawn" && (
        <div className="mb-4">
          <ProgressBar
            progress={progress}
            color={bank.status === "matured" ? "#10b981" : "#f7931a"}
            showLabel
          />
        </div>
      )}

      {/* Date range */}
      <div className="flex items-center justify-between text-xs text-muted mb-4">
        <span>{formatDate(bank.lockDate)}</span>
        <span className="text-subtle">→</span>
        <span>{formatDate(bank.unlockDate)}</span>
      </div>

      {/* Days remaining / info */}
      {bank.status === "locked" && (
        <div className="flex items-center gap-1.5 text-xs text-muted mb-4">
          <Clock size={11} />
          <span>{daysLeft} days remaining</span>
        </div>
      )}

      {/* Actions */}
      {isActive && (
        <div className="flex gap-2">
          {bank.status === "matured" ? (
            <button
              onClick={() => openWithdrawModal(bank)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-success/15 hover:bg-success/25 border border-success/30 text-success rounded-xl px-3 py-2 text-xs font-semibold transition-all"
            >
              <Unlock size={12} />
              Withdraw Full
            </button>
          ) : (
            <>
              <button
                onClick={() => openWithdrawModal(bank)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-muted hover:text-white rounded-xl px-3 py-2 text-xs font-medium transition-all"
              >
                <ArrowUpRight size={12} />
                Early Exit
              </button>
              <button
                onClick={() => openWithdrawModal(bank)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent rounded-xl px-3 py-2 text-xs font-semibold transition-all"
              >
                <Lock size={12} />
                Manage
              </button>
            </>
          )}
        </div>
      )}

      {bank.status === "withdrawn" && (
        <div className="text-xs text-subtle text-center py-1">
          Funds withdrawn on {formatDate(bank.unlockDate)}
        </div>
      )}
    </motion.div>
  );
}
