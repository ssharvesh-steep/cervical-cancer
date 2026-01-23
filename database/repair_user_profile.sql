-- ============================================
-- REPAIR SPECIFIC USER PROFILE
-- ============================================
-- This script repairs the missing database records for a specific user
-- Auth ID: ca079b1d-f0d7-4e5c-955a-94cc37c5d1cc
-- ============================================

BEGIN;

-- Get user data from auth.users
DO $$
DECLARE
    v_user_id UUID := 'ca079b1d-f0d7-4e5c-955a-94cc37c5d1cc';
    v_email TEXT;
    v_full_name TEXT;
    v_role TEXT;
    v_phone TEXT;
BEGIN
    -- Fetch user metadata from auth.users
    SELECT 
        email,
        COALESCE(raw_user_meta_data->>'full_name', 'User'),
        COALESCE(raw_user_meta_data->>'role', 'patient'),
        raw_user_meta_data->>'phone'
    INTO v_email, v_full_name, v_role, v_phone
    FROM auth.users
    WHERE id = v_user_id;

    -- Check if user was found in auth.users
    IF v_email IS NULL THEN
        RAISE EXCEPTION 'User with ID % not found in auth.users', v_user_id;
    END IF;

    -- Insert into public.users if not exists
    INSERT INTO public.users (id, email, full_name, role, phone)
    VALUES (v_user_id, v_email, v_full_name, v_role, v_phone)
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        updated_at = NOW();

    RAISE NOTICE 'User record created/updated for: % (%, %)', v_email, v_full_name, v_role;

    -- If role is patient, create patient record
    IF v_role = 'patient' THEN
        -- Check if patient record already exists
        IF NOT EXISTS (SELECT 1 FROM public.patients WHERE user_id = v_user_id) THEN
            INSERT INTO public.patients (user_id)
            VALUES (v_user_id);
            
            RAISE NOTICE 'Patient record created for user_id: %', v_user_id;
        ELSE
            RAISE NOTICE 'Patient record already exists for user_id: %', v_user_id;
        END IF;
    END IF;

    -- Verify the records were created
    RAISE NOTICE '=== Verification ===';
    RAISE NOTICE 'User exists in public.users: %', EXISTS(SELECT 1 FROM public.users WHERE id = v_user_id);
    
    IF v_role = 'patient' THEN
        RAISE NOTICE 'Patient record exists: %', EXISTS(SELECT 1 FROM public.patients WHERE user_id = v_user_id);
    END IF;
END $$;

COMMIT;

-- Display the created records
SELECT 'User Record' as record_type, id, email, full_name, role, created_at 
FROM public.users 
WHERE id = 'ca079b1d-f0d7-4e5c-955a-94cc37c5d1cc';

SELECT 'Patient Record' as record_type, id, user_id, created_at 
FROM public.patients 
WHERE user_id = 'ca079b1d-f0d7-4e5c-955a-94cc37c5d1cc';
