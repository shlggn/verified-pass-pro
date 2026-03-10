import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Copy, CheckCircle2, Shield, Building2, Clock, Hash, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type SharedCred = {
  id: string;
  credential_id: string;
  organization_name: string;
  share_token: string;
  expires_at: string;
  integrity_hash: string;
  created_at: string;
  is_revoked: boolean;
};

const EXPIRY_OPTIONS = [
  { value: "1h", label: "1 Hour" },
  { value: "24h", label: "24 Hours" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
];

const getExpiryDate = (duration: string): string => {
  const now = new Date();
  switch (duration) {
    case "1h": return new Date(now.getTime() + 3600000).toISOString();
    case "24h": return new Date(now.getTime() + 86400000).toISOString();
    case "7d": return new Date(now.getTime() + 604800000).toISOString();
    case "30d": return new Date(now.getTime() + 2592000000).toISOString();
    case "90d": return new Date(now.getTime() + 7776000000).toISOString();
    default: return new Date(now.getTime() + 86400000).toISOString();
  }
};

const ShareQR = () => {
  const { user } = useAuth();
  const [approvedCreds, setApprovedCreds] = useState<Tables<"credentials">[]>([]);
  const [selectedCred, setSelectedCred] = useState<Tables<"credentials"> | null>(null);
  const [orgName, setOrgName] = useState("");
  const [expiryDuration, setExpiryDuration] = useState("24h");
  const [generating, setGenerating] = useState(false);
  const [generatedShare, setGeneratedShare] = useState<{ share_token: string; integrity_hash: string; expires_at: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareHistory, setShareHistory] = useState<SharedCred[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("credentials")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .then(({ data }) => {
        const creds = data || [];
        setApprovedCreds(creds);
        if (creds.length > 0) setSelectedCred(creds[0]);
      });

    loadShareHistory();
  }, [user]);

  const loadShareHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("shared_credentials")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setShareHistory((data as SharedCred[]) || []);
  };

  const handleGenerate = async () => {
    if (!selectedCred || !orgName.trim()) {
      toast.error("Please enter an organization name");
      return;
    }
    if (orgName.trim().length > 200) {
      toast.error("Organization name too long (max 200 characters)");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-share-hash", {
        body: {
          credential_id: selectedCred.id,
          organization_name: orgName.trim(),
          expires_at: getExpiryDate(expiryDuration),
        },
      });

      if (error) throw error;
      setGeneratedShare(data);
      toast.success("Temporary certificate generated with blockchain signature!");
      loadShareHistory();
    } catch (err: any) {
      toast.error(err.message || "Failed to generate certificate");
    } finally {
      setGenerating(false);
    }
  };

  const shareUrl = generatedShare
    ? `${window.location.origin}/verify/share/${generatedShare.share_token}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async (shareId: string) => {
    const { error } = await supabase
      .from("shared_credentials")
      .update({ is_revoked: true })
      .eq("id", shareId);
    if (error) {
      toast.error("Failed to revoke");
    } else {
      toast.success("Certificate revoked");
      loadShareHistory();
    }
  };

  const getShareStatus = (s: SharedCred) => {
    if (s.is_revoked) return { label: "Revoked", variant: "destructive" as const };
    if (new Date(s.expires_at) < new Date()) return { label: "Expired", variant: "secondary" as const };
    return { label: "Active", variant: "default" as const };
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Share Your Credentials</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Generate a blockchain-signed temporary certificate for secure sharing
          </p>
        </div>

        {approvedCreds.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="p-16 text-center">
              <QrCode className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-foreground mb-2">No approved credentials</h3>
              <p className="text-sm text-muted-foreground">
                You need at least one approved credential to generate a certificate
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div className="space-y-6">
              {/* Credential selector */}
              <div className="space-y-3">
                <Label className="text-xs font-medium uppercase tracking-wider text-foreground">
                  Select Credential
                </Label>
                {approvedCreds.map((cred) => (
                  <button
                    key={cred.id}
                    onClick={() => { setSelectedCred(cred); setGeneratedShare(null); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedCred?.id === cred.id
                        ? "border-accent bg-accent/5 shadow-sm"
                        : "border-border bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <div>
                        <div className="font-medium text-sm text-foreground">{cred.title}</div>
                        <div className="text-xs text-muted-foreground">{cred.credential_type}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Org name + expiry */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-accent" />
                    Recipient Organization
                  </Label>
                  <Input
                    id="orgName"
                    placeholder="e.g. Acme Corp HR Department"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    maxLength={200}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent" />
                    Certificate Validity
                  </Label>
                  <Select value={expiryDuration} onValueChange={setExpiryDuration}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPIRY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generating || !orgName.trim()}
                  className="w-full rounded-xl gap-2"
                >
                  <Hash className="w-4 h-4" />
                  {generating ? "Generating..." : "Generate Blockchain Certificate"}
                </Button>
              </div>
            </div>

            {/* Right: QR result */}
            {generatedShare && (
              <Card className="border-border">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-accent" />
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-6 inline-block">
                    <QRCodeSVG
                      value={shareUrl}
                      size={180}
                      level="H"
                      includeMargin
                      bgColor="transparent"
                      fgColor="hsl(225, 22%, 14%)"
                    />
                  </div>

                  <div>
                    <h3 className="font-serif text-lg text-foreground">{selectedCred?.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Shared with <span className="font-medium text-foreground">{orgName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires: {new Date(generatedShare.expires_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Hash display */}
                  <div className="text-left bg-muted/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-3.5 h-3.5 text-accent" />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Integrity Signature
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-foreground/70 break-all leading-relaxed">
                      {generatedShare.integrity_hash}
                    </p>
                  </div>

                  <Button onClick={handleCopy} variant="outline" className="gap-2 rounded-xl">
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Verification Link"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Share History */}
        {shareHistory.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl text-foreground">Share History</h2>
            <div className="space-y-3">
              {shareHistory.map((s) => {
                const st = getShareStatus(s);
                const cred = approvedCreds.find((c) => c.id === s.credential_id);
                return (
                  <Card key={s.id} className="border-border">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground truncate">
                            {cred?.title || "Credential"}
                          </span>
                          <Badge variant={st.variant} className="text-[10px] shrink-0">{st.label}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {s.organization_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(s.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="font-mono text-[9px] text-muted-foreground/60 mt-1 truncate">
                          {s.integrity_hash}
                        </div>
                      </div>
                      {st.label === "Active" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevoke(s.id)}
                          className="text-destructive hover:text-destructive shrink-0"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ShareQR;
