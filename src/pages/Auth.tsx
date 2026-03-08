import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Eye, EyeOff, Building2, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const roleOptions: { value: AppRole; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "individual", label: "Individual", description: "Apply for & manage your Access Passport credentials", icon: <User className="w-5 h-5" /> },
  { value: "verifier", label: "Organization / Verifier", description: "Verify credentials presented by individuals", icon: <Building2 className="w-5 h-5" /> },
];

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>("individual");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName, selectedRole, selectedRole === "verifier" ? orgName : undefined);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Please check your email to verify.");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message);
        } else {
          navigate("/dashboard");
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-charcoal to-primary opacity-90" />
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-accent/5 blur-[80px]" />
        
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="font-serif text-xl text-primary-foreground">Access Passport</div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-primary-foreground/50">SkyllSyft</div>
            </div>
          </div>

          <h1 className="text-4xl font-serif text-primary-foreground leading-[1.15] mb-6">
            Your credentials.{" "}
            <span className="text-accent">Your privacy.</span>{" "}
            Your control.
          </h1>
          <p className="text-primary-foreground/50 text-lg leading-relaxed">
            A dignified, private way to verify disability credentials without revealing sensitive medical information.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg text-foreground">Access Passport</span>
          </div>

          <h2 className="text-2xl font-serif text-foreground mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            {isSignUp ? "Join the movement toward dignified access verification." : "Sign in to manage your credentials."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div
                  key="signup-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  <div>
                    <Label className="text-foreground text-xs font-medium uppercase tracking-wider mb-2 block">Full Name</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      required
                      className="h-12 bg-muted/50 border-border"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground text-xs font-medium uppercase tracking-wider mb-3 block">I am a...</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {roleOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSelectedRole(opt.value)}
                          className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                            selectedRole === opt.value
                              ? "border-accent bg-accent/5 shadow-sm"
                              : "border-border bg-card hover:border-muted-foreground/30"
                          }`}
                        >
                          <div className={`mb-2 ${selectedRole === opt.value ? "text-accent" : "text-muted-foreground"}`}>
                            {opt.icon}
                          </div>
                          <div className="font-medium text-sm text-foreground">{opt.label}</div>
                          <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{opt.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedRole === "verifier" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label className="text-foreground text-xs font-medium uppercase tracking-wider mb-2 block">Organization Name</Label>
                      <Input
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="Your organization"
                        required
                        className="h-12 bg-muted/50 border-border"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <Label className="text-foreground text-xs font-medium uppercase tracking-wider mb-2 block">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 bg-muted/50 border-border"
              />
            </div>

            <div>
              <Label className="text-foreground text-xs font-medium uppercase tracking-wider mb-2 block">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-12 bg-muted/50 border-border pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-medium gap-2"
            >
              {submitting ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <span className="text-accent font-medium">{isSignUp ? "Sign in" : "Sign up"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
