-- Run this in your Supabase SQL Editor to fix the "User Profile Missing" error

-- 1. Insert the missing user into public.users
INSERT INTO public.users (id, email, full_name, role)
VALUES (
    '89832f75-ff64-432f-b258-45d6849ebb19', -- The ID from your error message
    'patient@example.com', -- Placeholder email (will be updated on next login if different)
    'Patient Name',        -- Placeholder name
    'patient'              -- Role
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create the patient record if it doesn't exist
-- Using WHERE NOT EXISTS because there is no unique constraint on user_id to use ON CONFLICT
INSERT INTO public.patients (user_id)
SELECT '89832f75-ff64-432f-b258-45d6849ebb19'
WHERE NOT EXISTS (
    SELECT 1 FROM public.patients WHERE user_id = '89832f75-ff64-432f-b258-45d6849ebb19'
);

-- 3. Ensure RLS policies allow the user to see their own data
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
