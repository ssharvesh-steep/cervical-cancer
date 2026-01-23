-- ============================================
-- FIX PROFILE UPDATE - Add Missing RLS Policy
-- ============================================
-- This script adds the missing UPDATE policy for patients
-- to update their own profile data
-- ============================================

BEGIN;

-- Add policy for patients to update their own data
CREATE POLICY "Patients can update their own data" ON patients FOR UPDATE 
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

COMMIT;

-- Verify the policy was created
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'patients'
AND cmd = 'UPDATE'
ORDER BY policyname;
