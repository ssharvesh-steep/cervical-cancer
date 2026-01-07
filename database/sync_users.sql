-- Fix missing users in public table
INSERT INTO public.users (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'User'),
    COALESCE(raw_user_meta_data->>'role', 'patient')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);

-- Fix missing patients
INSERT INTO public.patients (user_id)
SELECT id FROM public.users 
WHERE role = 'patient' 
AND id NOT IN (SELECT user_id FROM public.patients);
