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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user with anon client
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { credential_id, organization_name, expires_at } = await req.json();

    if (!credential_id || !organization_name || !expires_at) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: credential_id, organization_name, expires_at" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate org name
    if (typeof organization_name !== "string" || organization_name.trim().length === 0 || organization_name.length > 200) {
      return new Response(
        JSON.stringify({ error: "Invalid organization name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Verify the credential belongs to the user and is approved
    const { data: credential, error: credError } = await adminClient
      .from("credentials")
      .select("id, user_id, title, credential_type, status")
      .eq("id", credential_id)
      .eq("user_id", user.id)
      .eq("status", "approved")
      .single();

    if (credError || !credential) {
      return new Response(
        JSON.stringify({ error: "Credential not found or not approved" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const shareToken = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Compute SHA-256 integrity hash
    const payload = `${credential_id}|${user.id}|${organization_name.trim()}|${createdAt}|${expires_at}|${shareToken}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(payload));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const integrityHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    // Insert shared credential
    const { data: shared, error: insertError } = await adminClient
      .from("shared_credentials")
      .insert({
        credential_id,
        user_id: user.id,
        organization_name: organization_name.trim(),
        share_token: shareToken,
        expires_at,
        integrity_hash: integrityHash,
        created_at: createdAt,
      })
      .select()
      .single();

    if (insertError) {
      return new Response(
        JSON.stringify({ error: "Failed to create share", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        share_token: shareToken,
        integrity_hash: integrityHash,
        expires_at,
        organization_name: organization_name.trim(),
        created_at: createdAt,
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
