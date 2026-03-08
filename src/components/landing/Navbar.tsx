import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "#problem", label: "The Problem" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#use-cases", label: "Use Cases" },
  { href: "#value", label: "Benefits" },
];

const Navbar = () => {
  const { user } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 glass-card-strong"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 lg:px-16 py-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-medium text-base tracking-tight text-foreground leading-none">
              Access Passport
            </span>
            <span className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase leading-none mt-0.5">
              SkyllSyft
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10 text-[13px] font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-foreground transition-colors duration-300 relative after:absolute after:bottom-[-2px] after:left-0 after:h-[1px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 text-[13px] font-medium shadow-md">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Link to="/auth" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 text-[13px] font-medium shadow-md">
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
