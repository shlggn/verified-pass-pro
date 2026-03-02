import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-abstract.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center section-padding pt-32 overflow-hidden">
      {/* Subtle warm glow background */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full warm-glow opacity-40 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 mb-8 text-xs font-medium text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Privacy-first digital credentials
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.1] tracking-tight text-foreground mb-6">
            Prove eligibility.{" "}
            <span className="text-gradient">Protect privacy.</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md">
            A verified digital credential that confirms disability accommodation eligibility — without exposing sensitive medical records.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 gap-2 text-base">
              Request Access <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-border text-foreground hover:bg-muted">
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative flex justify-center"
        >
          <div className="relative">
            <img
              src={heroImage}
              alt="Abstract glass shapes representing privacy and transparency"
              className="w-full max-w-lg rounded-3xl animate-float"
            />
            {/* Floating credential card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="absolute -bottom-6 -left-6 glass-card-strong rounded-2xl p-5 max-w-[260px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-sm font-bold">✓</span>
                </div>
                <span className="text-xs font-semibold text-foreground">Verified Credential</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Eligible for disability accommodation until Dec 2027
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
