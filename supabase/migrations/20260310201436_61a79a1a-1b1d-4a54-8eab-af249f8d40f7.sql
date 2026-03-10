
-- Create shared_credentials table
CREATE TABLE public.shared_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id uuid NOT NULL REFERENCES public.credentials(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  organization_name text NOT NULL,
  share_token uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  expires_at timestamptz NOT NULL,
  integrity_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_revoked boolean NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.shared_credentials ENABLE ROW LEVEL SECURITY;

-- Owners can view their own shares
CREATE POLICY "Users can view own shares"
ON public.shared_credentials FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Owners can insert their own shares
CREATE POLICY "Users can create own shares"
ON public.shared_credentials FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Owners can update (revoke) their own shares
CREATE POLICY "Users can update own shares"
ON public.shared_credentials FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Anyone can view by share_token (for public verification)
CREATE POLICY "Anyone can verify by share token"
ON public.shared_credentials FOR SELECT
TO anon, authenticated
USING (true);

-- Admins can view all
CREATE POLICY "Admins can view all shares"
ON public.shared_credentials FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
