import { useState } from "react";
import { QrCode, Search, ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

const VerifyPage = () => {
  const { user } = useAuth();
  const [token, setToken] = useState("");
  const [result, setResult] = useState<Tables<"credentials"> | null>(null);
  const [error, setError] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleVerify = async () => {
    if (!token.trim()) return;
    setSearching(true);
    setError(false);
    setResult(null);

    // Extract token from URL or use raw
    let qrToken = token.trim();
    if (qrToken.includes("/verify/")) {
      qrToken = qrToken.split("/verify/").pop() || "";
    }

    const { data, error: err } = await supabase
      .from("credentials")
      .select("id, title, credential_type, status, issuing_authority, expires_at, created_at")
      .eq("qr_code_token", qrToken)
      .single();

    if (err || !data) {
      setError(true);
    } else {
      setResult(data as Tables<"credentials">);
      // Log verification
      if (user) {
        await supabase.from("verification_logs").insert({
          credential_id: data.id,
          verifier_id: user.id,
          result: data.status === "approved" ? "valid" : "invalid",
          verification_method: "manual_lookup",
        });
      }
    }
    setSearching(false);
  };

  const isValid = result?.status === "approved";

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Verify a Credential</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter a verification link or token to check credential validity
          </p>
        </div>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste verification link or token..."
                className="h-12"
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              />
              <Button onClick={handleVerify} disabled={searching} className="h-12 px-6 bg-primary text-primary-foreground rounded-xl gap-2">
                <Search className="w-4 h-4" />
                {searching ? "Checking..." : "Verify"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
              <div>
                <div className="font-medium text-foreground">Invalid Credential</div>
                <div className="text-sm text-muted-foreground">No credential found for this token or link</div>
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="border-border">
            <CardContent className="p-6">
              <div className={`flex items-center gap-3 mb-6 p-4 rounded-xl ${isValid ? "bg-green-50" : "bg-red-50"}`}>
                {isValid ? (
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-600" />
                )}
                <div>
                  <div className="font-serif text-lg text-foreground">{isValid ? "Valid Credential" : "Not Valid"}</div>
                  <div className="text-sm text-muted-foreground">Status: {result.status}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Title</div>
                  <div className="font-medium text-foreground">{result.title}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Type</div>
                  <div className="font-medium text-foreground">{result.credential_type}</div>
                </div>
                {result.issuing_authority && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Issuing Authority</div>
                    <div className="font-medium text-foreground">{result.issuing_authority}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VerifyPage;
