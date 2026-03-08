import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, FileText, Eye, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

const AdminApplications = () => {
  const [credentials, setCredentials] = useState<(Tables<"credentials"> & { email?: string; full_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCred, setSelectedCred] = useState<(typeof credentials)[0] | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const fetchCredentials = async () => {
    let query = supabase.from("credentials").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setCredentials(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCredentials();
  }, [filter]);

  const handleReview = async (status: "approved" | "rejected") => {
    if (!selectedCred) return;
    const { error } = await supabase
      .from("credentials")
      .update({ status, admin_notes: adminNotes, verified_at: new Date().toISOString() })
      .eq("id", selectedCred.id);

    if (error) {
      toast.error("Failed to update");
    } else {
      toast.success(`Credential ${status}`);
      setSelectedCred(null);
      setAdminNotes("");
      fetchCredentials();
    }
  };

  const statusColors = {
    pending: "text-yellow-600 bg-yellow-50",
    approved: "text-green-600 bg-green-50",
    rejected: "text-red-600 bg-red-50",
    expired: "text-muted-foreground bg-muted",
    revoked: "text-red-600 bg-red-50",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Applications</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and manage credential applications</p>
        </div>

        <div className="flex gap-2">
          {(["pending", "all", "approved", "rejected"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="rounded-xl capitalize"
            >
              {f}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : credentials.length === 0 ? (
          <Card className="border-dashed border-2 border-border">
            <CardContent className="p-10 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-500/40 mx-auto mb-4" />
              <h3 className="font-serif text-lg text-foreground">No {filter !== "all" ? filter : ""} applications</h3>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {credentials.map((cred) => (
              <Card key={cred.id} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{cred.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {cred.credential_type} • {cred.issuing_authority || "—"} • {new Date(cred.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[cred.status]}`}>
                      {cred.status}
                    </span>
                    {cred.status === "pending" && (
                      <Button size="sm" variant="outline" onClick={() => { setSelectedCred(cred); setAdminNotes(""); }} className="rounded-lg gap-1">
                        <Eye className="w-3.5 h-3.5" /> Review
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedCred} onOpenChange={(open) => !open && setSelectedCred(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Review Application</DialogTitle>
            </DialogHeader>
            {selectedCred && (
              <div className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Title</div>
                    <div className="font-medium text-foreground">{selectedCred.title}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Type</div>
                    <div className="text-foreground">{selectedCred.credential_type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Authority</div>
                    <div className="text-foreground">{selectedCred.issuing_authority || "—"}</div>
                  </div>
                  {selectedCred.description && (
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Description</div>
                      <div className="text-foreground text-sm">{selectedCred.description}</div>
                    </div>
                  )}
                  {selectedCred.document_url && (
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Document</div>
                      <div className="text-accent text-sm">Document attached</div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Admin Notes</div>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes for this decision..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => handleReview("rejected")} variant="outline" className="flex-1 rounded-xl text-destructive hover:text-destructive gap-1">
                    <XCircle className="w-4 h-4" /> Reject
                  </Button>
                  <Button onClick={() => handleReview("approved")} className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminApplications;
