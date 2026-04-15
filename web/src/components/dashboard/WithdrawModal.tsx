"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2, Unlock, Lock } from "lucide-react";
import { usePiggyBankStore } from "@/store/usePiggyBankStore";
import TokenIcon from "@/components/shared/TokenIcon";
import { calcEarlyWithdrawal, formatAmount, getDaysRemaining } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WithdrawModal() {
  const { isWithdrawModalOpen, selectedBank, closeWithdrawModal, withdraw } =
    usePiggyBankStore();
  const [confirming, setConfirming] = useState(false);

  if (!selectedBank) return null;

  const isEarly = selectedBank.status === "locked";
  const daysLeft = getDaysRemaining(selectedBank.unlockDate);
  const { receive, penalty } = calcEarlyWithdrawal(
    selectedBank.amountLocked,
    selectedBank.penaltyFeePercent
  );

  const handleWithdraw = async () => {
    setConfirming(true);
    try {
      await withdraw(selectedBank.id, isEarly);
      toast.success(
        isEarly
          ? `Early withdrawal successful! Received ${formatAmount(receive, 4)} ${selectedBank.token.symbol}`
          : `Withdrawal successful! Received ${formatAmount(selectedBank.amountLocked, 4)} ${selectedBank.token.symbol}`
      );
    } catch {
      toast.error("Transaction failed. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <AnimatePresence>
      {isWithdrawModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWithdrawModal}
            className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm"
          />
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
              className="bg-navy-700 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/25 flex items-center justify-center">
                    {isEarly ? (
                      <AlertTriangle size={16} className="text-accent" />
                    ) : (
                      <Unlock size={16} className="text-success" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {isEarly ? "Early Withdrawal" : "Withdraw Funds"}
                    </h3>
                    <p className="text-xs text-muted">
                      {isEarly ? `${daysLeft} days early` : "Lock period complete"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeWithdrawModal}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-muted hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Token info */}
              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 mb-4">
                <TokenIcon token={selectedBank.token} size="lg" />
                <div>
                  <div className="text-xl font-bold text-white">
                    {formatAmount(selectedBank.amountLocked, 4)}{" "}
                    {selectedBank.token.symbol}
                  </div>
                  <div className="text-xs text-muted">Locked principal</div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 mb-5">
                {isEarly && (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted">Principal</span>
                      <span className="text-white tabular-nums">
                        {formatAmount(selectedBank.amountLocked, 4)}{" "}
                        {selectedBank.token.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-danger flex items-center gap-1">
                        <AlertTriangle size={12} />
                        Penalty ({selectedBank.penaltyFeePercent}%)
                      </span>
                      <span className="text-danger tabular-nums">
                        − {formatAmount(penalty, 4)} {selectedBank.token.symbol}
                      </span>
                    </div>
                    <div className="h-px bg-white/10" />
                  </>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-white">
                    {isEarly ? "You Receive" : "Total Payout"}
                  </span>
                  <span
                    className={`text-lg font-bold tabular-nums ${
                      isEarly ? "text-accent" : "text-success"
                    }`}
                  >
                    {formatAmount(isEarly ? receive : selectedBank.amountLocked, 4)}{" "}
                    {selectedBank.token.symbol}
                  </span>
                </div>
              </div>

              {/* Warning for early */}
              {isEarly && (
                <div className="flex gap-3 bg-danger/8 border border-danger/20 rounded-xl p-3.5 mb-5">
                  <AlertTriangle size={15} className="text-danger shrink-0 mt-0.5" />
                  <p className="text-xs text-danger/90 leading-relaxed">
                    Withdrawing early incurs a{" "}
                    <strong>{selectedBank.penaltyFeePercent}% penalty</strong>. Wait{" "}
                    <strong>{daysLeft} more days</strong> for penalty-free withdrawal.
                  </p>
                </div>
              )}

              {/* Confirm button */}
              <button
                onClick={handleWithdraw}
                disabled={confirming}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isEarly
                    ? "bg-danger/15 hover:bg-danger/25 border border-danger/30 text-danger"
                    : "bg-success/15 hover:bg-success/25 border border-success/30 text-success"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {confirming ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    Confirming...
                  </>
                ) : isEarly ? (
                  <>
                    <Lock size={14} />
                    Confirm Early Withdrawal
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    Confirm Withdrawal
                  </>
                )}
              </button>

              <p className="text-center text-xs text-subtle mt-3">
                This action requires wallet confirmation
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
