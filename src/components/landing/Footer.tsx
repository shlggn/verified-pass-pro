import { Shield } from "lucide-react";

const footerLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Benefits", href: "#value" },
];

const Footer = () => {
  return (
    <footer className="relative">
      <div className="luxury-divider" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-serif font-medium text-base text-foreground block leading-none">
                Access Passport
              </span>
              <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-muted-foreground mt-0.5 block">
                by SkyllSyft
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="luxury-divider my-8 opacity-50" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SkyllSyft. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Privacy-first by design.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
