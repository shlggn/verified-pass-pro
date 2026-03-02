import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center glass-card-strong rounded-3xl p-12 md:p-16 relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-accent/8 blur-3xl pointer-events-none" />
        <h2 className="text-3xl sm:text-4xl font-serif text-foreground mb-4">
          Ready to simplify access?
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Join the movement toward privacy-preserving, dignified verification for disability accommodations.
        </p>
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 gap-2 text-base">
          Get Early Access <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </section>
  );
};

export default CtaSection;
