import { motion } from "framer-motion";
import { UserCheck, FileCheck, Share2, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserCheck,
    title: "Verification",
    description: "A trusted authority verifies that an individual qualifies for disability-related accommodations.",
  },
  {
    icon: FileCheck,
    title: "Credential Issued",
    description: "A digital credential confirming eligibility is issued — no diagnoses revealed.",
  },
  {
    icon: Share2,
    title: "User-Controlled Sharing",
    description: "The individual chooses when and where to share their credential.",
  },
  {
    icon: CheckCircle,
    title: "Instant Verification",
    description: "Institutions verify the credential without accessing underlying medical documentation.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-accent mb-4 block">
            Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground">
            How it works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass-card rounded-2xl p-7 relative group hover:shadow-xl transition-shadow duration-300"
            >
              <span className="absolute top-5 right-6 text-6xl font-serif text-muted/60 font-bold select-none">
                {i + 1}
              </span>
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                <step.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-lg font-sans font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
