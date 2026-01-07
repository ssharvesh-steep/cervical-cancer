-- Quick Fix for "User Already Exists" Error
-- Run this in Supabase SQL Editor

-- Step 1: Check if the email exists
SELECT 
    'auth.users' as table_name,
    email, 
    created_at,
    confirmed_at
FROM auth.users 
WHERE email = 'ssharvesh316@gmail.com'

UNION ALL

SELECT 
    'public.users' as table_name,
    email,
    created_at,
    NULL as confirmed_at
FROM public.users 
WHERE email = 'ssharvesh316@gmail.com';

-- Step 2: If user exists, delete it (uncomment the lines below)
-- WARNING: This will delete the user account

-- Delete from patients table first (if exists)
-- DELETE FROM public.patients 
-- WHERE user_id IN (
--     SELECT id FROM public.users WHERE email = 'ssharvesh316@gmail.com'
-- );

-- Delete from public.users
-- DELETE FROM public.users WHERE email = 'ssharvesh316@gmail.com';

-- Delete from auth.users (this will cascade to public.users if trigger is working)
-- DELETE FROM auth.users WHERE email = 'ssharvesh316@gmail.com';

-- Step 3: Verify deletion
-- SELECT COUNT(*) as remaining_users
-- FROM auth.users 
-- WHERE email = 'ssharvesh316@gmail.com';
