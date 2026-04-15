"use client";

import { motion } from "framer-motion";
import { TrendingUp, Layers, Calendar, AlertTriangle } from "lucide-react";
import { PiggyBank } from "@/types";
import { formatAmount, formatDate, getDaysRemaining } from "@/lib/utils";
import { SummaryCardSkeleton } from "@/components/shared/SkeletonLoader";

interface SummaryCardsProps {
  piggyBanks: PiggyBank[];
  isLoading: boolean;
}

export default function SummaryCards({ piggyBanks, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const activeBanks = piggyBanks.filter((b) => b.status === "locked");
  const matureBank = piggyBanks.find((b) => b.status === "matured");

  // Total locked value in USD (mock: STX @ $1.82)
  const totalLockedUSD = activeBanks.reduce((sum, b) => {
    const usd = b.token.usdPrice ?? 1;
    return sum + b.amountLocked * usd;
  }, 0);

  const nextUnlock = activeBanks
    .sort((a, b) => a.unlockDate.getTime() - b.unlockDate.getTime())[0]
    ?.unlockDate;

  const totalPenaltiesPaid = piggyBanks
    .flatMap(() => [])
    .reduce((s: number) => s, 12.5); // mock

  const CARDS = [
    {
      label: "Total Locked Value",
      value: `$${formatAmount(totalLockedUSD)}`,
      sub: `${activeBanks.length} active position${activeBanks.length !== 1 ? "s" : ""}`,
      icon: TrendingUp,
      color: "#f7931a",
    },
    {
      label: "Active Piggy Banks",
      value: activeBanks.length.toString(),
      sub: matureBank ? "1 ready to withdraw" : "All funds locked",
      icon: Layers,
      color: "#8b5cf6",
    },
    {
      label: "Next Unlock",
      value: nextUnlock ? `${getDaysRemaining(nextUnlock)}d` : "—",
      sub: nextUnlock ? formatDate(nextUnlock) : "No active locks",
      icon: Calendar,
      color: "#10b981",
    },
    {
      label: "Penalties Paid",
      value: `$${totalPenaltiesPaid.toFixed(2)}`,
      sub: "From early exits",
      icon: AlertTriangle,
      color: "#ef4444",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(({ label, value, sub, icon: Icon, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.07] transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-muted uppercase tracking-wide font-medium">
              {label}
            </span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${color}15`, border: `1px solid ${color}25` }}
            >
              <Icon size={14} style={{ color }} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums mb-1">
            {value}
          </div>
          <div className="text-xs text-subtle">{sub}</div>
        </motion.div>
      ))}
    </div>
  );
}
