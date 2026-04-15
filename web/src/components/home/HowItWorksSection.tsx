"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Wallet, Lock, TrendingUp, ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: 1,
    icon: Wallet,
    title: "Connect Your Wallet",
    description:
      "Link your Hiro Wallet or Xverse in seconds. SyncsHC supports all major Stacks-compatible wallets with one-click authentication.",
    color: "#f7931a",
    gradient: "from-[#f7931a]/20 to-transparent",
  },
  {
    step: 2,
    icon: Lock,
    title: "Create a Piggy Bank",
    description:
      "Choose your token, set the amount, and pick a lock duration. Your funds are secured on-chain in a non-custodial Clarity smart contract.",
    color: "#8b5cf6",
    gradient: "from-[#8b5cf6]/20 to-transparent",
  },
  {
    step: 3,
    icon: TrendingUp,
    title: "Save & Withdraw",
    description:
      "Track your progress in real time. Withdraw penalty-free at maturity, or exit early with a transparent 5% fee — the choice is always yours.",
    color: "#10b981",
    gradient: "from-[#10b981]/20 to-transparent",
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-accent uppercase tracking-[0.15em] mb-3 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
            Three steps to financial discipline
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">
            From wallet connection to maturity — the entire journey is
            transparent, on-chain, and in your control.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map(({ step, icon: Icon, title, description, color, gradient }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative group"
            >
              {/* Connector arrow (between steps) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex absolute top-1/4 -right-3 z-10 items-center">
                  <ArrowRight size={16} className="text-subtle" />
                </div>
              )}
              <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/[0.15] rounded-2xl p-6 h-full transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                {/* Step number + icon */}
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${color}15`,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <span
                    className="text-5xl font-black font-display opacity-10 leading-none mt-1"
                    style={{ color }}
                  >
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold font-display text-white mb-2.5">
                  {title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
