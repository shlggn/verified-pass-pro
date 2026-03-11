import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Clock, Building2, Hash, CheckCircle2, XCircle, AlertTriangle, Link2, User, Layers, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type VerifyResult = {
  share: {
    organization_name: string;
    expires_at: string;
    created_at: string;
    integrity_hash: string;
    is_revoked: boolean;
  };
  credential: {
    title: string;
    credential_type: string;
    status: string;
    issuing_authority: string | null;
    support_needs: string[] | null;
    support_summary: string | null;
  } | null;
  holder_name: string | null;
  hash_valid: boolean;
  status: "valid" | "expired" | "revoked" | "invalid" | "not_found";
  blockchain: {
    total_verifications: number;
    recent_chain: Array<{
      id: string;
      created_at: string;
      verification_method: string;
      result: string;
      verifier_organization: string | null;
    }>;
    block_hash: string;
    previous_hash: string;
  };
};

const VerifySharedCredential = () => {
  const { shareToken } = useParams<{ shareToken: string }>();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shareToken) return;

    const verify = async () => {
      setLoading(true);
      try {
        const { data, error: fnError } = await supabase.functions.invoke("verify-shared", {
          body: { share_token: shareToken },
        });

        if (fnError || !data || data.error) {
          setError(true);
        } else {
          setResult(data);
        }
      } catch {
        setError(true);
      }
      setLoading(false);
    };

    verify();
  }, [shareToken]);

  const timeRemaining = () => {
    if (!result) return "";
    const diff = new Date(result.share.expires_at).getTime() - Date.now();
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
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-muted-foreground text-sm">Verifying credential on-chain...</div>
        </div>
      </div>
    );
  }

  if (error || !result) {
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
    valid: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30", label: "Verified & Active", badgeVariant: "default" as const },
    expired: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30", label: "Expired", badgeVariant: "secondary" as const },
    revoked: { icon: XCircle, color: "text-destructive", bg: "bg-red-50 dark:bg-red-950/30", label: "Revoked", badgeVariant: "destructive" as const },
    invalid: { icon: XCircle, color: "text-destructive", bg: "bg-red-50 dark:bg-red-950/30", label: "Invalid", badgeVariant: "destructive" as const },
    not_found: { icon: XCircle, color: "text-destructive", bg: "bg-red-50 dark:bg-red-950/30", label: "Not Found", badgeVariant: "destructive" as const },
  };

  const config = statusConfig[result.status];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full space-y-5"
      >
        {/* Status Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`w-20 h-20 rounded-2xl ${config.bg} flex items-center justify-center mx-auto mb-4`}
          >
            <StatusIcon className={`w-10 h-10 ${config.color}`} />
          </motion.div>
          <h1 className="font-serif text-3xl text-foreground mb-1">Credential Verification</h1>
          <Badge variant={config.badgeVariant} className="text-sm">{config.label}</Badge>
        </div>

        {/* Credential Info */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            {result.holder_name && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Credential Holder</div>
                  <div className="font-medium text-foreground">{result.holder_name}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Credential</div>
                <div className="font-medium text-foreground">{result.credential?.title || "Unknown"}</div>
                <div className="text-sm text-muted-foreground">{result.credential?.credential_type}</div>
              </div>
            </div>

            {result.credential?.issuing_authority && (
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Issuing Authority</div>
                  <div className="font-medium text-foreground">{result.credential.issuing_authority}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Shared With</div>
                <div className="font-medium text-foreground">{result.share.organization_name}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Validity</div>
                <div className="font-medium text-foreground">{timeRemaining()}</div>
                <div className="text-xs text-muted-foreground">
                  Expires: {new Date(result.share.expires_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Support needs if present */}
            {result.status === "valid" && result.credential?.support_summary && (
              <div className="mt-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Support Summary</div>
                <div className="font-medium text-foreground text-sm">{result.credential.support_summary}</div>
                {result.credential.support_needs && result.credential.support_needs.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {result.credential.support_needs.map((need, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        {need}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Blockchain Integrity Section */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-5 h-5 text-accent" />
              <h2 className="font-serif text-lg text-foreground">Blockchain Integrity</h2>
            </div>

            {/* Hash verification */}
            <div className="bg-muted/30 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 font-medium">
                SHA-256 Integrity Signature
              </div>
              <div className="font-mono text-[10px] text-foreground/70 break-all leading-relaxed">
                {result.share.integrity_hash}
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                {result.hash_valid ? (
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

            {/* Block info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Total Verifications</div>
                <div className="text-xl font-serif text-foreground">{result.blockchain.total_verifications}</div>
              </div>
              <div className="bg-muted/20 rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Block Status</div>
                <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-accent" />
                  {result.blockchain.previous_hash === "genesis" ? "Genesis Block ✓" : "Chain Break ⚠"}
                </div>
              </div>
            </div>

            {/* Verification chain / audit trail */}
            {result.blockchain.recent_chain.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Verification Audit Trail
                  </span>
                </div>
                <div className="space-y-0">
                  {result.blockchain.recent_chain.map((entry, i) => (
                    <div key={entry.id} className="flex items-start gap-3">
                      {/* Chain line */}
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          entry.result === "valid" ? "bg-green-500" : "bg-red-500"
                        }`} />
                        {i < result.blockchain.recent_chain.length - 1 && (
                          <div className="w-px h-8 bg-border" />
                        )}
                      </div>
                      <div className="pb-3">
                        <div className="text-xs text-foreground font-medium">
                          {entry.verification_method === "shared_link" ? "Link Verification" : entry.verification_method}
                          {entry.verifier_organization && ` • ${entry.verifier_organization}`}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {new Date(entry.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timestamp */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Link2 className="w-3 h-3" />
            Issued: {new Date(result.share.created_at).toLocaleString()}
          </div>
          <p className="text-[10px] text-muted-foreground/60">
            Powered by Access Passport • Blockchain-verified credential sharing by SkyllSyft
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifySharedCredential;
