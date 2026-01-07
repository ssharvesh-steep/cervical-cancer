-- MASTER FIX SCRIPT (v2 - Fixes Recursion)
-- This script fixes the "infinite recursion" error (42P17) by avoiding self-referencing queries in policies.
-- It uses JWT metadata for role checks instead of querying the 'users' table.

BEGIN;

-- 1. SECURITY FIX: Mutable search_path in handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
    );
    
    -- If role is patient, create patient record
    IF COALESCE(NEW.raw_user_meta_data->>'role', 'patient') = 'patient' THEN
        INSERT INTO public.patients (user_id)
        VALUES (NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. SYNC MISSING USERS (Self-Repair)
INSERT INTO public.users (id, email, full_name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'User'),
    COALESCE(raw_user_meta_data->>'role', 'patient')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);

INSERT INTO public.patients (user_id)
SELECT id FROM public.users 
WHERE role = 'patient' 
AND id NOT IN (SELECT user_id FROM public.patients);


-- 3. RESET & OPTIMIZE RLS (Fix Recursion using JWT)

-- Drop ALL existing policies to ensure clean slate
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Doctors can view all users" ON users;
DROP POLICY IF EXISTS "Doctors can update all users" ON users; -- Added this
DROP POLICY IF EXISTS "Anyone can view doctors" ON users; -- Added this because we create it later
DROP POLICY IF EXISTS "Patients can view their own data" ON patients;
DROP POLICY IF EXISTS "Doctors can view all patients" ON patients;
DROP POLICY IF EXISTS "Doctors can update all patients" ON patients;
DROP POLICY IF EXISTS "Patients can view their own symptoms" ON symptoms_log;
DROP POLICY IF EXISTS "Patients can insert their own symptoms" ON symptoms_log;
DROP POLICY IF EXISTS "Doctors can view all symptoms" ON symptoms_log;
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Anyone can view educational content" ON educational_content;
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can insert their own appointments" ON appointments;
DROP POLICY IF EXISTS "Doctors can update their appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can view their own medications" ON medications;
DROP POLICY IF EXISTS "Doctors can view all medications" ON medications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

-- Recreate Policies using JWT Role Check (Fast & Safe)

-- Users: View own profile OR Doctors view all
CREATE POLICY "Users can view their own profile" ON users FOR SELECT 
USING (
    (select auth.uid()) = id 
    OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'doctor'
);

CREATE POLICY "Users can update their own profile" ON users FOR UPDATE 
USING ((select auth.uid()) = id);


CREATE POLICY "Doctors can update all users" ON users FOR UPDATE 
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'doctor');

CREATE POLICY "Anyone can view doctors" ON users FOR SELECT
USING (role = 'doctor' AND is_active = true);


-- Patients: View own data OR Doctors view all
CREATE POLICY "Patients can view their own data" ON patients FOR SELECT 
USING ((select auth.uid()) = user_id);

CREATE POLICY "Doctors can view all patients" ON patients FOR SELECT 
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'doctor');

CREATE POLICY "Doctors can update all patients" ON patients FOR UPDATE 
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'doctor');

-- Symptoms
CREATE POLICY "Patients can view their own symptoms" ON symptoms_log FOR SELECT 
USING (EXISTS (SELECT 1 FROM patients WHERE patients.id = symptoms_log.patient_id AND patients.user_id = (select auth.uid())));

CREATE POLICY "Patients can insert their own symptoms" ON symptoms_log FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM patients WHERE patients.id = patient_id AND patients.user_id = (select auth.uid())));

CREATE POLICY "Doctors can view all symptoms" ON symptoms_log FOR SELECT 
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'doctor');

-- Messages
CREATE POLICY "Users can view their own messages" ON messages FOR SELECT 
USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

CREATE POLICY "Users can send messages" ON messages FOR INSERT 
WITH CHECK (sender_id = (select auth.uid()));

CREATE POLICY "Users can update their own messages" ON messages FOR UPDATE 
USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

-- Content
CREATE POLICY "Anyone can view educational content" ON educational_content FOR SELECT 
USING (true);

-- Appointments
-- Appointments
CREATE POLICY "Users can view their own appointments" ON appointments FOR SELECT 
USING (
    patient_id IN (SELECT id FROM patients WHERE user_id = (select auth.uid())) 
    OR 
    doctor_id = (select auth.uid())
);

CREATE POLICY "Patients can insert their own appointments" ON appointments FOR INSERT 
WITH CHECK (
    patient_id IN (SELECT id FROM patients WHERE user_id = (select auth.uid()))
);

CREATE POLICY "Doctors can update their appointments" ON appointments FOR UPDATE
USING (doctor_id = (select auth.uid()));

CREATE POLICY "Patients can view their own medications" ON medications FOR SELECT 
USING (EXISTS (SELECT 1 FROM patients WHERE patients.id = medications.patient_id AND patients.user_id = (select auth.uid())));

CREATE POLICY "Doctors can view all medications" ON medications FOR SELECT 
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'doctor');

-- Notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT 
USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE 
USING (user_id = (select auth.uid()));

COMMIT;
