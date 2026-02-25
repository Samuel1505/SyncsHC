'use client';

import PageTransition from '../components/PageTransition';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function TermsPage() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full overflow-x-hidden">
        <Navigation />
        <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-purple-950/80 via-indigo-950/80 to-cyan-950/80 w-full">
          <div className="max-w-4xl mx-auto">
            <header className="mb-10 text-center">
              <p className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border border-violet-400/40 text-violet-100/90 rounded-full bg-white/5 backdrop-blur">
                Legal
              </p>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
                Terms of Use
              </h1>
              <p className="mt-4 text-base md:text-lg text-violet-100/80 max-w-2xl mx-auto">
                Please read these terms carefully before using SyncsHC. By interacting with the protocol, you agree to
                the conditions below.
              </p>
            </header>

            <div className="space-y-8 text-sm md:text-base text-violet-100/80">
              <section>
                <h2 className="text-xl font-semibold mb-2 text-violet-100">1. No custody and no guarantees</h2>
                <p>
                  SyncsHC is a non-custodial protocol deployed as smart contracts on the Stacks blockchain. There is no
                  company or individual holding your funds. All behavior is defined by code, and there are no guarantees
                  of future performance, uptime, or profitability.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-violet-100">2. User responsibility</h2>
                <p>
                  You are fully responsible for securing your wallet, private keys, and devices. Any transactions you
                  sign are irreversible once confirmed on-chain. You should only interact with contracts you have
                  independently verified.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-violet-100">3. Risks</h2>
                <p className="mb-2">
                  Using SyncsHC involves significant risks, including but not limited to smart contract bugs, protocol
                  changes, network congestion, and market volatility of supported tokens.
                </p>
                <p>
                  You should not deposit more value than you can afford to lose, and you should seek independent legal,
                  financial, and technical advice if needed.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-violet-100">4. No financial advice</h2>
                <p>
                  Nothing in the SyncsHC interface, documentation, or related materials constitutes financial, legal, or
                  investment advice. You are solely responsible for your decisions and outcomes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-violet-100">5. Changes to these terms</h2>
                <p>
                  These terms may be updated over time. Your continued use of the interface and protocol after any
                  changes constitutes acceptance of the revised terms.
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

