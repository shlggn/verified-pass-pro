import { useEffect, useState } from "react";
import { BarChart3, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const VerificationHistory = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<Tables<"verification_logs">[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("verification_logs")
      .select("*")
      .eq("verifier_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setLogs(data || []));
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Verification History</h1>
          <p className="text-muted-foreground text-sm mt-1">{logs.length} verifications performed</p>
        </div>

        {logs.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="p-10 text-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-serif text-lg text-foreground">No verification history</h3>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} className="border-border">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">Credential Verification</div>
                      <div className="text-xs text-muted-foreground">
                        {log.verification_method} • {new Date(log.created_at).toLocaleString()}
                      </div>
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
    </DashboardLayout>
  );
};

export default VerificationHistory;
