"use client";

import { useState, useEffect } from "react";
import { Wallet, LogOut, ChevronDown } from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import { truncateAddress } from "@/lib/utils";

export default function WalletButton() {
  const { address, isConnecting, connect, disconnect } = useWalletStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-10 w-36 rounded-full bg-white/5 animate-pulse" />
    );
  }

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2.5 bg-accent/10 border border-accent/30 rounded-full px-4 py-2 cursor-default">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-sm font-medium text-accent">
            {truncateAddress(address)}
          </span>
          <ChevronDown size={14} className="text-accent/60" />
        </div>
        <button
          onClick={disconnect}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-danger/20 border border-white/10 hover:border-danger/40 text-muted hover:text-danger transition-all"
          title="Disconnect wallet"
        >
          <LogOut size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center gap-2 bg-accent hover:bg-accent-500 disabled:opacity-60 text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(247,147,26,0.3)]"
    >
      {isConnecting ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet size={15} />
          Connect Wallet
        </>
      )}
    </button>
  );
}
