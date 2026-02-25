'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const securityFeatures = [
  {
    title: 'Smart Contract Audits',
    description: 'All contracts undergo rigorous security audits before deployment. The code is open-source and verifiable by anyone.',
    detail: 'Public audit reports available',
  },
  {
    title: 'Immutable Transactions',
    description: 'Once a transaction is confirmed on the Stacks blockchain, it cannot be altered or reversed. Your savings are permanently recorded.',
    detail: 'Blockchain-level security',
  },
  {
    title: 'No Central Authority',
    description: 'There is no central server, no database, no single point of failure. The protocol runs entirely on the decentralized Stacks network.',
    detail: '100% decentralized',
  },
  {
    title: 'Transparent Code',
    description: 'All smart contract code is publicly available. You can review exactly how your funds are handled before depositing.',
    detail: 'Open-source verification',
  },
];

export default function Security() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-20 px-6 mt-24 bg-gradient-to-b from-purple-950/50 via-indigo-950/50 to-cyan-950/50 w-full">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
            Security & Trust
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 mx-auto mb-6 rounded-full" />
          <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto">
            Your funds are protected by blockchain technology, not promises
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900/40 via-teal-900/40 to-cyan-900/40 border-2 border-emerald-500/20 backdrop-blur-sm hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 group"
            >
              <h3 className="text-xl font-bold mb-4 text-emerald-100 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-emerald-200/70 mb-6 leading-relaxed text-sm group-hover:text-emerald-200/90 transition-colors">
                {feature.description}
              </p>
              <p className="text-xs font-bold text-emerald-300/80 uppercase tracking-wider">
                {feature.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-2 border-emerald-500/30 backdrop-blur-sm shadow-xl shadow-emerald-500/10">
            <p className="text-emerald-100 text-lg mb-2 font-semibold">
              <strong className="text-emerald-200">Remember:</strong> You control your private keys
            </p>
            <p className="text-emerald-200/70 text-sm">
              Only you can authorize transactions. No one can access your funds without your private key.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
