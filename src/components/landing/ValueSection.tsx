import { motion } from "framer-motion";
import { Lock, Zap, ShieldCheck, FileX, Heart, BarChart3 } from "lucide-react";

const values = {
  individuals: [
    { icon: Lock, title: "Medical privacy protected", description: "Your diagnosis stays with your doctor, not your employer." },
    { icon: FileX, title: "No repeated paperwork", description: "Submit documentation once. Reuse your credential everywhere, indefinitely." },
    { icon: Zap, title: "Instant access to services", description: "Share your credential in seconds and receive accommodations immediately." },
    { icon: Heart, title: "Dignity preserved", description: "No more justifying your condition to strangers at every counter." },
  ],
  institutions: [
    { icon: ShieldCheck, title: "Standardized verification", description: "One consistent format across all credential holders." },
    { icon: Zap, title: "Faster processing times", description: "Eliminate weeks of back-and-forth with medical offices." },
    { icon: Lock, title: "Reduced compliance risk", description: "No sensitive medical data to store, protect, or potentially leak." },
    { icon: BarChart3, title: "Lower administrative cost", description: "Automate eligibility checks that currently require manual review." },
  ],
};

const ValueSection = () => {
  return (
    <section id="value" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-champagne/20 to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20 max-w-2xl mx-auto"
        >
          <span className="section-label">The Value</span>
          <h2 className="section-heading mb-5">
            Everyone wins when access is{" "}
            <span className="text-gradient">simple</span>
          </h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            Access Passport creates measurable value on both sides of the accommodation relationship.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(["individuals", "institutions"] as const).map((group, gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: gi * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card-strong rounded-[1.5rem] p-8 md:p-10 relative overflow-hidden"
            >
              {/* Shimmer accent */}
              <div className="absolute top-0 left-0 right-0 h-[1px] animate-shimmer" />

              <h3 className="font-serif text-2xl text-foreground mb-2">
                For {group === "individuals" ? "Individuals" : "Institutions"}
              </h3>
              <p className="text-sm text-muted-foreground mb-8">
                {group === "individuals"
                  ? "Reclaim your privacy and your time."
                  : "Modernize your verification process."}
              </p>

              <div className="space-y-6">
                {values[group].map((v, vi) => (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + vi * 0.08 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent/8 flex items-center justify-center shrink-0">
                      <v.icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-foreground text-[15px] mb-1">{v.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
