"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { PiggyBank } from "@/types";
import PiggyBankCard from "./PiggyBankCard";
import { PiggyBankCardSkeleton } from "@/components/shared/SkeletonLoader";

interface PiggyBanksListProps {
  piggyBanks: PiggyBank[];
  isLoading: boolean;
}

export default function PiggyBanksList({ piggyBanks, isLoading }: PiggyBanksListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold font-display text-white">
            My Piggy Banks
          </h2>
          <p className="text-xs text-muted mt-0.5">
            {isLoading ? "Loading..." : `${piggyBanks.length} position${piggyBanks.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-1.5 bg-accent/10 hover:bg-accent/20 border border-accent/30 text-accent rounded-xl px-3.5 py-2 text-xs font-semibold transition-all"
        >
          <Plus size={13} />
          New Bank
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <PiggyBankCardSkeleton key={i} />
          ))}
        </div>
      ) : piggyBanks.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.06] border-dashed rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/25 flex items-center justify-center mx-auto mb-4">
            <Plus size={22} className="text-accent" />
          </div>
          <h3 className="text-base font-semibold text-white mb-2">
            No Piggy Banks yet
          </h3>
          <p className="text-sm text-muted mb-5 max-w-xs mx-auto">
            Create your first Piggy Bank to start saving on-chain with discipline.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-500 text-white rounded-full px-6 py-2.5 text-sm font-semibold transition-all hover:scale-105"
          >
            Create First Piggy Bank
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {piggyBanks.map((bank, i) => (
            <PiggyBankCard key={bank.id} bank={bank} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
