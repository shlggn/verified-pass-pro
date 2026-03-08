import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Upload, Clock, CheckCircle2, XCircle, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

const credentialTypes = [
  "Disability Certificate",
  "Medical Assessment",
  "Government ID (PwD Card)",
  "Employment Support Letter",
  "Educational Accommodation",
  "Mobility Permit",
  "Other",
];

const statusConfig = {
  pending: { color: "text-yellow-600 bg-yellow-50", icon: Clock, label: "Pending" },
  approved: { color: "text-green-600 bg-green-50", icon: CheckCircle2, label: "Approved" },
  rejected: { color: "text-red-600 bg-red-50", icon: XCircle, label: "Rejected" },
  expired: { color: "text-muted-foreground bg-muted", icon: Clock, label: "Expired" },
  revoked: { color: "text-red-600 bg-red-50", icon: XCircle, label: "Revoked" },
};

const Credentials = () => {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Tables<"credentials">[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [credType, setCredType] = useState("");
  const [description, setDescription] = useState("");
  const [authority, setAuthority] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchCredentials = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("credentials")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setCredentials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCredentials();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    let documentUrl: string | null = null;

    // Upload document if provided
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("credential-documents")
        .upload(path, file);
      if (uploadError) {
        toast.error("Failed to upload document");
        setSubmitting(false);
        return;
      }
      documentUrl = path;
    }

    const { error } = await supabase.from("credentials").insert({
      user_id: user.id,
      title,
      credential_type: credType,
      description,
      issuing_authority: authority,
      document_url: documentUrl,
    });

    if (error) {
      toast.error("Failed to submit credential");
    } else {
      toast.success("Credential submitted for review!");
      setDialogOpen(false);
      setTitle("");
      setCredType("");
      setDescription("");
      setAuthority("");
      setFile(null);
      fetchCredentials();
    }
    setSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif text-foreground">My Credentials</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your disability verification documents</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground gap-2 rounded-xl">
                <Plus className="w-4 h-4" /> Add Credential
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">Submit a New Credential</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label className="text-xs uppercase tracking-wider font-medium">Credential Type</Label>
                  <Select value={credType} onValueChange={setCredType} required>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {credentialTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-wider font-medium">Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. PwD Certificate 2024" required className="mt-1.5" />
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-wider font-medium">Issuing Authority</Label>
                  <Input value={authority} onChange={(e) => setAuthority(e.target.value)} placeholder="e.g. District Medical Board" className="mt-1.5" />
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-wider font-medium">Description (optional)</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Any additional details..." className="mt-1.5" rows={3} />
                </div>

                <div>
                  <Label className="text-xs uppercase tracking-wider font-medium">Supporting Document</Label>
                  <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-6 text-center">
                    {file ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{file.name}</span>
                        <button type="button" onClick={() => setFile(null)} className="text-muted-foreground hover:text-foreground">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                        <label className="text-sm text-accent font-medium cursor-pointer hover:underline">
                          Choose file
                          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG, DOC up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-xl h-11">
                  {submitting ? "Submitting..." : "Submit for Verification"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : credentials.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="p-16 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-serif text-xl text-foreground mb-2">No credentials yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Submit your disability credentials to get verified</p>
              <Button onClick={() => setDialogOpen(true)} className="bg-primary text-primary-foreground gap-2 rounded-xl">
                <Plus className="w-4 h-4" /> Add Your First Credential
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {credentials.map((cred, i) => {
              const config = statusConfig[cred.status];
              const StatusIcon = config.icon;
              return (
                <motion.div key={cred.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{cred.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {cred.credential_type} • {cred.issuing_authority || "—"} • {new Date(cred.created_at).toLocaleDateString()}
                          </div>
                          {cred.admin_notes && (
                            <div className="text-xs text-muted-foreground mt-1 italic">Note: {cred.admin_notes}</div>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 ${config.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
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
    </DashboardLayout>
  );
};

export default Credentials;
