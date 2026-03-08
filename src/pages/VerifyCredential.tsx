import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

const VerifyCredential = () => {
  const { token } = useParams<{ token: string }>();
  const [credential, setCredential] = useState<Tables<"credentials"> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) return;
    supabase
      .from("credentials")
      .select("id, title, credential_type, status, issuing_authority, expires_at, created_at")
      .eq("qr_code_token", token)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError(true);
        } else {
          setCredential(data as Tables<"credentials">);
          // Log the verification
          supabase.from("verification_logs").insert({
            credential_id: data.id,
            result: data.status === "approved" ? "valid" : "invalid",
            verification_method: "qr_scan",
          });
        }
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Verifying credential...</div>
      </div>
    );
  }

  const isValid = credential?.status === "approved";
  const isExpired = credential?.expires_at && new Date(credential.expires_at) < new Date();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-sm w-full"
      >
        <Card className="border-border overflow-hidden">
          {/* Status banner */}
          <div className={`p-8 text-center ${
            error ? "bg-red-50" :
            isExpired ? "bg-yellow-50" :
            isValid ? "bg-green-50" : "bg-red-50"
          }`}>
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              error ? "bg-red-100" :
              isExpired ? "bg-yellow-100" :
              isValid ? "bg-green-100" : "bg-red-100"
            }`}>
              {error ? <AlertTriangle className="w-8 h-8 text-red-600" /> :
               isExpired ? <Clock className="w-8 h-8 text-yellow-600" /> :
               isValid ? <CheckCircle2 className="w-8 h-8 text-green-600" /> :
               <XCircle className="w-8 h-8 text-red-600" />}
            </div>
            <h1 className="text-xl font-serif">
              {error ? "Invalid Credential" :
               isExpired ? "Credential Expired" :
               isValid ? "Credential Verified" : "Not Valid"}
            </h1>
          </div>

          {credential && !error && (
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Credential</div>
                <div className="font-medium text-foreground">{credential.title}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Type</div>
                <div className="font-medium text-foreground">{credential.credential_type}</div>
              </div>
              {credential.issuing_authority && (
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Issued By</div>
                  <div className="font-medium text-foreground">{credential.issuing_authority}</div>
                </div>
              )}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5" />
                  Verified by Access Passport • SkyllSyft
                </div>
              </div>
            </CardContent>
          )}

          {error && (
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground text-center">
                This credential link is invalid or has been revoked.
              </p>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyCredential;
