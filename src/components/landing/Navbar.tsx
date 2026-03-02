import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card-strong"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-accent" />
          <span className="font-sans font-semibold text-lg tracking-tight text-foreground">
            Access Passport
          </span>
          <span className="text-muted-foreground text-xs font-medium tracking-wide ml-1 hidden sm:inline">
            by SkyllSyft
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#for-whom" className="hover:text-foreground transition-colors">Who It's For</a>
          <a href="#value" className="hover:text-foreground transition-colors">Benefits</a>
        </div>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5">
          Get Started
        </Button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
