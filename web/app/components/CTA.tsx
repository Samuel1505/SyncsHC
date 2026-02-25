'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-20 px-6 mt-24 bg-gradient-to-b from-cyan-950/50 via-indigo-950/50 to-purple-950/50 w-full">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="p-[2px] rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 shadow-2xl shadow-violet-500/30">
            <div className="h-full w-full rounded-[22px] bg-gradient-to-br from-indigo-950/90 via-purple-950/90 to-cyan-950/90 backdrop-blur-xl px-8 py-12 md:px-16 md:py-16 border border-violet-500/20">
              <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent"
              >
                Ready to launch your first on-chain savings plan?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl text-violet-100/80 mb-10 max-w-2xl mx-auto leading-relaxed"
              >
                Connect your wallet, choose a token, and decide how long you want to lock your funds. SyncsHC handles
                the rest with transparent smart contracts so you can focus on reaching your goals—not on managing the
                details.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="mb-10 grid gap-4 text-left text-sm md:grid-cols-3"
              >
                <div className="flex flex-col gap-2 p-5 rounded-2xl bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-500/20">
                  <span className="text-xs font-bold uppercase tracking-wide text-violet-300">
                    Step 1
                  </span>
                  <span className="font-bold text-violet-100">Connect your Stacks wallet</span>
                  <span className="text-violet-200/70 text-xs">Securely link your wallet to discover and manage all your Piggy Banks.</span>
                </div>
                <div className="flex flex-col gap-2 p-5 rounded-2xl bg-gradient-to-br from-fuchsia-900/30 to-pink-900/30 border border-fuchsia-500/20">
                  <span className="text-xs font-bold uppercase tracking-wide text-fuchsia-300">
                    Step 2
                  </span>
                  <span className="font-bold text-fuchsia-100">Create a new Piggy Bank</span>
                  <span className="text-fuchsia-200/70 text-xs">Pick a token, deposit amount, and lock duration that matches your savings goal.</span>
                </div>
                <div className="flex flex-col gap-2 p-5 rounded-2xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/20">
                  <span className="text-xs font-bold uppercase tracking-wide text-cyan-300">
                    Step 3
                  </span>
                  <span className="font-bold text-cyan-100">Track progress on-chain</span>
                  <span className="text-cyan-200/70 text-xs">Watch your savings unlock over time with a transparent, immutable history.</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-3.5 text-base font-semibold rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 text-black shadow-[0_0_35px_rgba(168,85,247,0.55)] hover:shadow-[0_0_55px_rgba(251,191,36,0.6)] transition-all duration-300"
                >
                  Get started in minutes
                </motion.button>
              </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
