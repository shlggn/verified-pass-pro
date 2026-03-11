import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { share_token } = await req.json();

    if (!share_token) {
      return new Response(
        JSON.stringify({ error: "Missing share_token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Fetch shared credential
    const { data: shareData, error: shareError } = await adminClient
      .from("shared_credentials")
      .select("*")
      .eq("share_token", share_token)
      .maybeSingle();

    if (shareError || !shareData) {
      return new Response(
        JSON.stringify({ error: "not_found", message: "No credential found for this token" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch credential details
    const { data: credData } = await adminClient
      .from("credentials")
      .select("title, credential_type, status, issuing_authority, support_needs, support_summary")
      .eq("id", shareData.credential_id)
      .single();

    // Fetch owner profile (name only)
    const { data: profileData } = await adminClient
      .from("profiles")
      .select("full_name")
      .eq("user_id", shareData.user_id)
      .single();

    // Recompute integrity hash - normalize timestamps to match generation format (ISO with Z)
    const normalizeTs = (ts: string) => new Date(ts).toISOString();
    const payload = `${shareData.credential_id}|${shareData.user_id}|${shareData.organization_name}|${normalizeTs(shareData.created_at)}|${normalizeTs(shareData.expires_at)}|${shareData.share_token}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(payload));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const recomputedHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const hashValid = recomputedHash === shareData.integrity_hash;

    // Determine status
    let status = "valid";
    if (shareData.is_revoked) status = "revoked";
    else if (new Date(shareData.expires_at) < new Date()) status = "expired";
    else if (credData?.status !== "approved") status = "invalid";

    // Log the verification using service role (bypasses RLS)
    const authHeader = req.headers.get("Authorization");
    let verifierId = null;
    if (authHeader) {
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      if (user) verifierId = user.id;
    }

    await adminClient.from("verification_logs").insert({
      credential_id: shareData.credential_id,
      verifier_id: verifierId,
      result: status === "valid" ? "valid" : "invalid",
      verification_method: "shared_link",
      verifier_organization: shareData.organization_name,
    });

    // Count total verifications for this credential (blockchain audit trail)
    const { count } = await adminClient
      .from("verification_logs")
      .select("*", { count: "exact", head: true })
      .eq("credential_id", shareData.credential_id);

    // Get recent verification chain
    const { data: recentVerifications } = await adminClient
      .from("verification_logs")
      .select("id, created_at, verification_method, result, verifier_organization")
      .eq("credential_id", shareData.credential_id)
      .order("created_at", { ascending: false })
      .limit(5);

    return new Response(
      JSON.stringify({
        share: {
          organization_name: shareData.organization_name,
          expires_at: shareData.expires_at,
          created_at: shareData.created_at,
          integrity_hash: shareData.integrity_hash,
          is_revoked: shareData.is_revoked,
        },
        credential: credData || null,
        holder_name: profileData?.full_name || null,
        hash_valid: hashValid,
        status,
        blockchain: {
          total_verifications: count || 0,
          recent_chain: recentVerifications || [],
          block_hash: shareData.integrity_hash,
          previous_hash: recomputedHash === shareData.integrity_hash ? "genesis" : "mismatch",
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
