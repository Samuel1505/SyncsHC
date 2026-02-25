'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const useCases = [
  {
    title: 'Emergency Fund',
    description: 'Build a dedicated emergency fund that\'s accessible but protected. Set a 6-month lock to ensure you only tap into it for true emergencies, with the option to withdraw early if absolutely necessary.',
    duration: '6 months',
    example: 'Save 3-6 months of expenses',
  },
  {
    title: 'Goal-Based Savings',
    description: 'Create separate Piggy Banks for different financial goals—vacation, down payment, or major purchase. Each account has its own lock duration tailored to your timeline.',
    duration: 'Custom',
    example: 'Multiple goals, multiple accounts',
  },
  {
    title: 'Long-Term Wealth',
    description: 'Lock funds for extended periods to build wealth without the temptation to spend. Perfect for retirement planning or building generational wealth on the blockchain.',
    duration: '1+ years',
    example: 'Retirement or legacy planning',
  },
  {
    title: 'Token Diversification',
    description: 'Save in different SIP-010 tokens while maintaining the same time-lock protection. Diversify your crypto savings strategy across multiple assets.',
    duration: 'Flexible',
    example: 'Multi-token savings portfolio',
  },
];

function UseCaseCard({ useCase, index }: { useCase: typeof useCases[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group"
    >
      <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-violet-900/40 border-2 border-indigo-500/20 backdrop-blur-sm hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 group">
        <div className="mb-4">
          <span className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-400/30 text-indigo-200">
            {useCase.duration}
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-indigo-100 group-hover:text-white transition-colors">
          {useCase.title}
        </h3>
        <p className="text-indigo-200/70 leading-relaxed mb-5 text-sm group-hover:text-indigo-200/90 transition-colors">
          {useCase.description}
        </p>
        <div className="pt-4 border-t border-indigo-500/20">
          <p className="text-sm font-semibold text-indigo-300/80">
            Example: {useCase.example}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function UseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-20 px-6 mt-32 md:mt-40 bg-gradient-to-b from-cyan-950/50 to-indigo-950/50 w-full">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-300 via-purple-300 to-violet-300 bg-clip-text text-transparent">
            Real-World Use Cases
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-indigo-100/80 max-w-2xl mx-auto">
            See how SyncsHC helps you achieve your financial goals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} useCase={useCase} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
