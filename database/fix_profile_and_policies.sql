-- COMPREHENSIVE FIX (Data + Permissions)
-- Run this script to fix the "User Profile Missing" error completely.

BEGIN;

-- 1. Insert the missing user (Safety check included)
INSERT INTO public.users (id, email, full_name, role)
VALUES (
    '89832f75-ff64-432f-b258-45d6849ebb19',
    'patient@example.com',
    'Patient Name',
    'patient'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert the missing patient record (Safety check included)
INSERT INTO public.patients (user_id)
SELECT '89832f75-ff64-432f-b258-45d6849ebb19'
WHERE NOT EXISTS (
    SELECT 1 FROM public.patients WHERE user_id = '89832f75-ff64-432f-b258-45d6849ebb19'
);

-- 3. FIX PERMISSIONS (RLS Policies)
-- If these policies are missing, you won't see the data even if it exists!

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Drop potentially conflicting old policies to be safe
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Patients can view their own data" ON patients;

-- Re-create the essential policies
CREATE POLICY "Users can view their own profile" ON users 
FOR SELECT USING ((select auth.uid()) = id);

CREATE POLICY "Patients can view their own data" ON patients 
FOR SELECT USING ((select auth.uid()) = user_id);

COMMIT;
