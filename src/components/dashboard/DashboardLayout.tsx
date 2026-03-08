import { useNavigate, Link, useLocation } from "react-router-dom";
import { Shield, LogOut, Home, FileText, QrCode, Users, Settings, ShieldCheck, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navItems = {
  individual: [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/credentials", label: "My Credentials", icon: FileText },
    { href: "/dashboard/share", label: "Share & QR", icon: QrCode },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
  verifier: [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/verify", label: "Verify", icon: ShieldCheck },
    { href: "/dashboard/history", label: "History", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
  admin: [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/applications", label: "Applications", icon: FileText },
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ],
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, role, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const items = navItems[role || "individual"];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-medium text-sm text-foreground leading-none">Access Passport</span>
              <span className="text-muted-foreground text-[9px] tracking-[0.15em] uppercase mt-0.5">
                {role || "Dashboard"}
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-semibold">
              {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">{profile?.full_name || "User"}</div>
              <div className="text-[11px] text-muted-foreground truncate">{user?.email}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-serif text-sm text-foreground">Access Passport</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4" />
          </Button>
        </header>

        {/* Mobile nav */}
        <nav className="md:hidden flex border-b border-border bg-card overflow-x-auto">
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-4 py-3 text-xs whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-accent text-accent font-medium"
                    : "border-transparent text-muted-foreground"
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
