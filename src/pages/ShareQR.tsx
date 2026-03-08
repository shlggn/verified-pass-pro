import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Copy, CheckCircle2, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

const ShareQR = () => {
  const { user } = useAuth();
  const [approvedCreds, setApprovedCreds] = useState<Tables<"credentials">[]>([]);
  const [selectedCred, setSelectedCred] = useState<Tables<"credentials"> | null>(null);
  const [copied, setCopied] = useState(false);

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
  }, [user]);

  const verificationUrl = selectedCred
    ? `${window.location.origin}/verify/${selectedCred.qr_code_token}`
    : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Share Your Credentials</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate a QR code to share your verified status privately</p>
        </div>

        {approvedCreds.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="p-16 text-center">
              <QrCode className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-foreground mb-2">No approved credentials</h3>
              <p className="text-sm text-muted-foreground">
                You need at least one approved credential to generate a QR code
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Credential selector */}
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">Select Credential</h2>
              {approvedCreds.map((cred) => (
                <button
                  key={cred.id}
                  onClick={() => setSelectedCred(cred)}
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

            {/* QR Code display */}
            {selectedCred && (
              <Card className="border-border">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-accent" />
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-8 inline-block mb-6">
                    <QRCodeSVG
                      value={verificationUrl}
                      size={200}
                      level="H"
                      includeMargin
                      bgColor="transparent"
                      fgColor="hsl(225, 22%, 14%)"
                    />
                  </div>

                  <h3 className="font-serif text-lg text-foreground mb-1">{selectedCred.title}</h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    Scan to verify — no sensitive data is shared
                  </p>

                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleCopy} variant="outline" className="gap-2 rounded-xl">
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy Link"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ShareQR;
