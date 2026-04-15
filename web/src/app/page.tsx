import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import ProtocolStats from "@/components/home/ProtocolStats";
import FAQSection from "@/components/home/FAQSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <ProtocolStats />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
