import { motion } from "framer-motion";
import { ArrowRight, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-credential.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center section-padding pt-36 pb-20 overflow-hidden">
      {/* Ambient light effects */}
      <div className="absolute top-20 right-1/4 w-[600px] h-[600px] rounded-full warm-glow pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-full luxury-divider opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Text — 7 cols */}
        <div className="lg:col-span-7 max-w-2xl">
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2.5 glass-card rounded-full px-5 py-2 mb-10"
          >
            <Shield className="w-3.5 h-3.5 text-accent" />
            <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground">
              Digital Credential System
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] font-serif leading-[1.05] tracking-tight text-foreground mb-7"
          >
            Your eligibility.{" "}
            <br className="hidden sm:block" />
            <span className="text-gradient">Your privacy.</span>
            <br className="hidden sm:block" />
            Your control.
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg md:text-xl text-muted-foreground leading-[1.7] mb-10 max-w-lg font-light"
          >
            Access Passport replaces repetitive medical paperwork with a single, 
            privacy-preserving digital credential — so you never have to prove 
            your disability the hard way again.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-charcoal rounded-full px-9 gap-2.5 text-[15px] font-medium shadow-lg shadow-primary/10 h-13">
              Get Early Access <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="ghost" className="rounded-full px-8 text-[15px] text-muted-foreground hover:text-foreground h-13">
              See how it works
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex items-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Privacy-first</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Consent-driven</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Instant verification</span>
            </div>
          </motion.div>
        </div>

        {/* Image — 5 cols */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] gold-glow pointer-events-none" />
            <img
              src={heroImage}
              alt="Hand holding phone showing verified credential"
              className="w-full max-w-md rounded-[2rem] shadow-2xl shadow-primary/8 relative z-10"
            />

            {/* Floating credential card */}
            <motion.div
              initial={{ opacity: 0, y: 24, x: -12 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.9, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-8 -left-8 glass-card-strong rounded-2xl p-5 max-w-[270px] z-20"
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center">
                  <CheckCircle2 className="w-4.5 h-4.5 text-accent" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-foreground block leading-tight">Verified Credential</span>
                  <span className="text-[10px] text-muted-foreground">Issued by NHS England</span>
                </div>
              </div>
              <div className="luxury-divider my-3" />
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                "Eligible for disability accommodation until December 2027"
              </p>
            </motion.div>

            {/* Stats pill */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="absolute -top-4 -right-4 glass-card rounded-full px-4 py-2 flex items-center gap-2 z-20"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-subtle-pulse" />
              <span className="text-[11px] font-medium text-foreground">256-bit encrypted</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
