"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { TrendingUp, Layers, AlertTriangle, Coins } from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { PROTOCOL_STATS } from "@/lib/mockData";

const TVLChart = dynamic(() => import("./TVLChart"), { ssr: false });

const STATS = [
  {
    label: "Total Value Locked",
    value: PROTOCOL_STATS.tvl,
    prefix: "$",
    icon: TrendingUp,
    color: "#f7931a",
    description: "Across all active piggy banks",
  },
  {
    label: "Piggy Banks Created",
    value: PROTOCOL_STATS.totalPiggyBanks,
    icon: Layers,
    color: "#8b5cf6",
    description: "Since protocol launch",
  },
  {
    label: "Penalty Fees Collected",
    value: PROTOCOL_STATS.totalPenalties,
    prefix: "$",
    icon: AlertTriangle,
    color: "#ef4444",
    description: "From early withdrawals",
  },
  {
    label: "Supported Tokens",
    value: PROTOCOL_STATS.supportedTokens,
    icon: Coins,
    color: "#10b981",
    description: "STX, sBTC, ALEX, USDA",
  },
];

export default function ProtocolStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 lg:py-32 bg-navy" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-accent uppercase tracking-[0.15em] mb-3 block">
            Protocol Stats
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
            Numbers that speak for themselves
          </h2>
          <p className="text-muted text-lg max-w-lg mx-auto">
            Real-time on-chain data from the SyncsHC protocol on Stacks mainnet.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STATS.map(({ label, value, prefix, icon: Icon, color, description }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.07] transition-all group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ background: `${color}15`, border: `1px solid ${color}28` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              <div className="text-2xl font-bold text-white tabular-nums mb-1">
                <AnimatedCounter value={value} prefix={prefix} />
              </div>
              <div className="text-sm font-medium text-white/80 mb-1">{label}</div>
              <div className="text-xs text-subtle">{description}</div>
            </motion.div>
          ))}
        </div>

        {/* TVL Chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">
                TVL Over Time
              </h3>
              <p className="text-xs text-muted mt-0.5">Last 30 days</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-accent">$12.45M</div>
              <div className="text-xs text-success">↑ 53.7% this month</div>
            </div>
          </div>
          <TVLChart />
        </motion.div>
      </div>
    </section>
  );
}
