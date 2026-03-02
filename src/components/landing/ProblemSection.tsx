import { motion } from "framer-motion";
import { X } from "lucide-react";
import paperworkImage from "@/assets/problem-paperwork.png";

const problems = [
  { stat: "6×", text: "average times a person must resubmit medical proof across institutions" },
  { stat: "73%", text: "of individuals feel their medical privacy is compromised during verification" },
  { stat: "14 days", text: "average administrative delay for accommodation approvals" },
];

const ProblemSection = () => {
  return (
    <section id="problem" className="section-padding relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-champagne/30 to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
              <img
                src={paperworkImage}
                alt="Scattered disability accommodation paperwork"
                className="rounded-2xl shadow-xl w-full object-cover aspect-square relative z-10"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-foreground/20 to-transparent z-10" />
              
              {/* Overlay label */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-5 left-5 right-5 z-20"
              >
                <div className="glass-card-strong rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5 text-destructive" />
                  </div>
                  <span className="text-xs font-medium text-foreground">This shouldn't be the norm</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <span className="section-label">The Problem</span>
            <h2 className="section-heading mb-6">
              Dignity shouldn't require<br className="hidden md:block" /> disclosing a diagnosis
            </h2>
            <p className="text-muted-foreground text-lg leading-[1.75] mb-12 max-w-lg font-light">
              Every time someone with a disability requests an accommodation, they're 
              asked to prove it — again. Sensitive medical records passed around. 
              Forms resubmitted. Privacy compromised. It's exhausting, invasive, 
              and unnecessary.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {problems.map((p, i) => (
                <motion.div
                  key={p.stat}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                  className="relative"
                >
                  <div className="stat-number mb-2">{p.stat}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
