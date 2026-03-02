import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 md:px-12 py-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4 text-accent" />
          <span className="font-medium text-foreground">Access Passport</span>
          <span className="mx-1">·</span>
          <span>by SkyllSyft</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SkyllSyft. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
