

# Temporary Credential Sharing with Blockchain Verification

## What We're Building

When an individual shares a credential, instead of just generating a static QR code, they'll be able to:
1. **Input the recipient organization name** (e.g., "Acme Corp HR")
2. **Set an expiry duration** (e.g., 24 hours, 7 days, 30 days)
3. **Generate a temporary, tamper-proof share token** with a blockchain-style hash for integrity verification

The verifier sees the org name, expiry countdown, and a hash signature proving the credential hasn't been tampered with.

## How It Works

```text
Individual selects credential
        │
        ▼
┌──────────────────────────┐
│  Enter Org Name          │
│  Select Expiry Duration  │
│  [Generate Temp Cert]    │
└──────────┬───────────────┘
           │
           ▼
  New row in `shared_credentials`
  with SHA-256 hash of payload
           │
           ▼
  QR code → /verify/share/{share_token}
           │
           ▼
  Verifier sees: credential info,
  org name, expiry, hash integrity ✓
```

## Blockchain-Style Integrity

Since true on-chain deployment is complex and costly, we'll implement a **blockchain-inspired cryptographic verification** system:
- Each shared credential gets a **SHA-256 hash** computed from (credential_id + user_id + org_name + created_at + expiry) via a backend function
- The hash is stored and displayed as a "verification signature"
- On the verify page, the hash is **recomputed and compared** to prove no data was altered
- This gives tamper-evidence without needing an actual blockchain network

## Database Changes

New table: `shared_credentials`
- `id` (uuid, PK)
- `credential_id` (uuid, FK to credentials)
- `user_id` (uuid, owner)
- `organization_name` (text, required)
- `share_token` (uuid, unique, for the verification URL)
- `expires_at` (timestamptz, required)
- `integrity_hash` (text, SHA-256 signature)
- `created_at` (timestamptz)
- `is_revoked` (boolean, default false)

RLS: owners can insert/select/update their own shares; anyone can select by share_token (for verification).

## Edge Function

`generate-share-hash` -- computes the SHA-256 integrity hash server-side using the service role key, so the hash cannot be forged client-side.

## UI Changes

1. **ShareQR page** -- After selecting a credential, show a form with org name input and expiry selector (24h / 7 days / 30 days / custom). On submit, call the edge function, get back the share token, and display the QR code with the new temporary link.

2. **New verification route** `/verify/share/:shareToken` -- Shows credential validity, organization it was shared with, time remaining, and the integrity hash with a visual "verified" indicator.

3. **Share history list** -- Below the generator, show previously generated shares with status (active/expired/revoked) and a revoke button.

## Files to Create/Modify

| File | Action |
|------|--------|
| Migration SQL | Create `shared_credentials` table + RLS |
| `supabase/functions/generate-share-hash/index.ts` | Edge function for hash generation |
| `src/pages/ShareQR.tsx` | Add org name + expiry form, share history |
| `src/pages/VerifySharedCredential.tsx` | New page for temp credential verification |
| `src/App.tsx` | Add route for `/verify/share/:shareToken` |

