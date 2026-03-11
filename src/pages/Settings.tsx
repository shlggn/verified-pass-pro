import { useState } from "react";
import { User, Mail, Building2, Save, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const { user, profile, role } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [orgName, setOrgName] = useState(profile?.organization_name || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const updates: Record<string, string> = { full_name: fullName };
    if (role === "verifier") updates.organization_name = orgName;

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated");
    }
    setSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-xl">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account and profile</p>
        </div>

        <Card className="border-border">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="font-medium text-foreground">{profile?.full_name || "User"}</div>
                <div className="text-xs text-muted-foreground capitalize flex items-center gap-1.5">
                  <Shield className="w-3 h-3" /> {role || "individual"}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" /> Email
              </Label>
              <Input id="email" value={user?.email || ""} disabled className="bg-muted/30" />
              <p className="text-[11px] text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" /> Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {role === "verifier" && (
              <div className="space-y-2">
                <Label htmlFor="orgName" className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" /> Organization Name
                </Label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            )}

            <Button onClick={handleSave} disabled={saving} className="gap-2 rounded-xl">
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
