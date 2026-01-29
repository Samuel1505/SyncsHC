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
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-24 px-6 overflow-hidden bg-black mb-20">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 border border-white/5"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 0.5,
            y: -mousePosition.y * 0.5,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-white/5"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase border border-white text-white">
            Built on Stacks Blockchain
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-tight tracking-tight"
        >
          Decentralized
          <br />
          <span className="relative inline-block">
            Savings
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] as const }}
              className="absolute bottom-3 left-0 h-2 border-b-2 border-white"
              style={{ opacity: 0.2 }}
            />
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Lock your STX and SIP-010 tokens for a specified duration. Withdraw early with a small penalty, or wait for penalty-free withdrawals.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mb-12 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 border border-white/10">
              <div className="font-semibold text-white mb-1">Smart Contracts</div>
              <div className="text-white/60">Automated, trustless savings</div>
            </div>
            <div className="p-4 border border-white/10">
              <div className="font-semibold text-white mb-1">5% Early Withdrawal</div>
              <div className="text-white/60">Transparent penalty fee</div>
            </div>
            <div className="p-4 border border-white/10">
              <div className="font-semibold text-white mb-1">Multi-Token</div>
              <div className="text-white/60">STX & SIP-010 support</div>
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
            className="px-8 py-4 text-base font-medium bg-white text-black hover:bg-white/90 transition-all"
          >
            Create Piggy Bank
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 text-base font-medium bg-transparent text-white border-2 border-white hover:bg-white hover:text-black transition-all"
          >
            Learn More
          </motion.button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-white/40"
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white" />
            <span>Time-Locked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white" />
            <span>5% Early Withdrawal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white" />
            <span>On-Chain</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
