'use client';

import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-white dark:bg-black">
        <Navigation />
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
        <Footer />
      </main>
    </PageTransition>
  );
}
