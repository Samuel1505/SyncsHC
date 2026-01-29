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
      <div className="mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
          className="text-5xl md:text-6xl font-bold text-white mb-2"
        >
          {stat.value}
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {stat.label}
        </h3>
        <p className="text-sm text-white/60 max-w-xs mx-auto">
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
    <section ref={ref} className="py-24 px-6 bg-black w-full flex justify-center mb-16">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Platform Statistics
          </h2>
          <div className="w-24 h-0.5 bg-white mx-auto mb-4" />
          <p className="text-white/60 max-w-2xl mx-auto">
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
