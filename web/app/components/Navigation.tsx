'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 border-2 border-white flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">
              SyncsHC
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <motion.a
              href="#features"
              whileHover={{ y: -2 }}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Features
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ y: -2 }}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              How It Works
            </motion.a>
            <motion.a
              href="#docs"
              whileHover={{ y: -2 }}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Docs
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 text-sm font-medium bg-white text-black hover:bg-white/90 transition-all"
            >
              Connect Wallet
            </motion.button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <motion.span
                animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="h-0.5 w-full bg-white"
              />
              <motion.span
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="h-0.5 w-full bg-white"
              />
              <motion.span
                animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="h-0.5 w-full bg-white"
              />
            </div>
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="pt-4 pb-2 space-y-3">
            <a href="#features" className="block text-sm font-medium text-white/70 hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="block text-sm font-medium text-white/70 hover:text-white">
              How It Works
            </a>
            <a href="#docs" className="block text-sm font-medium text-white/70 hover:text-white">
              Docs
            </a>
            <button className="w-full px-6 py-2.5 text-sm font-medium bg-white text-black">
              Connect Wallet
            </button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
