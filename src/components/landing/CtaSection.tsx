import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto relative"
      >
        {/* Background card */}
        <div className="relative rounded-[2rem] overflow-hidden bg-primary p-12 md:p-20 text-center">
          {/* Subtle texture overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-charcoal to-primary opacity-80" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="w-14 h-14 rounded-2xl bg-primary-foreground/10 border border-primary-foreground/10 flex items-center justify-center mx-auto mb-8"
            >
              <Shield className="w-6 h-6 text-accent" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-primary-foreground leading-[1.1] mb-5">
              Ready to modernize{" "}
              <br className="hidden sm:block" />
              disability access?
            </h2>
            <p className="text-primary-foreground/60 text-lg font-light max-w-lg mx-auto mb-10 leading-relaxed">
              Join the movement toward a world where proving eligibility 
              doesn't mean sacrificing privacy or dignity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-10 gap-2.5 text-[15px] font-medium shadow-lg shadow-accent/20 h-13"
              >
                <Link to="/auth">
                  Get Early Access <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full px-8 text-[15px] text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5 h-13"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
