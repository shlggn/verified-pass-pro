-- Tighten the INSERT policy - only allow if credential_id references a real credential
DROP POLICY IF EXISTS "Anyone can create verification logs" ON public.verification_logs;
CREATE POLICY "Authenticated users can create verification logs"
ON public.verification_logs
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM credentials WHERE id = credential_id)
);