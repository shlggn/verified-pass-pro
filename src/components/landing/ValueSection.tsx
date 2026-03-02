import { motion } from "framer-motion";
import { Lock, Zap, ShieldCheck, FileX } from "lucide-react";

const values = {
  individuals: [
    { icon: Lock, title: "Medical privacy protected", description: "Your diagnosis stays yours." },
    { icon: FileX, title: "No repeated paperwork", description: "Submit once, reuse everywhere." },
    { icon: Zap, title: "Instant access", description: "Share credentials in seconds." },
  ],
  institutions: [
    { icon: ShieldCheck, title: "Standardized verification", description: "Consistent eligibility confirmation." },
    { icon: Zap, title: "Faster processing", description: "Reduce administrative workload." },
    { icon: Lock, title: "Reduced liability", description: "No sensitive data to store." },
  ],
};

const ValueSection = () => {
  return (
    <section id="value" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-accent mb-4 block">
            Benefits
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground">
            Value for everyone
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(["individuals", "institutions"] as const).map((group, gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: gi * 0.15 }}
              className="glass-card-strong rounded-3xl p-8 md:p-10"
            >
              <h3 className="font-sans font-semibold text-sm uppercase tracking-widest text-accent mb-8">
                For {group}
              </h3>
              <div className="space-y-6">
                {values[group].map((v) => (
                  <div key={v.title} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <v.icon className="w-4.5 h-4.5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-foreground mb-0.5">{v.title}</h4>
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                    </div>
                  </div>
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
