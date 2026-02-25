'use client';

import PageTransition from '../components/PageTransition';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const savingsFeatures = [
  {
    title: 'Goal-Based Savings',
    description: 'Create separate Piggy Banks for different financial goals. Whether you\'re saving for an emergency fund, vacation, down payment, or retirement, each goal gets its own dedicated smart contract vault.',
    icon: '🎯',
  },
  {
    title: 'Multi-Token Support',
    description: 'Save in STX or any supported SIP-010 fungible token. Diversify your crypto savings strategy across different assets while maintaining the same time-lock protection for all.',
    icon: '💎',
  },
  {
    title: 'Unlimited Accounts',
    description: 'Create as many Piggy Banks as you need. Each account is completely isolated, giving you full control and organization over your savings portfolio.',
    icon: '📊',
  },
  {
    title: 'On-Chain Transparency',
    description: 'Every deposit, withdrawal, and lock status change is recorded permanently on the Stacks blockchain. View your complete savings history with full transparency.',
    icon: '🔍',
  },
  {
    title: 'No Middlemen',
    description: 'Decentralized means no banks, no intermediaries, no account freezes. You control your funds completely through smart contracts.',
    icon: '⚡',
  },
  {
    title: 'Global Registry',
    description: 'All your Piggy Banks are tracked in a transparent, on-chain registry. Monitor all your savings accounts in one place with complete visibility.',
    icon: '📋',
  },
];

const useCases = [
  {
    title: 'Emergency Fund',
    description: 'Build a dedicated emergency fund that\'s accessible but protected. Set a 6-month lock to ensure you only tap into it for true emergencies.',
    duration: '6 months',
  },
  {
    title: 'Short-Term Goals',
    description: 'Save for vacations, major purchases, or special events. Create a Piggy Bank with a lock duration that matches your timeline.',
    duration: '1-3 months',
  },
  {
    title: 'Long-Term Wealth',
    description: 'Lock funds for extended periods to build wealth without temptation. Perfect for retirement planning or building generational wealth.',
    duration: '1+ years',
  },
];

export default function SavingsPage() {
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
                SyncsHC · Savings
              </p>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
                Decentralized Savings on Stacks
              </h1>
              <p className="mt-4 text-base md:text-lg text-violet-100/80 max-w-2xl mx-auto">
                Take control of your financial future with programmable, time-locked savings vaults on the blockchain.
              </p>
            </motion.header>

            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                Why Save with SyncsHC?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savingsFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-3xl bg-gradient-to-br from-violet-900/40 via-purple-900/40 to-fuchsia-900/40 border-2 border-violet-500/20 backdrop-blur-sm hover:border-violet-400/50 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 group"
                  >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-3 text-violet-100 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-violet-200/70 leading-relaxed text-sm group-hover:text-violet-200/90 transition-colors">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Common Savings Use Cases
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {useCases.map((useCase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="p-6 rounded-3xl bg-gradient-to-br from-cyan-900/40 via-blue-900/40 to-indigo-900/40 border-2 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 group"
                  >
                    <div className="mb-4">
                      <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-400/30 text-cyan-200">
                        {useCase.duration}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-cyan-100 group-hover:text-white transition-colors">
                      {useCase.title}
                    </h3>
                    <p className="text-cyan-200/70 leading-relaxed text-sm group-hover:text-cyan-200/90 transition-colors">
                      {useCase.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-violet-900/40 via-purple-900/40 to-fuchsia-900/40 border-2 border-violet-500/30 backdrop-blur-sm text-center"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
                Ready to Start Saving?
              </h2>
              <p className="text-violet-100/80 mb-6 max-w-2xl mx-auto">
                Create your first Piggy Bank today and take control of your financial future with transparent, on-chain savings.
              </p>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 text-base font-semibold rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 text-black shadow-[0_0_35px_rgba(168,85,247,0.55)] hover:shadow-[0_0_55px_rgba(251,191,36,0.6)] transition-all duration-300"
              >
                Create Your First Piggy Bank
              </motion.button>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    </PageTransition>
  );
}
