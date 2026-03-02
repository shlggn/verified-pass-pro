import { motion } from "framer-motion";
import { User, Building2, GraduationCap, Bus, Home, Ticket } from "lucide-react";
import credentialGraphic from "@/assets/credential-graphic.png";

const audiences = [
  { icon: User, label: "Individuals with disabilities", desc: "Take control of your credentials" },
  { icon: GraduationCap, label: "Universities", desc: "Streamline student accommodations" },
  { icon: Building2, label: "Employers", desc: "Simplify workplace accessibility" },
  { icon: Bus, label: "Transit agencies", desc: "Verify eligibility instantly" },
  { icon: Home, label: "Housing providers", desc: "Confirm qualifications privately" },
  { icon: Ticket, label: "Event venues", desc: "Enable accessible experiences" },
];

const ForWhom = () => {
  return (
    <section id="for-whom" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-champagne/40 via-background to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <span className="section-label">Who It's For</span>
          <h2 className="section-heading mb-5">
            Built for people who deserve better.{" "}
            <span className="text-gradient">And institutions ready to do better.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-light leading-[1.75] mb-12 max-w-lg">
            Access Passport serves both sides of the accommodation equation — 
            with privacy for individuals and efficiency for organizations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {audiences.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card rounded-xl px-5 py-4 flex items-start gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                  <a.icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground block leading-tight">{a.label}</span>
                  <span className="text-xs text-muted-foreground mt-0.5 block">{a.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-8 rounded-full gold-glow pointer-events-none" />
            <img
              src={credentialGraphic}
              alt="Shield representing credential privacy protection"
              className="w-64 lg:w-72 animate-float relative z-10 drop-shadow-2xl"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ForWhom;
