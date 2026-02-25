'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Time-Locked Savings',
    description: 'Lock your STX or supported SIP-010 tokens for a specific block duration. Set your savings goals and stick to them with enforced time locks. Each block on Stacks is approximately 10 minutes, giving you precise control over your lock period.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Flexible Withdrawals',
    description: 'Need funds early? Withdraw before the lock expires with a transparent 5% penalty fee. The penalty is calculated automatically by the smart contract—no surprises. Or wait for the lock period to expire for completely penalty-free withdrawals.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: 'Factory Pattern',
    description: 'Easily create and manage multiple Piggy Bank contracts through our factory contract. Each Piggy Bank is a separate smart contract instance, giving you complete isolation and control. All instances are tracked in our global registry for complete transparency and accountability.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Secure & Transparent',
    description: 'Built on Stacks blockchain with audited smart contracts. All transactions are transparent, verifiable, and immutable on-chain. Every deposit, withdrawal, and lock status change is recorded permanently on the blockchain for complete auditability.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: 'Token Management',
    description: 'Support for STX (Stacks native token) and a controlled list of SIP-010 fungible tokens. The token manager contract maintains a whitelist of approved tokens, ensuring security and compatibility. Manage your diverse crypto portfolio in one unified interface.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Global Registry',
    description: 'All Piggy Banks are tracked in a global, on-chain registry. View your savings history, check lock status, monitor your progress across all accounts, and discover public Piggy Banks created by others. Complete transparency and discoverability.',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-violet-900/40 via-purple-900/40 to-fuchsia-900/40 border-2 border-violet-500/20 backdrop-blur-sm hover:border-violet-400/50 hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-300 group">
        <div className="mb-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 border border-violet-400/30 group-hover:scale-110 transition-transform duration-300">
            <div className="text-violet-200 group-hover:text-violet-100 transition-colors">
              {feature.icon}
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4 text-violet-100 group-hover:text-white transition-colors">
          {feature.title}
        </h3>
        <p className="text-violet-200/70 leading-relaxed text-sm group-hover:text-violet-200/90 transition-colors">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="features" ref={ref} className="py-20 px-6 mt-32 md:mt-40 bg-gradient-to-b from-indigo-950/50 to-purple-950/50 w-full">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            Why Choose SyncsHC?
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-violet-100/80 max-w-2xl mx-auto">
            A secure, flexible, and transparent way to save on the Stacks blockchain
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
