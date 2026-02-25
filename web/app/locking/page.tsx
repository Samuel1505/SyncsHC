'use client';

import PageTransition from '../components/PageTransition';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const lockingFeatures = [
  {
    title: 'Block-Based Duration',
    description: 'Set your lock duration in blocks. Each Stacks block is approximately 10 minutes, giving you precise control over your savings timeline. Calculate your lock period based on your specific goals.',
    icon: '⏱️',
  },
  {
    title: 'Early Withdrawal Option',
    description: 'Need funds urgently? You can withdraw before the lock expires with a transparent 5% penalty fee. The penalty is calculated automatically by the smart contract—no surprises, no hidden fees.',
    icon: '🔓',
  },
  {
    title: 'Penalty-Free After Lock',
    description: 'Once your lock duration expires, all withdrawals become completely penalty-free. Wait for the lock to expire and access your full savings without any deductions.',
    icon: '✅',
  },
  {
    title: 'Automatic Enforcement',
    description: 'The time-lock is enforced by smart contract code, not promises. Once set, the lock duration cannot be changed, ensuring your savings discipline is protected on-chain.',
    icon: '🔒',
  },
  {
    title: 'Transparent Calculations',
    description: 'All penalty calculations happen automatically on-chain. You can verify exactly how much you\'ll receive before withdrawing, with full transparency in every transaction.',
    icon: '📐',
  },
  {
    title: 'Multiple Lock Periods',
    description: 'Create different Piggy Banks with different lock durations. Short-term goals can have shorter locks, while long-term savings can have extended periods—all managed in one place.',
    icon: '📅',
  },
];

const examples = [
  {
    scenario: 'Early Withdrawal',
    lockStatus: 'Active',
    amount: '100 STX',
    penalty: '5 STX (5%)',
    received: '95 STX',
    cardClass: 'bg-gradient-to-br from-fuchsia-900/40 via-pink-900/40 to-rose-900/40 border-2 border-fuchsia-500/20',
    badgeClass: 'bg-gradient-to-r from-fuchsia-500/30 to-pink-500/30 border border-fuchsia-400/30 text-fuchsia-200',
    statusClass: 'text-fuchsia-200',
    penaltyClass: 'text-fuchsia-200',
    receivedClass: 'text-fuchsia-200',
  },
  {
    scenario: 'After Lock Expires',
    lockStatus: 'Expired',
    amount: '100 STX',
    penalty: '0 STX',
    received: '100 STX',
    cardClass: 'bg-gradient-to-br from-emerald-900/40 via-teal-900/40 to-cyan-900/40 border-2 border-emerald-500/20',
    badgeClass: 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30 border border-emerald-400/30 text-emerald-200',
    statusClass: 'text-emerald-200',
    penaltyClass: 'text-emerald-200',
    receivedClass: 'text-emerald-200',
  },
];

export default function LockingPage() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full overflow-x-hidden">
        <Navigation />
        <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-indigo-950/80 via-purple-950/80 to-cyan-950/80 w-full">
          <div className="max-w-6xl mx-auto">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <p className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border border-violet-400/40 text-violet-100/90 rounded-full bg-white/5 backdrop-blur">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
                SyncsHC · Time-Locking
              </p>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
                How Time-Locking Works
              </h1>
              <p className="mt-4 text-base md:text-lg text-violet-100/80 max-w-2xl mx-auto">
                Understand the time-lock mechanism, early withdrawal penalties, and how to make the most of your locked savings.
              </p>
            </motion.header>

            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-fuchsia-300 via-pink-300 to-rose-300 bg-clip-text text-transparent">
                Time-Lock Features
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockingFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-3xl bg-gradient-to-br from-fuchsia-900/40 via-pink-900/40 to-rose-900/40 border-2 border-fuchsia-500/20 backdrop-blur-sm hover:border-fuchsia-400/50 hover:shadow-2xl hover:shadow-fuchsia-500/20 transition-all duration-300 group"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-fuchsia-100 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-fuchsia-200/70 leading-relaxed text-sm group-hover:text-fuchsia-200/90 transition-colors">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Withdrawal Examples
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {examples.map((example, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className={`p-6 rounded-3xl ${example.cardClass} backdrop-blur-sm`}
                  >
                    <div className="mb-4">
                      <span className={`inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full ${example.badgeClass}`}>
                        {example.scenario}
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/60">Lock Status:</span>
                        <span className={`text-sm font-semibold ${example.statusClass}`}>{example.lockStatus}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/60">Withdrawal Amount:</span>
                        <span className="text-sm font-semibold text-white">{example.amount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/60">Penalty Fee:</span>
                        <span className={`text-sm font-semibold ${example.penaltyClass}`}>{example.penalty}</span>
                      </div>
                      <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                        <span className="text-base font-semibold text-white">You Receive:</span>
                        <span className={`text-lg font-bold ${example.receivedClass}`}>{example.received}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-violet-900/40 border-2 border-indigo-500/30 backdrop-blur-sm"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-200 via-purple-200 to-violet-200 bg-clip-text text-transparent">
                Understanding Block Duration
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center p-4 rounded-2xl bg-white/5">
                  <div className="text-3xl font-bold text-indigo-200 mb-2">~10 min</div>
                  <div className="text-sm text-indigo-200/70">Per Block</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5">
                  <div className="text-3xl font-bold text-purple-200 mb-2">144 blocks</div>
                  <div className="text-sm text-purple-200/70">≈ 1 Day</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5">
                  <div className="text-3xl font-bold text-violet-200 mb-2">43,200 blocks</div>
                  <div className="text-sm text-violet-200/70">≈ 1 Month</div>
                </div>
              </div>
              <p className="mt-6 text-center text-indigo-200/70 text-sm">
                Plan your lock duration based on your savings goals. Remember, you can always withdraw early with a 5% penalty if needed.
              </p>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    </PageTransition>
  );
}
