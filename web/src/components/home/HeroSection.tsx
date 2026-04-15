"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart3, TrendingUp, Layers, Users, Coins } from "lucide-react";
import VaultAnimation from "./VaultAnimation";
import AnimatedCounter from "@/components/shared/AnimatedCounter";

const TRUST_STATS = [
  {
    label: "Total Value Locked",
    value: 12450000,
    prefix: "$",
    icon: TrendingUp,
    color: "#f7931a",
  },
  {
    label: "Active Piggy Banks",
    value: 3842,
    icon: Layers,
    color: "#8b5cf6",
  },
  {
    label: "Unique Users",
    value: 1204,
    icon: Users,
    color: "#10b981",
  },
  {
    label: "Tokens Supported",
    value: 4,
    icon: Coins,
    color: "#f59e0b",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.25, 0.4, 0.25, 1] } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Gradient orbs */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(247,147,26,0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* Left: Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 rounded-full px-3.5 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-xs font-semibold text-accent tracking-wide uppercase">
                  Built on Stacks Blockchain
                </span>
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl xl:text-6xl font-bold font-display leading-[1.12] tracking-tight text-white mb-6"
            >
              Save Smarter.{" "}
              <span className="text-accent">Lock Stronger.</span>{" "}
              Earn Your Discipline.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted leading-relaxed max-w-lg mb-9"
            >
              SyncsHC is a decentralized savings protocol on Stacks. Lock STX
              or SIP-010 tokens for a set duration — withdraw early with a small
              fee, or collect in full at maturity.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-500 text-white rounded-full px-7 py-3.5 font-semibold text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(247,147,26,0.35)]"
              >
                Create a Piggy Bank
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-full px-7 py-3.5 font-semibold text-sm transition-all"
              >
                <BarChart3 size={17} />
                View Dashboard
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Vault animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex items-center justify-center"
          >
            <VaultAnimation />
          </motion.div>
        </div>

        {/* Trust stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {TRUST_STATS.map(({ label, value, prefix, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.12] rounded-2xl p-5 text-center transition-all group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
              >
                <Icon size={16} style={{ color }} />
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">
                <AnimatedCounter value={value} prefix={prefix} />
              </div>
              <div className="text-xs text-muted mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
