'use client';

import PageTransition from '../components/PageTransition';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full overflow-x-hidden">
        <Navigation />
        <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-indigo-950/80 via-purple-950/80 to-cyan-950/80 w-full">
          <div className="max-w-4xl mx-auto">
            <header className="mb-10 text-center">
              <p className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border border-violet-400/40 text-violet-100/90 rounded-full bg-white/5 backdrop-blur">
                Legal
              </p>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="mt-4 text-base md:text-lg text-violet-100/80 max-w-2xl mx-auto">
                This page explains what data is (and is not) collected when you use SyncsHC.
              </p>
            </header>

            <div className="space-y-8 text-sm md:text-base text-violet-100/80">
              <section>
                <h2 className="text-xl font-semibold mb-2 text-violet-100">1. On-chain data</h2>
                <p>
                  All deposits, withdrawals, and contract interactions are recorded publicly on the Stacks blockchain.
                  This data is immutable and visible to anyone running a node or using a block explorer. SyncsHC does
                  not control or hide this information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-violet-100">2. Off-chain data</h2>
                <p>
                  The SyncsHC interface is designed to avoid collecting personally identifiable information by default.
                  However, basic technical data such as IP addresses or browser details may be processed by hosting
                  providers or infrastructure services used to deliver the frontend.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-violet-100">3. Wallets & permissions</h2>
                <p>
                  When you connect a wallet, the interface may read your public addresses and token balances through the
                  wallet provider. Private keys are never transmitted to or stored by SyncsHC—they remain entirely under
                  your control inside your wallet.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-violet-100">4. Third-party services</h2>
                <p>
                  Analytics, logging, or monitoring tools may be used to improve reliability and user experience. These
                  services typically work with aggregated or pseudonymous data, but their behavior is governed by their
                  own privacy policies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-violet-100">5. Updates</h2>
                <p>
                  This policy may change over time as the protocol and interface evolve. You should review this page
                  periodically to stay informed about how your data is handled.
                </p>
              </section>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </PageTransition>
  );
}

