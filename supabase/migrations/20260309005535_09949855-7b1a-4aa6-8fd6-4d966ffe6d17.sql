-- Allow anyone to verify credentials by qr_code_token (public verification lookup)
-- This is needed so verifiers can look up credentials they don't own
CREATE POLICY "Anyone can verify credentials by token"
ON public.credentials
FOR SELECT
USING (qr_code_token IS NOT NULL);