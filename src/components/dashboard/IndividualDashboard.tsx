import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Clock, CheckCircle2, XCircle, Plus, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  pending: { color: "text-yellow-600 bg-yellow-50", icon: Clock, label: "Pending Review" },
  approved: { color: "text-green-600 bg-green-50", icon: CheckCircle2, label: "Approved" },
  rejected: { color: "text-red-600 bg-red-50", icon: XCircle, label: "Rejected" },
  expired: { color: "text-muted-foreground bg-muted", icon: Clock, label: "Expired" },
  revoked: { color: "text-red-600 bg-red-50", icon: XCircle, label: "Revoked" },
};

const IndividualDashboard = () => {
  const { user, profile } = useAuth();
  const [credentials, setCredentials] = useState<Tables<"credentials">[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("credentials")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCredentials(data || []);
        setLoading(false);
      });
  }, [user]);

  const approved = credentials.filter((c) => c.status === "approved").length;
  const pending = credentials.filter((c) => c.status === "pending").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-foreground">
          Welcome back, {profile?.full_name || "there"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your Access Passport credentials
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Credentials", value: credentials.length, icon: FileText },
          { label: "Approved", value: approved, icon: CheckCircle2 },
          { label: "Pending", value: pending, icon: Clock },
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

      {/* Quick actions */}
      <div className="flex gap-3">
        <Button onClick={() => navigate("/dashboard/credentials")} className="bg-primary text-primary-foreground gap-2 rounded-xl">
          <Plus className="w-4 h-4" /> Add Credential
        </Button>
        <Button onClick={() => navigate("/dashboard/share")} variant="outline" className="gap-2 rounded-xl">
          Share QR Code
        </Button>
      </div>

      {/* Recent credentials */}
      <div>
        <h2 className="text-lg font-serif text-foreground mb-4">Recent Credentials</h2>
        {loading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : credentials.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="p-10 text-center">
              <Upload className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-serif text-lg text-foreground mb-2">No credentials yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Submit your first credential to get your Access Passport
              </p>
              <Button onClick={() => navigate("/dashboard/credentials")} className="bg-primary text-primary-foreground gap-2 rounded-xl">
                <Plus className="w-4 h-4" /> Add Your First Credential
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {credentials.slice(0, 5).map((cred) => {
              const config = statusConfig[cred.status];
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={cred.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-sm text-foreground">{cred.title}</div>
                          <div className="text-xs text-muted-foreground">{cred.credential_type} • {cred.issuing_authority || "Self"}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${config.color}`}>
                        {config.label}
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndividualDashboard;
