"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is SyncsHC?",
    a: "SyncsHC is a non-custodial decentralized savings protocol built on the Stacks blockchain. It allows users to lock STX or SIP-010 tokens into smart contract-powered Piggy Banks for a chosen duration, building financial discipline and self-imposed savings commitments.",
  },
  {
    q: "What tokens are supported?",
    a: "SyncsHC currently supports STX (Stacks), sBTC (Stacks BTC), ALEX (ALEX Lab), and USDA (USDA Stablecoin). More SIP-010 tokens will be added through governance proposals as the protocol grows.",
  },
  {
    q: "What happens if I withdraw early?",
    a: "If you withdraw before your lock period ends, a 5% penalty fee is deducted from your principal. The remaining 95% is returned to your wallet immediately. The penalty is transparent and shown before you confirm. This fee goes to the protocol treasury.",
  },
  {
    q: "Is my money safe? Has the contract been audited?",
    a: "SyncsHC is built with Clarity smart contracts, which are deterministic and readable — what you see on-chain is what you get. The contracts have been audited by a reputable third-party security firm, and all audit reports are publicly available in our documentation.",
  },
  {
    q: "What wallets are supported?",
    a: "SyncsHC supports Hiro Wallet (Web & Desktop) and Xverse — the two most popular Stacks-compatible wallets. Any Stacks wallet that supports the WalletConnect standard can also connect to the app.",
  },
  {
    q: "How are penalty fees calculated and who receives them?",
    a: "Penalty fees are a flat 5% of the locked amount, calculated at the time of early withdrawal. These fees are collected by the protocol and distributed to a treasury controlled by governance token holders, not by any central team.",
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="border border-white/[0.07] rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-white">{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0"
        >
          <ChevronDown size={16} className="text-muted" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 py-4 text-sm text-muted leading-relaxed border-t border-white/[0.06]">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="py-24 lg:py-32 bg-navy-800" ref={ref}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-accent uppercase tracking-[0.15em] mb-3 block">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
            Common questions answered
          </h2>
          <p className="text-muted">
            Everything you need to know about SyncsHC and how it works.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
