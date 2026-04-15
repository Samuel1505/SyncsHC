"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock, Shield, TrendingUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CreatePiggyBankForm from "@/components/create/CreatePiggyBankForm";
import WalletButton from "@/components/shared/WalletButton";
import { useWalletStore } from "@/store/useWalletStore";

const FEATURE_BULLETS = [
  {
    icon: Lock,
    title: "Non-custodial",
    desc: "Only you can access your funds. No third party can move your tokens.",
    color: "#f7931a",
  },
  {
    icon: Shield,
    title: "Audited Contract",
    desc: "Clarity smart contracts reviewed and audited for maximum security.",
    color: "#10b981",
  },
  {
    icon: TrendingUp,
    title: "Build Discipline",
    desc: "Commit to your savings goal. The protocol enforces your own rules.",
    color: "#8b5cf6",
  },
];

export default function CreatePage() {
  const { address } = useWalletStore();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy pt-24 pb-16">
        {/* Background orb */}
        <div
          className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, #f7931a 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={13} />
            Back to Home
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-14 items-start">
            {/* Left: Info column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-2 space-y-6 lg:sticky lg:top-28"
            >
              <div>
                <span className="text-xs font-semibold text-accent uppercase tracking-[0.15em] mb-3 block">
                  Create Piggy Bank
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold font-display text-white leading-tight mb-4">
                  Lock funds.{" "}
                  <span className="text-accent">Build discipline.</span>
                </h1>
                <p className="text-muted text-sm leading-relaxed">
                  Choose your token, set your amount, and pick a lock duration.
                  SyncsHC enforces your savings commitment on-chain — fully
                  transparent and non-custodial.
                </p>
              </div>

              {/* Feature bullets */}
              <div className="space-y-3.5">
                {FEATURE_BULLETS.map(({ icon: Icon, title, desc, color }) => (
                  <div key={title} className="flex items-start gap-3.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}25`,
                      }}
                    >
                      <Icon size={14} style={{ color }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white mb-0.5">
                        {title}
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Wallet status */}
              {!address && (
                <div className="bg-accent/[0.07] border border-accent/20 rounded-xl p-4">
                  <p className="text-xs text-accent mb-3 font-medium">
                    Connect your wallet to lock funds
                  </p>
                  <WalletButton />
                </div>
              )}
            </motion.div>

            {/* Right: Form column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 sm:p-8">
                <CreatePiggyBankForm />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
