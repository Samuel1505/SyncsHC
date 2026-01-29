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
      <div className="h-full p-8 bg-black hover:bg-black/90 transition-all duration-300">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-medium text-white/80">
            {useCase.duration}
          </span>
        </div>
        <h3 className="text-2xl font-semibold mb-3 text-white">
          {useCase.title}
        </h3>
        <p className="text-white/60 leading-relaxed mb-4">
          {useCase.description}
        </p>
        <div className="pt-4 border-t border-white/10">
          <p className="text-sm font-medium text-white/40">
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
    <section ref={ref} className="py-24 px-6 bg-black w-full my-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Real-World Use Cases
          </h2>
          <div className="w-24 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            See how SyncsHC helps you achieve your financial goals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} useCase={useCase} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
