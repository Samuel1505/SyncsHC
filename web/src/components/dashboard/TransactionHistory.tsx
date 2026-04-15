"use client";

import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Transaction } from "@/types";
import { formatAmount, formatDate, truncateAddress } from "@/lib/utils";
import TokenIcon from "@/components/shared/TokenIcon";
import { TransactionRowSkeleton } from "@/components/shared/SkeletonLoader";

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const TX_CONFIG = {
  deposit: {
    label: "Deposit",
    icon: ArrowDownLeft,
    color: "#10b981",
    sign: "+",
  },
  withdrawal: {
    label: "Withdrawal",
    icon: ArrowUpRight,
    color: "#f7931a",
    sign: "−",
  },
  penalty_withdrawal: {
    label: "Early Exit",
    icon: AlertTriangle,
    color: "#ef4444",
    sign: "−",
  },
};

export default function TransactionHistory({
  transactions,
  isLoading,
}: TransactionHistoryProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold font-display text-white">
            Transaction History
          </h2>
          <p className="text-xs text-muted mt-0.5">Recent on-chain activity</p>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/[0.06]">
          {["Type", "Token / Amount", "Fee", "Date", "Tx"].map((h) => (
            <span key={h} className="text-xs font-medium text-subtle uppercase tracking-wider">
              {h}
            </span>
          ))}
        </div>

        {isLoading ? (
          <div className="divide-y divide-white/[0.05]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-3">
                <TransactionRowSkeleton />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10 text-muted text-sm">
            No transactions yet
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {transactions.map((tx, i) => {
              const cfg = TX_CONFIG[tx.type];
              const TxIcon = cfg.icon;
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto] gap-3 sm:gap-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Type */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}25` }}
                    >
                      <TxIcon size={12} style={{ color: cfg.color }} />
                    </div>
                    <span className="text-xs text-white font-medium sm:hidden">{cfg.label}</span>
                  </div>

                  {/* Token + Amount */}
                  <div className="flex items-center gap-2.5">
                    <TokenIcon token={tx.token} size="sm" />
                    <div>
                      <div
                        className="text-sm font-semibold tabular-nums"
                        style={{ color: cfg.color }}
                      >
                        {cfg.sign} {formatAmount(tx.amount, 4)} {tx.token.symbol}
                      </div>
                      <div className="text-xs text-subtle hidden sm:block">{cfg.label}</div>
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="text-xs text-muted tabular-nums">
                    {tx.fee ? `${formatAmount(tx.fee, 4)} ${tx.token.symbol}` : "—"}
                  </div>

                  {/* Date */}
                  <div className="text-xs text-muted">{formatDate(tx.date)}</div>

                  {/* Tx hash */}
                  <a
                    href={`https://explorer.stacks.co/txid/${tx.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-subtle hover:text-accent transition-colors"
                  >
                    <span className="font-mono">{truncateAddress(tx.txHash, 4)}</span>
                    <ExternalLink size={10} />
                  </a>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
