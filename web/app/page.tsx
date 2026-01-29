'use client';

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import Benefits from './components/Benefits';
import HowItWorks from './components/HowItWorks';
import UseCases from './components/UseCases';
import Security from './components/Security';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-black w-full overflow-x-hidden">
        <Navigation />
        <Hero />
        <Stats />
        <Features />
        <Benefits />
        <HowItWorks />
        <UseCases />
        <Security />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </PageTransition>
  );
}
