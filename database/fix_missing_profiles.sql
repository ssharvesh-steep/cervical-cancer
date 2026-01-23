-- Fix Missing User Profiles and Triggers

BEGIN;

-- 1. Fix the Trigger Function (it had syntax errors)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    
    -- If role is patient, create patient record
    IF COALESCE(NEW.raw_user_meta_data->>'role', 'patient') = 'patient' THEN
        INSERT INTO public.patients (user_id)
        VALUES (NEW.id)
        ON CONFLICT DO NOTHING; -- No unique constraint on patient.user_id yet? fix that too
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Re-create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Sync Missing Users (Backfill public.users from auth.users)
INSERT INTO public.users (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'User'),
    COALESCE(raw_user_meta_data->>'role', 'patient')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);


-- 3. Sync Missing Patients (Backfill public.patients from public.users)
-- Note: schema might define role text, assume 'patient'
INSERT INTO public.patients (user_id)
SELECT id FROM public.users
WHERE role = 'patient'
AND id NOT IN (SELECT user_id FROM public.patients);

COMMIT;
