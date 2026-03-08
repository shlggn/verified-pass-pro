import { useEffect, useState } from "react";
import { Users, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type ProfileWithRole = Tables<"profiles"> & { roles: Tables<"user_roles">[] };

const AdminUsers = () => {
  const [users, setUsers] = useState<ProfileWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      const { data: roles } = await supabase.from("user_roles").select("*");

      const combined = (profiles || []).map((p) => ({
        ...p,
        roles: (roles || []).filter((r) => r.user_id === p.user_id),
      }));
      setUsers(combined);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const roleColors: Record<string, string> = {
    individual: "text-blue-600 bg-blue-50",
    verifier: "text-purple-600 bg-purple-50",
    admin: "text-accent bg-accent/10",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} registered users</p>
        </div>

        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <Card key={u.id} className="border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-semibold">
                      {u.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{u.full_name || "Unnamed"}</div>
                      <div className="text-xs text-muted-foreground">{u.email} {u.organization_name ? `• ${u.organization_name}` : ""}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {u.roles.map((r) => (
                      <span key={r.id} className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${roleColors[r.role] || "bg-muted text-muted-foreground"}`}>
                        {r.role}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
