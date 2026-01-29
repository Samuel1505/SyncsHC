'use client';

import { motion } from 'framer-motion';

const footerLinks = [
  { label: 'Documentation', href: '#docs' },
  { label: 'GitHub', href: 'https://github.com' },
  { label: 'Terms', href: '#terms' },
  { label: 'Privacy', href: '#privacy' },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-black dark:border-white bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="h-8 w-8 border-2 border-black dark:border-white flex items-center justify-center">
              <span className="text-black dark:text-white font-bold">S</span>
            </div>
            <span className="text-lg font-semibold text-black dark:text-white tracking-tight">
              SyncsHC
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-6 justify-center"
          >
            {footerLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                whileHover={{ y: -2 }}
                className="text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 pt-8 border-t border-black/10 dark:border-white/10 text-center"
        >
          <p className="text-sm text-black/40 dark:text-white/40">
            Built on Stacks Blockchain • Decentralized Savings Protocol
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
