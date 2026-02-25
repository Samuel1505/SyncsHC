'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Create Your Piggy Bank',
    description: 'Use the factory contract to create your own Piggy Bank with a single transaction. Choose your lock duration in blocks (each block is ~10 minutes on Stacks) and set your savings goal. The contract is deployed and registered automatically in the global registry. You can create unlimited Piggy Banks for different goals.',
  },
  {
    number: '02',
    title: 'Deposit Your Tokens',
    description: 'Deposit STX or any supported SIP-010 token into your Piggy Bank through a simple transaction. Your funds are immediately locked for the duration you specified. You can add more funds at any time before the lock expires—each deposit extends your savings without resetting the lock timer.',
  },
  {
    number: '03',
    title: 'Withdraw When Ready',
    description: 'Wait for the lock period to expire for completely penalty-free withdrawals, or withdraw early with a transparent 5% penalty fee if you need funds urgently. The penalty is calculated automatically by the smart contract. All transactions are processed on-chain with immediate settlement and full transparency.',
  },
];

function Step({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="shrink-0">
          <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
              className="w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/40 to-pink-500/40 border-2 border-fuchsia-400/40 shadow-lg shadow-fuchsia-500/20"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-fuchsia-200 to-pink-200 bg-clip-text text-transparent">{step.number}</span>
            </motion.div>
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-20 left-1/2 w-1 h-32 bg-gradient-to-b from-fuchsia-500/40 to-pink-500/40 transform -translate-x-1/2 rounded-full" />
            )}
          </div>
        </div>
        <div className="flex-1 pt-2 p-6 rounded-2xl bg-gradient-to-br from-fuchsia-900/30 to-pink-900/30 border border-fuchsia-500/20 backdrop-blur-sm">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-fuchsia-200 to-pink-200 bg-clip-text text-transparent">
            {step.title}
          </h3>
          <p className="text-fuchsia-100/80 leading-relaxed text-sm">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="how-it-works" ref={ref} className="py-20 px-6 bg-gradient-to-b from-indigo-950/50 via-purple-950/50 to-fuchsia-950/50 w-full">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-fuchsia-300 via-pink-300 to-rose-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-fuchsia-100/80">
            Get started in three simple steps
          </p>
        </motion.div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <Step key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
