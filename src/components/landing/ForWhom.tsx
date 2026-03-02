import { motion } from "framer-motion";
import { User, Building2, GraduationCap, Bus, Home, Ticket } from "lucide-react";
import credentialGraphic from "@/assets/credential-graphic.png";

const audiences = [
  { icon: User, label: "Individuals with disabilities" },
  { icon: GraduationCap, label: "Universities" },
  { icon: Building2, label: "Employers" },
  { icon: Bus, label: "Transportation services" },
  { icon: Home, label: "Housing providers" },
  { icon: Ticket, label: "Event venues" },
];

const ForWhom = () => {
  return (
    <section id="for-whom" className="section-padding bg-muted/40">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-accent mb-4 block">
            Built for everyone
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-foreground mb-6">
            Designed for individuals and institutions alike
          </h2>
          <p className="text-muted-foreground mb-10 leading-relaxed max-w-md">
            Whether you need to prove your eligibility or verify someone else's — Access Passport streamlines the process with dignity and trust.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {audiences.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center gap-3 glass-card rounded-xl px-4 py-3"
              >
                <a.icon className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm font-medium text-foreground">{a.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <img
            src={credentialGraphic}
            alt="Shield credential graphic"
            className="w-72 lg:w-80 animate-float"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ForWhom;
