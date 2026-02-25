'use client';

import PageTransition from '../components/PageTransition';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function DocsPage() {
  return (
    <PageTransition>
      <main className="min-h-screen w-full overflow-x-hidden">
        <Navigation />
        <section className="pt-32 pb-20 px-6 bg-linear-to-b from-indigo-950/80 via-purple-950/80 to-cyan-950/80 w-full">
          <div className="max-w-5xl mx-auto">
            <header className="mb-12 text-center">
              <p className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium tracking-wider uppercase border border-violet-400/40 text-violet-100/90 rounded-full bg-white/5 backdrop-blur">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
                SyncsHC · Documentation
              </p>
              <h1 className="mt-6 text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
                How SyncsHC works under the hood
              </h1>
              <p className="mt-4 text-base md:text-lg text-violet-100/80 max-w-2xl mx-auto">
                Learn about the core smart contracts, time-lock mechanics, token support, and how to interact with
                SyncsHC safely on the Stacks blockchain.
              </p>
            </header>

            <div className="space-y-10 text-sm md:text-base text-violet-100/80">
              <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-violet-900/40 border border-violet-500/30 backdrop-blur-sm">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-violet-100">
                  Core contracts
                </h2>
                <p className="mb-3">
                  SyncsHC is composed of several Clarity smart contracts deployed on Stacks: a Piggy Bank factory,
                  individual Piggy Bank instances, a global registry, and a token manager. The factory creates new
                  Piggy Banks, the registry tracks them, and the token manager controls which SIP-010 tokens are
                  allowed.
                </p>
                <p>
                  Each Piggy Bank is its own contract instance, which means your savings are isolated per goal and
                  fully transparent on-chain.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-violet-900/40 border border-violet-500/30 backdrop-blur-sm">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-violet-100">
                  Time-locks & early withdrawals
                </h2>
                <p className="mb-3">
                  When you create a Piggy Bank, you specify a lock duration in blocks. While the lock is active, funds
                  can still be withdrawn, but the contract will automatically apply a 5% early withdrawal penalty to
                  the amount you take out.
                </p>
                <p>
                  After the lock duration has passed, all withdrawals become penalty-free. The full history of deposits,
                  withdrawals, and lock changes is stored on the Stacks chain for anyone to verify.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-violet-900/40 border border-violet-500/30 backdrop-blur-sm">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-violet-100">
                  Supported tokens
                </h2>
                <p className="mb-3">
                  SyncsHC supports STX and a curated list of SIP-010 fungible tokens. Only tokens that are whitelisted
                  by the token manager can be deposited into Piggy Banks, reducing the risk of interacting with
                  incompatible or malicious assets.
                </p>
                <p>
                  You can inspect the token manager contract on-chain to see the current list of approved tokens before
                  depositing.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-violet-900/40 border border-violet-500/30 backdrop-blur-sm">
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-violet-100">
                  Using SyncsHC safely
                </h2>
                <p className="mb-3">
                  Always double-check contract addresses, only connect trusted wallets, and verify transactions before
                  signing. Remember that all actions are final once confirmed on-chain—there is no central authority to
                  reverse mistakes.
                </p>
                <p>
                  For advanced users, we recommend reading the Clarity contract source and on-chain audit reports before
                  depositing significant amounts.
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

