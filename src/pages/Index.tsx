import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCases from "@/components/landing/UseCases";
import ForWhom from "@/components/landing/ForWhom";
import ValueSection from "@/components/landing/ValueSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <HowItWorks />
      <UseCases />
      <ForWhom />
      <ValueSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
