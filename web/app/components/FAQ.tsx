'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

const faqs = [
  {
    question: 'How does the time-lock mechanism work?',
    answer: 'When you create a Piggy Bank, you set a lock duration in blocks (Stacks blocks are approximately 10 minutes each). Your funds are locked for this duration. Once the lock expires, you can withdraw penalty-free. If you need funds earlier, you can withdraw with a 5% penalty fee.',
  },
  {
    question: 'What tokens are supported?',
    answer: 'SyncsHC supports STX (Stacks native token) and a controlled list of SIP-010 fungible tokens. The token manager contract maintains the list of approved tokens. You can check which tokens are supported before creating your Piggy Bank.',
  },
  {
    question: 'Can I add more funds to an existing Piggy Bank?',
    answer: 'Yes, you can deposit additional funds into your Piggy Bank at any time before the lock expires. The lock duration applies to all funds in the account. Early withdrawals will apply the 5% penalty to the amount withdrawn, not the entire balance.',
  },
  {
    question: 'What happens if I forget about my Piggy Bank?',
    answer: 'Your funds remain safe in the smart contract. There\'s no expiration or forfeiture. You can withdraw your funds at any time—either penalty-free after the lock expires, or with the 5% penalty if you withdraw early. The contract is immutable and will always honor your deposits.',
  },
  {
    question: 'How secure is my money?',
    answer: 'SyncsHC is built on the Stacks blockchain using audited smart contracts. Your funds are secured by cryptographic guarantees. All transactions are transparent, verifiable, and immutable. There are no intermediaries, no account freezes, and no way for anyone to access your funds except through the contract.',
  },
  {
    question: 'Can I create multiple Piggy Banks?',
    answer: 'Absolutely! The factory pattern allows you to create unlimited Piggy Banks. Each one can have different lock durations, hold different tokens, and serve different savings goals. All your Piggy Banks are tracked in the global registry for easy management.',
  },
  {
    question: 'What is the early withdrawal penalty?',
    answer: 'The early withdrawal penalty is 5% of the amount you withdraw. This penalty is calculated and deducted automatically by the smart contract. For example, if you withdraw 100 STX early, you\'ll receive 95 STX. After the lock expires, all withdrawals are penalty-free.',
  },
  {
    question: 'How do I know when my lock expires?',
    answer: 'You can check the lock status at any time by calling the contract\'s read-only functions. The contract tracks the lock start block and duration, allowing you to calculate exactly when your lock will expire. The frontend will display this information clearly.',
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="rounded-2xl bg-gradient-to-br from-violet-900/40 to-purple-900/40 border-2 border-violet-500/20 backdrop-blur-sm hover:border-violet-400/40 transition-all duration-300 overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-violet-900/30 transition-colors group"
      >
        <h3 className="text-lg font-bold text-violet-100 pr-8 group-hover:text-white transition-colors">
          {faq.question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-purple-500/30 border border-violet-400/30"
        >
          <span className="text-violet-200 text-xl font-bold">
            +
          </span>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 border-t border-violet-500/20">
              <p className="text-violet-200/80 leading-relaxed text-sm">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-20 px-6 mt-24 bg-gradient-to-b from-indigo-950/50 to-purple-950/50 w-full">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-violet-100/80 max-w-2xl mx-auto">
            Everything you need to know about SyncsHC
          </p>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
