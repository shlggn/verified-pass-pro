import { motion } from "framer-motion";
import { UserCheck, FileCheck, Share2, CheckCircle, ArrowRight } from "lucide-react";
import verificationImage from "@/assets/verification-moment.png";

const steps = [
  {
    icon: UserCheck,
    title: "Sign Up",
    subtitle: "Create Account",
    description: "Register as an individual or verifying organization in seconds — choose your role.",
  },
  {
    icon: FileCheck,
    title: "Submit Credentials",
    subtitle: "Upload Documents",
    description: "Upload your disability certificate or supporting documents for secure, private review.",
  },
  {
    icon: Share2,
    title: "Get Verified",
    subtitle: "Admin Review",
    description: "Our team reviews and approves your credentials — no diagnosis details are stored.",
  },
  {
    icon: CheckCircle,
    title: "Share via QR",
    subtitle: "Privacy-First Sharing",
    description: "Generate a QR code to share your verified status instantly — you control what's shared.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-champagne/40 via-background to-champagne/40 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 max-w-2xl mx-auto"
        >
          <span className="section-label">How It Works</span>
          <h2 className="section-heading mb-5">
            Four steps to dignified access
          </h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            A streamlined process that puts you in control of your credentials — from verification to acceptance.
          </p>
        </motion.div>

        {/* Steps timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 mb-20 relative">
          {/* Connecting line */}
          <div className="absolute top-[2.75rem] left-[10%] right-[10%] hidden md:block">
            <div className="luxury-divider" />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center px-4 md:px-6"
            >
              {/* Step number */}
              <div className="w-14 h-14 mx-auto rounded-2xl bg-card glass-card flex items-center justify-center mb-6 relative z-10">
                <step.icon className="w-5 h-5 text-accent" />
              </div>

              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-accent block mb-2">
                {step.subtitle}
              </span>
              <h3 className="text-xl font-serif text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px] mx-auto">{step.description}</p>

              {i < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gold-muted absolute top-[2.5rem] -right-2 hidden md:block" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Full-width image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden max-w-5xl mx-auto group"
        >
          <img
            src={verificationImage}
            alt="Secure credential verification between two professionals"
            className="w-full object-cover aspect-[21/9] group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
            <div>
              <p className="text-primary-foreground text-2xl font-serif mb-1">Verification in seconds.</p>
              <p className="text-primary-foreground/70 text-sm font-light">No medical records exchanged. Ever.</p>
            </div>
            <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-foreground">Credential Valid</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
