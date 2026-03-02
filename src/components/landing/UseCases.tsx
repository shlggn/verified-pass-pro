import { motion } from "framer-motion";
import { GraduationCap, Building2, Bus, Home } from "lucide-react";
import universityImage from "@/assets/university-student.png";
import workplaceImage from "@/assets/workplace-access.png";

const useCases = [
  { icon: GraduationCap, title: "Exam Accommodations", desc: "Students verify eligibility for extra time, accessible formats, or assistive technology without resubmitting medical files." },
  { icon: Building2, title: "Workplace Accessibility", desc: "Employees share a verified credential with HR to access ergonomic equipment, flexible schedules, or modified duties." },
  { icon: Bus, title: "Transport Benefits", desc: "Individuals prove eligibility for accessible transit passes or paratransit services instantly." },
  { icon: Home, title: "Accessible Housing", desc: "Tenants confirm qualification for accessible housing units without exposing diagnoses to landlords." },
];

const UseCases = () => {
  return (
    <section id="use-cases" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-accent mb-4 block">
            Real scenarios
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground">
            Where it matters
          </h2>
        </motion.div>

        {/* Photo strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden h-72"
          >
            <img src={universityImage} alt="Student with hearing aid studying in lecture hall" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="text-primary-foreground text-sm font-semibold">University Access</span>
              <p className="text-primary-foreground/70 text-xs mt-1 max-w-xs">Seamless exam accommodations with a single credential share</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-2xl overflow-hidden h-72"
          >
            <img src={workplaceImage} alt="Professional in wheelchair being welcomed at office" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="text-primary-foreground text-sm font-semibold">Workplace Inclusion</span>
              <p className="text-primary-foreground/70 text-xs mt-1 max-w-xs">Dignified verification for workplace accommodations</p>
            </div>
          </motion.div>
        </div>

        {/* Use case cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <uc.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-sans font-semibold text-foreground mb-2">{uc.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
