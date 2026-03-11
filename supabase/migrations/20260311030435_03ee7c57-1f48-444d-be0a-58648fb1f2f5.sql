-- Add SELECT policy for verifiers to view their own verification logs
CREATE POLICY "Verifiers can view own logs"
ON public.verification_logs
FOR SELECT
TO authenticated
USING (verifier_id = auth.uid());

-- Allow anyone (including anon) to insert verification logs
DROP POLICY IF EXISTS "Verifiers can create logs" ON public.verification_logs;
CREATE POLICY "Anyone can create verification logs"
ON public.verification_logs
FOR INSERT
TO authenticated, anon
WITH CHECK (true);