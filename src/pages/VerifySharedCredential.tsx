import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Shield, Clock, Building2, Hash, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type ShareData = {
  id: string;
  organization_name: string;
  share_token: string;
  expires_at: string;
  integrity_hash: string;
  created_at: string;
  is_revoked: boolean;
  credential_id: string;
  user_id: string;
  credential?: {
    title: string;
    credential_type: string;
    status: string;
    issuing_authority: string | null;
  };
};

const VerifySharedCredential = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [share, setShare] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hashValid, setHashValid] = useState<boolean | null>(null);
  const [status, setStatus] = useState<"valid" | "expired" | "revoked" | "not_found">("not_found");

  useEffect(() => {
    if (!shareToken) return;

    const verify = async () => {
      setLoading(true);

      // Fetch share record
      const { data: shareData, error } = await supabase
        .from("shared_credentials")
        .select("*")
        .eq("share_token", shareToken)
        .single();

      if (error || !shareData) {
        setStatus("not_found");
        setLoading(false);
        return;
      }

      // Fetch credential info
      const { data: credData } = await supabase
        .from("credentials")
        .select("title, credential_type, status, issuing_authority")
        .eq("id", shareData.credential_id)
        .single();

      const fullShare: ShareData = { ...shareData, credential: credData || undefined };
      setShare(fullShare);

      // Check revoked
      if (shareData.is_revoked) {
        setStatus("revoked");
      } else if (new Date(shareData.expires_at) < new Date()) {
        setStatus("expired");
      } else {
        setStatus("valid");
      }

      // Verify integrity hash
      const payload = `${shareData.credential_id}|${shareData.user_id}|${shareData.organization_name}|${shareData.created_at}|${shareData.expires_at}|${shareData.share_token}`;
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(payload));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const recomputedHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setHashValid(recomputedHash === shareData.integrity_hash);

      setLoading(false);
    };

    verify();
  }, [shareToken]);

  const timeRemaining = () => {
    if (!share) return "";
    const diff = new Date(share.expires_at).getTime() - Date.now();
    if (diff <= 0) return "Expired";
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h remaining`;
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m remaining`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Verifying credential...</div>
      </div>
    );
  }

  if (status === "not_found") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-destructive/30">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="font-serif text-2xl text-foreground mb-2">Certificate Not Found</h1>
            <p className="text-muted-foreground text-sm">This verification link is invalid or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = {
    valid: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Verified & Active", badgeVariant: "default" as const },
    expired: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", label: "Expired", badgeVariant: "secondary" as const },
    revoked: { icon: XCircle, color: "text-destructive", bg: "bg-red-50", label: "Revoked", badgeVariant: "destructive" as const },
    not_found: { icon: XCircle, color: "text-destructive", bg: "bg-red-50", label: "Not Found", badgeVariant: "destructive" as const },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className={`w-20 h-20 rounded-2xl ${config.bg} flex items-center justify-center mx-auto mb-4`}>
            <StatusIcon className={`w-10 h-10 ${config.color}`} />
          </div>
          <h1 className="font-serif text-3xl text-foreground mb-1">Credential Verification</h1>
          <Badge variant={config.badgeVariant} className="text-sm">{config.label}</Badge>
        </div>

        {/* Credential Info */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Credential</div>
                <div className="font-medium text-foreground">{share?.credential?.title || "Unknown"}</div>
                <div className="text-sm text-muted-foreground">{share?.credential?.credential_type}</div>
              </div>
            </div>

            {share?.credential?.issuing_authority && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Issuing Authority</div>
                  <div className="font-medium text-foreground">{share.credential.issuing_authority}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Shared With</div>
                <div className="font-medium text-foreground">{share?.organization_name}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Validity</div>
                <div className="font-medium text-foreground">{timeRemaining()}</div>
                <div className="text-xs text-muted-foreground">
                  Expires: {new Date(share?.expires_at || "").toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blockchain Hash */}
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Hash className="w-5 h-5 text-accent mt-0.5 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Blockchain Integrity Signature
                </div>
                <div className="font-mono text-xs text-foreground break-all bg-muted/50 p-3 rounded-lg">
                  {share?.integrity_hash}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  {hashValid ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">Hash verified — data integrity confirmed</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-destructive" />
                      <span className="text-xs text-destructive font-medium">Hash mismatch — data may have been tampered</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Powered by Access Passport — Blockchain-verified credential sharing
        </p>
      </div>
    </div>
  );
};

export default VerifySharedCredential;
