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
    <section ref={ref} className="py-24 px-6 bg-black w-full flex justify-center my-20">
      <div className="max-w-6xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Security & Trust
          </h2>
          <div className="w-24 h-0.5 bg-white mx-auto mb-6" />
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Your funds are protected by blockchain technology, not promises
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-black"
            >
              <h3 className="text-xl font-semibold mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-white/60 mb-4 leading-relaxed text-sm">
                {feature.description}
              </p>
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
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
          <div className="inline-block p-8 bg-black">
            <p className="text-white text-lg mb-2">
              <strong>Remember:</strong> You control your private keys
            </p>
            <p className="text-white/60 text-sm">
              Only you can authorize transactions. No one can access your funds without your private key.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
