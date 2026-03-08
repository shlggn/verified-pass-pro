import { useEffect, useState } from "react";
import { ShieldCheck, QrCode, BarChart3, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

const VerifierDashboard = () => {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState<Tables<"verification_logs">[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    supabase
      .from("verification_logs")
      .select("*")
      .eq("verifier_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setLogs(data || []));
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-foreground">
          Verifier Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {profile?.organization_name || "Your organization"} — verify Access Passport credentials
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Verifications Today", value: logs.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length, icon: ShieldCheck },
          { label: "Total Verifications", value: logs.length, icon: BarChart3 },
          { label: "This Week", value: logs.filter(l => Date.now() - new Date(l.created_at).getTime() < 7 * 86400000).length, icon: Clock },
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

      <Button onClick={() => navigate("/dashboard/verify")} className="bg-primary text-primary-foreground gap-2 rounded-xl" size="lg">
        <QrCode className="w-5 h-5" /> Verify a Credential
      </Button>

      <div>
        <h2 className="text-lg font-serif text-foreground mb-4">Recent Verifications</h2>
        {logs.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="p-10 text-center">
              <ShieldCheck className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-serif text-lg text-foreground mb-2">No verifications yet</h3>
              <p className="text-sm text-muted-foreground">Start verifying credentials by scanning QR codes</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} className="border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm text-foreground">Credential verified</div>
                    <div className="text-xs text-muted-foreground">
                      {log.verification_method} • {new Date(log.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    log.result === "valid" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                  }`}>
                    {log.result}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifierDashboard;
