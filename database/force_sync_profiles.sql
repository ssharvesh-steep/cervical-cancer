-- Force Sync Profiles (Upsert)

BEGIN;

-- 1. Upsert Users from auth.users to public.users
-- This ensures that if the record exists but is incomplete, it gets updated.
-- If it doesn't exist, it gets created.
INSERT INTO public.users (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'User'),
    COALESCE(raw_user_meta_data->>'role', 'patient')
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;


-- 2. Upsert Patients from public.users to public.patients
-- We use INSERT ... ON CONFLICT DO NOTHING because there's no unique constraint on user_id in the original schema (unless we added it).
-- To be safe, we check for existence first or use the WHERE NOT EXISTS pattern if unique constraint is missing.

-- Let's try to do it safely for each user with role='patient'
INSERT INTO public.patients (user_id)
SELECT id FROM public.users
WHERE role = 'patient'
AND NOT EXISTS (
    SELECT 1 FROM public.patients WHERE user_id = public.users.id
);


-- 3. Verify the sync (optional - just for output)
-- You can run this SELECT separately to see your data
-- SELECT * FROM public.users;

COMMIT;
