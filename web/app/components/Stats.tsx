'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
  {
    value: '100%',
    label: 'On-Chain',
    description: 'All transactions are transparent and verifiable on the Stacks blockchain',
  },
  {
    value: '5%',
    label: 'Early Withdrawal Fee',
    description: 'Small penalty for accessing funds before lock expiration',
  },
  {
    value: 'Unlimited',
    label: 'Piggy Banks',
    description: 'Create as many savings accounts as you need for different goals',
  },
  {
    value: '24/7',
    label: 'Access',
    description: 'Manage your savings anytime, anywhere with blockchain technology',
  },
];

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="p-8 rounded-3xl bg-gradient-to-br from-violet-900/30 via-purple-900/30 to-fuchsia-900/30 border-2 border-violet-500/20 backdrop-blur-sm hover:border-violet-400/40 transition-all duration-300 shadow-xl shadow-violet-500/10">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent mb-3"
        >
          {stat.value}
        </motion.div>
        <h3 className="text-xl font-bold text-violet-100 mb-3">
          {stat.label}
        </h3>
        <p className="text-sm text-violet-200/70 max-w-xs mx-auto leading-relaxed">
          {stat.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-20 px-6 mt-32 md:mt-40 bg-gradient-to-b from-cyan-950/50 to-indigo-950/50 w-full">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            Platform Statistics
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 mx-auto mb-6 rounded-full" />
          <p className="text-violet-100/80 max-w-2xl mx-auto text-lg">
            Built for transparency, security, and user empowerment
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
