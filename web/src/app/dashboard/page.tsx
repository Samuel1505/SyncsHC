"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wallet, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SummaryCards from "@/components/dashboard/SummaryCards";
import PiggyBanksList from "@/components/dashboard/PiggyBanksList";
import WithdrawModal from "@/components/dashboard/WithdrawModal";
import TransactionHistory from "@/components/dashboard/TransactionHistory";
import { useWalletStore } from "@/store/useWalletStore";
import { usePiggyBankStore } from "@/store/usePiggyBankStore";
import { truncateAddress } from "@/lib/utils";

export default function DashboardPage() {
  const { address, connect } = useWalletStore();
  const { piggyBanks, transactions, isLoading, fetchPiggyBanks } =
    usePiggyBankStore();

  useEffect(() => {
    if (address) {
      fetchPiggyBanks(address);
    }
  }, [address, fetchPiggyBanks]);

  // Not connected state
  if (!address) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center min-h-screen bg-navy px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center mx-auto mb-5">
              <Wallet size={26} className="text-accent" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white mb-3">
              Connect Your Wallet
            </h1>
            <p className="text-sm text-muted leading-relaxed mb-7">
              Connect your Hiro or Xverse wallet to view your Piggy Banks,
              track progress, and manage withdrawals.
            </p>
            <button
              onClick={connect}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-500 text-white rounded-full px-7 py-3 font-semibold text-sm transition-all hover:scale-105 shadow-[0_0_30px_rgba(247,147,26,0.3)]"
            >
              Connect Wallet
              <ArrowRight size={16} />
            </button>
            <div className="mt-4">
              <Link href="/" className="text-xs text-subtle hover:text-muted transition-colors">
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-xs text-muted mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="font-mono">{truncateAddress(address, 6)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Welcome back
            </h1>
            <p className="text-sm text-muted mt-1">
              Your savings dashboard — track, manage, and grow your locked funds.
            </p>
          </motion.div>

          {/* Summary cards */}
          <div className="mb-8">
            <SummaryCards piggyBanks={piggyBanks} isLoading={isLoading} />
          </div>

          {/* Piggy Banks list */}
          <div className="mb-10">
            <PiggyBanksList piggyBanks={piggyBanks} isLoading={isLoading} />
          </div>

          {/* Transaction history */}
          <TransactionHistory
            transactions={transactions}
            isLoading={isLoading}
          />
        </div>
      </main>

      {/* Withdraw modal (portal-style, rendered at root level) */}
      <WithdrawModal />
      <Footer />
    </>
  );
}
