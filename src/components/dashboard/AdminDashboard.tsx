import { useEffect, useState } from "react";
import { Users, FileText, ShieldCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [pendingCredentials, setPendingCredentials] = useState<(Tables<"credentials"> & { profiles?: Tables<"profiles"> | null })[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalCredentials: 0, pending: 0, approved: 0 });
  const navigate = useNavigate();

  const fetchData = async () => {
    const [{ count: userCount }, { data: creds }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("credentials").select("*").order("created_at", { ascending: false }),
    ]);

    const allCreds = creds || [];
    const pending = allCreds.filter((c) => c.status === "pending");
    
    setStats({
      totalUsers: userCount || 0,
      totalCredentials: allCreds.length,
      pending: pending.length,
      approved: allCreds.filter((c) => c.status === "approved").length,
    });
    setPendingCredentials(pending.slice(0, 10));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReview = async (credId: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("credentials")
      .update({ status, verified_at: new Date().toISOString() })
      .eq("id", credId);

    if (error) {
      toast.error("Failed to update credential");
    } else {
      toast.success(`Credential ${status}`);
      fetchData();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage users, credentials, and platform operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: Users },
          { label: "Total Credentials", value: stats.totalCredentials, icon: FileText },
          { label: "Pending Review", value: stats.pending, icon: Clock },
          { label: "Approved", value: stats.approved, icon: ShieldCheck },
        ].map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-serif text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-serif text-foreground">Pending Applications</h2>
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/applications")} className="rounded-xl">
            View All
          </Button>
        </div>

        {pendingCredentials.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="p-10 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-500/40 mx-auto mb-4" />
              <h3 className="font-serif text-lg text-foreground mb-2">All caught up!</h3>
              <p className="text-sm text-muted-foreground">No pending applications to review</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingCredentials.map((cred) => (
              <Card key={cred.id} className="border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-foreground">{cred.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {cred.credential_type} • Submitted {new Date(cred.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleReview(cred.id, "rejected")} className="rounded-lg text-destructive hover:text-destructive gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </Button>
                    <Button size="sm" onClick={() => handleReview(cred.id, "approved")} className="rounded-lg bg-green-600 hover:bg-green-700 text-white gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
