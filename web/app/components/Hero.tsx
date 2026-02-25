'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-24 px-6 overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-cyan-950">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 border border-violet-500/15 rounded-3xl blur-sm"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.5,
            y: -mousePosition.y * 0.5,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          className="absolute bottom-1/4 right-1/4 w-72 h-72 border border-cyan-400/15 rounded-3xl blur-sm"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.16),transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),transparent_55%)]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto text-center relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border border-violet-400/40 text-violet-100/90 rounded-full bg-white/5 backdrop-blur">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
            SyncsHC · On-Chain Piggy Banks
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight tracking-tight"
        >
          Save on-chain.
          <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300">
            Never break your goals.
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
              className="absolute -bottom-3 left-0 h-2 border-b-2 border-violet-400/60"
              style={{ opacity: 0.2 }}
            />
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          SyncsHC lets you create programmable Piggy Banks on the Stacks blockchain—time-locked, non-custodial savings
          vaults for STX and approved SIP-010 tokens. Commit to a date, grow your stack with discipline, and access funds
          early only when it really matters, with transparent on-chain rules.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mb-14 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-6 border-2 border-violet-500/30 bg-gradient-to-br from-violet-900/20 to-purple-900/20 rounded-3xl text-left backdrop-blur-sm hover:border-violet-400/50 transition-all duration-300 shadow-lg shadow-violet-500/10">
              <div className="font-bold text-lg text-violet-200 mb-2">Time-locked Piggy Banks</div>
              <div className="text-violet-100/80 text-sm leading-relaxed">
                Lock funds by block height and give every savings goal its own dedicated smart contract vault.
              </div>
            </div>
            <div className="p-6 border-2 border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-900/20 to-pink-900/20 rounded-3xl text-left backdrop-blur-sm hover:border-fuchsia-400/50 transition-all duration-300 shadow-lg shadow-fuchsia-500/10">
              <div className="font-bold text-lg text-fuchsia-200 mb-2">Gentle Early-Exit Penalty</div>
              <div className="text-fuchsia-100/80 text-sm leading-relaxed">
                Withdraw early with a clear 5% penalty that nudges you to stay committed without ever blocking access.
              </div>
            </div>
            <div className="p-6 border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-3xl text-left backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 shadow-lg shadow-cyan-500/10">
              <div className="font-bold text-lg text-cyan-200 mb-2">Multi-token & Composable</div>
              <div className="text-cyan-100/80 text-sm leading-relaxed">
                Save in STX or supported SIP-010 tokens and orchestrate multiple Piggy Banks for different life goals.
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3.5 text-base font-semibold rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 text-black shadow-[0_0_35px_rgba(168,85,247,0.55)] hover:shadow-[0_0_55px_rgba(251,191,36,0.6)] transition-all duration-300"
          >
            Launch App · Create Piggy Bank
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3.5 text-base font-medium rounded-full bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
          >
            Explore how it works
          </motion.button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-white/40"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>Non-custodial, audited smart contracts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
            <span>Clear 5% early withdrawal rules on-chain</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
            <span>Designed for long-term crypto savings</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
