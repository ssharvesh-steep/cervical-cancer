-- Fix Patient Update RLS Policy
-- This script ensures patients can update their own data in the patients table

BEGIN;

-- 1. Enable RLS on patients table (just in case)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- 2. Drop potential existing policies to ensure clean slate for updates
DROP POLICY IF EXISTS "Patients can update their own data" ON patients;
DROP POLICY IF EXISTS "Users can update their own patient data" ON patients;

-- 3. Create the correct policy
CREATE POLICY "Patients can update their own data"
    ON patients
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Ensure Select policy exists too (usually needed for update returning *)
DROP POLICY IF EXISTS "Patients can view their own data" ON patients;
CREATE POLICY "Patients can view their own data"
    ON patients
    FOR SELECT
    USING (auth.uid() = user_id);

COMMIT;
