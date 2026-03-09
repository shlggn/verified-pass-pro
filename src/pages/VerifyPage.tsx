import { useState, useEffect, useRef } from "react";
import { Camera, QrCode, Search, CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";

const VerifyPage = () => {
  const { user } = useAuth();
  const [token, setToken] = useState("");
  const [result, setResult] = useState<Tables<"credentials"> | null>(null);
  const [error, setError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const verifyToken = async (qrToken: string) => {
    setSearching(true);
    setError(false);
    setResult(null);

    // Extract token from URL or use raw
    let cleanToken = qrToken.trim();
    if (cleanToken.includes("/verify/")) {
      cleanToken = cleanToken.split("/verify/").pop() || "";
    }

    const { data, error: err } = await supabase
      .from("credentials")
      .select("id, title, credential_type, status, issuing_authority, expires_at, created_at")
      .eq("qr_code_token", cleanToken)
      .single();

    if (err || !data) {
      setError(true);
    } else {
      setResult(data as Tables<"credentials">);
      if (user) {
        await supabase.from("verification_logs").insert({
          credential_id: data.id,
          verifier_id: user.id,
          result: data.status === "approved" ? "valid" : "invalid",
          verification_method: scanning ? "qr_scan" : "manual_lookup",
        });
      }
    }
    setSearching(false);
  };

  const handleVerify = () => {
    if (!token.trim()) return;
    verifyToken(token);
  };

  const [cameraError, setCameraError] = useState("");

  const startScanner = async () => {
    setError(false);
    setResult(null);
    setCameraError("");

    try {
      // Request camera permission directly in the user gesture handler
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      // Stop the stream immediately — html5-qrcode will re-acquire it
      stream.getTracks().forEach((t) => t.stop());

      setScanning(true);

      // Small delay to ensure the #qr-reader div is rendered
      setTimeout(async () => {
        try {
          const html5QrCode = new Html5Qrcode("qr-reader");
          scannerRef.current = html5QrCode;

          await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText) => {
              stopScanner();
              verifyToken(decodedText);
            },
            () => {}
          );
        } catch (innerErr) {
          console.error("Scanner start error:", innerErr);
          setCameraError("Could not start the QR scanner. Please try the manual input below.");
          setScanning(false);
        }
      }, 100);
    } catch (err: any) {
      console.error("Camera error:", err);
      if (err?.name === "NotAllowedError") {
        setCameraError("Camera access was denied. Please allow camera permissions in your browser settings.");
      } else if (err?.name === "NotFoundError") {
        setCameraError("No camera found on this device. Please use the manual input below.");
      } else {
        setCameraError("Could not access the camera. Please use the manual input below.");
      }
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (e) {}
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const isValid = result?.status === "approved";

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Verify a Credential</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Scan a QR code or enter a verification link
          </p>
        </div>

        {/* Camera Scanner */}
        <Card className="border-border overflow-hidden">
          <CardContent className="p-6">
            {!scanning ? (
              <Button
                onClick={startScanner}
                className="w-full h-14 bg-primary text-primary-foreground rounded-xl gap-3 text-base"
                size="lg"
              >
                <Camera className="w-5 h-5" />
                Scan QR Code with Camera
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Scanning...</span>
                  <Button variant="ghost" size="sm" onClick={stopScanner}>
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </div>
                <div id="qr-reader" className="w-full rounded-xl overflow-hidden" />
              </div>
            )}

        {cameraError && (
          <div className="mt-3 text-sm text-destructive">{cameraError}</div>
        )}
        </Card>

        {/* Manual Input */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or enter manually</span>
          </div>
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
