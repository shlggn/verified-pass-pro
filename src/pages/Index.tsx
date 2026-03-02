import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ForWhom from "@/components/landing/ForWhom";
import ValueSection from "@/components/landing/ValueSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <ForWhom />
      <ValueSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
