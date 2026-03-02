import { motion } from "framer-motion";
import { GraduationCap, Building2, Bus, Home } from "lucide-react";
import universityImage from "@/assets/university-student.png";
import workplaceImage from "@/assets/workplace-access.png";

const useCases = [
  { icon: GraduationCap, title: "Education", desc: "Extra time on exams, assistive technology, or accessible seating — verified with one share." },
  { icon: Building2, title: "Employment", desc: "Ergonomic setups, flexible hours, or modified duties — without handing over medical files to HR." },
  { icon: Bus, title: "Transportation", desc: "Accessible transit passes and paratransit eligibility — confirmed instantly at the counter." },
  { icon: Home, title: "Housing", desc: "Qualify for accessible units — without exposing your diagnosis to landlords or agencies." },
];

const UseCases = () => {
  return (
    <section id="use-cases" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-champagne/20 to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-16"
        >
          <span className="section-label">Real Scenarios</span>
          <h2 className="section-heading mb-5">
            One credential.{" "}
            <span className="text-gradient">Everywhere it matters.</span>
          </h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed">
            From lecture halls to office lobbies — Access Passport works wherever accommodations are needed.
          </p>
        </motion.div>

        {/* Photo grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            { img: universityImage, alt: "Student with hearing aid in lecture hall", title: "University", subtitle: "Seamless exam accommodations with a single credential share" },
            { img: workplaceImage, alt: "Professional in wheelchair welcomed at office", title: "Workplace", subtitle: "Dignified, private verification for workplace accommodations" },
          ].map((photo, i) => (
            <motion.div
              key={photo.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[1.5rem] overflow-hidden group cursor-pointer"
            >
              <img
                src={photo.img}
                alt={photo.alt}
                className="w-full h-80 object-cover group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-accent block mb-1">
                  {photo.title}
                </span>
                <p className="text-primary-foreground text-lg font-serif">{photo.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Use case cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {useCases.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-2xl p-7 group hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/8 flex items-center justify-center mb-5 group-hover:bg-accent/15 transition-colors duration-300">
                <uc.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-serif text-lg text-foreground mb-2">{uc.title}</h3>
              <p className="text-sm text-muted-foreground leading-[1.7]">{uc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
