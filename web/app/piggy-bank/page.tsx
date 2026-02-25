'use client';

import { useState } from 'react';
import { uintCV } from '@stacks/transactions';
import PageTransition from '../components/PageTransition';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useStacks } from '../contexts/StacksContext';
import { useContractCall } from '../hooks/useContractCall';
import { motion } from 'framer-motion';

type LockUnit = 'blocks' | 'days';

function convertToBlocks(value: number, unit: LockUnit): number {
  if (unit === 'blocks') return value;
  // Approx: 1 block ~ 10 minutes → 144 blocks per day
  return value * 144;
}

export default function PiggyBankPage() {
  const { isConnected, address } = useStacks();
  const { execute, isLoading, error } = useContractCall();

  const [goalName, setGoalName] = useState('');
  const [lockValue, setLockValue] = useState<string>('30');
  const [lockUnit, setLockUnit] = useState<LockUnit>('days');
  const [txId, setTxId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxId(null);

    const numericValue = Number(lockValue);
    if (Number.isNaN(numericValue) || numericValue <= 0) {
      return;
    }

    const lockDurationBlocks = convertToBlocks(numericValue, lockUnit);

    const factoryEnv = process.env.NEXT_PUBLIC_PIGGY_BANK_FACTORY_ADDRESS;
    const defaultAddress = factoryEnv?.split('.')[0] || '';
    const defaultName = factoryEnv?.split('.')[1] || 'piggy-bank-factory';

    if (!defaultAddress || !defaultName) {
      console.error('PIGGY_BANK_FACTORY_ADDRESS env var is not set correctly');
      return;
    }

    await execute({
      contractAddress: defaultAddress,
      contractName: defaultName,
      functionName: 'create-piggy-bank',
      functionArgs: [uintCV(lockDurationBlocks)],
      onSuccess: (id) => {
        setTxId(id);
      },
      onError: (err) => {
        console.error('Create piggy bank failed:', err);
      },
    });
  };

  return (
    <PageTransition>
      <main className="min-h-screen w-full overflow-x-hidden">
        <Navigation />
        <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-indigo-950/80 via-purple-950/80 to-cyan-950/80 w-full">
          <div className="max-w-5xl mx-auto">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <p className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border border-violet-400/40 text-violet-100/90 rounded-full bg-white/5 backdrop-blur">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
                Create Piggy Bank
              </p>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
                Open a new on-chain Piggy Bank
              </h1>
              <p className="mt-4 text-base md:text-lg text-violet-100/80 max-w-2xl mx-auto">
                Choose a goal and lock duration, then deploy a dedicated smart contract vault on the Stacks blockchain.
              </p>
            </motion.header>

            <div className="grid md:grid-cols-5 gap-10 items-start">
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="md:col-span-3 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-violet-900/40 via-purple-900/40 to-fuchsia-900/40 border-2 border-violet-500/30 backdrop-blur-sm space-y-6"
              >
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-violet-100">
                    Savings goal (optional)
                  </label>
                  <input
                    type="text"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="e.g. Emergency fund, New laptop, Long-term stack"
                    className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/40 text-white text-sm placeholder:text-violet-300/40 focus:outline-none focus:ring-2 focus:ring-violet-400/80"
                  />
                  <p className="text-xs text-violet-200/70">
                    This is just for your own tracking. The smart contract itself does not store this label.
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-violet-100">
                    Lock duration
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      min={1}
                      value={lockValue}
                      onChange={(e) => setLockValue(e.target.value)}
                      className="w-32 px-3 py-2 rounded-xl bg-black/30 border border-violet-500/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/80"
                    />
                    <select
                      value={lockUnit}
                      onChange={(e) => setLockUnit(e.target.value as LockUnit)}
                      className="px-3 py-2 rounded-xl bg-black/30 border border-violet-500/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-400/80"
                    >
                      <option value="days">Days (approx)</option>
                      <option value="blocks">Blocks</option>
                    </select>
                  </div>
                  <p className="text-xs text-violet-200/70">
                    1 Stacks block is roughly 10 minutes. For example, 30 days ≈ 4,320 blocks.
                  </p>
                </div>

                <div className="space-y-2 text-xs text-violet-200/80 bg-black/20 border border-violet-500/20 p-4 rounded-2xl">
                  <p className="font-semibold text-violet-100 mb-1">What happens after creation?</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>A new Piggy Bank contract is deployed and registered on-chain.</li>
                    <li>You can then deposit STX or supported SIP-010 tokens into this Piggy Bank.</li>
                    <li>Withdrawing before the lock expires will apply a 5% penalty, enforced by the contract.</li>
                  </ul>
                </div>

                {!isConnected && (
                  <p className="text-sm text-fuchsia-200/80">
                    Connect your wallet from the top navigation before creating a Piggy Bank.
                  </p>
                )}

                {error && (
                  <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-100 text-xs">
                    {error.message}
                  </div>
                )}

                {txId && (
                  <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-100 text-xs break-all">
                    Piggy Bank creation transaction ID:
                    <br />
                    {txId}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={!isConnected || isLoading}
                  whileHover={{ scale: isConnected && !isLoading ? 1.02 : 1, y: isConnected && !isLoading ? -2 : 0 }}
                  whileTap={{ scale: isConnected && !isLoading ? 0.98 : 1 }}
                  className="w-full px-6 py-3.5 text-sm font-semibold rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 text-black shadow-[0_0_35px_rgba(168,85,247,0.55)] hover:shadow-[0_0_55px_rgba(251,191,36,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Piggy Bank...' : 'Create Piggy Bank'}
                </motion.button>

                {address && (
                  <p className="text-[11px] text-violet-200/60 text-center mt-2 font-mono">
                    Connected as {address.slice(0, 8)}...{address.slice(-6)}
                  </p>
                )}
              </motion.form>

              <motion.aside
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:col-span-2 space-y-6"
              >
                <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-indigo-900/40 border-2 border-cyan-500/30">
                  <h2 className="text-lg font-semibold mb-3 text-cyan-100">Tips for choosing a lock</h2>
                  <ul className="space-y-2 text-xs text-cyan-100/80 list-disc list-inside">
                    <li>Shorter locks (7–30 days) are good for experimenting and short-term goals.</li>
                    <li>Medium locks (30–180 days) encourage stronger savings discipline.</li>
                    <li>Long locks (6–24 months) are best for long-term wealth building and retirement-style goals.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900/40 via-teal-900/40 to-cyan-900/40 border-2 border-emerald-500/30">
                  <h2 className="text-lg font-semibold mb-3 text-emerald-100">After creating a Piggy Bank</h2>
                  <p className="text-xs text-emerald-100/80">
                    Once your Piggy Bank is created, you can use the app&apos;s future management interface (or direct
                    contract calls) to deposit STX or tokens, view your lock status, and withdraw when you&apos;re
                    ready. All actions are executed by Clarity smart contracts on Stacks.
                  </p>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </PageTransition>
  );
}

