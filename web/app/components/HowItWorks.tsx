'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Create Your Piggy Bank',
    description: 'Use the factory contract to create your own Piggy Bank. Choose your lock duration in blocks and set your savings goal. The contract is deployed and registered automatically.',
  },
  {
    number: '02',
    title: 'Deposit Your Tokens',
    description: 'Deposit STX or any supported SIP-010 token into your Piggy Bank. Your funds are locked for the duration you specified. You can add more funds at any time before the lock expires.',
  },
  {
    number: '03',
    title: 'Withdraw When Ready',
    description: 'Wait for the lock period to expire for penalty-free withdrawals, or withdraw early with a 5% penalty fee if you need funds urgently. All transactions are processed on-chain.',
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
              className="w-20 h-20 border-2 border-black dark:border-white flex items-center justify-center bg-white dark:bg-black"
            >
              <span className="text-2xl font-bold text-black dark:text-white">{step.number}</span>
            </motion.div>
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-20 left-1/2 w-0.5 h-32 bg-black dark:bg-white transform -translate-x-1/2" />
            )}
          </div>
        </div>
        <div className="flex-1 pt-2">
          <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
            {step.title}
          </h3>
          <p className="text-black/60 dark:text-white/60 leading-relaxed">
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
    <section id="how-it-works" ref={ref} className="py-24 px-6 bg-black dark:bg-white">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white dark:text-black">
            How It Works
          </h2>
          <div className="w-24 h-0.5 bg-white dark:bg-black mx-auto mb-6" />
          <p className="text-lg text-white/60 dark:text-black/60">
            Get started in three simple steps
          </p>
        </motion.div>

        <div className="space-y-16">
          {steps.map((step, index) => (
            <Step key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
