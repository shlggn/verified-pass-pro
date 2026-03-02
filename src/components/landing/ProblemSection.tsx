import { motion } from "framer-motion";
import paperworkImage from "@/assets/problem-paperwork.png";

const problems = [
  "Repeated requests for medical proof",
  "Exposure of sensitive health information",
  "Administrative delays and inconsistency",
  "Privacy concerns around diagnosis disclosure",
];

const ProblemSection = () => {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative">
            <img
              src={paperworkImage}
              alt="Scattered disability accommodation paperwork on a desk"
              className="rounded-2xl shadow-lg w-full"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-accent mb-4 block">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-foreground mb-6">
            The current system is broken
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            People with disabilities must repeatedly provide medical documentation to access accommodations — a process that's invasive, slow, and inconsistent.
          </p>
          <ul className="space-y-4">
            {problems.map((problem, i) => (
              <motion.li
                key={problem}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-xs text-destructive shrink-0">✕</span>
                <span className="text-sm text-foreground font-medium">{problem}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
