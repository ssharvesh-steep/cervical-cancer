-- Fix RLS policies to allow doctors to see their connected patients

-- 1. Allow doctors to view the patient_doctors connection table
-- This was missing, causing connectedPatients to return empty
DROP POLICY IF EXISTS "Doctors can view their connected patients" ON patient_doctors;

CREATE POLICY "Doctors can view their connected patients"
    ON patient_doctors FOR SELECT
    USING (
        doctor_id = auth.uid()
    );

-- 2. Allow doctors to view user profiles of patients
-- Doctors could see the 'patients' table but not the 'users' table (names, emails)
DROP POLICY IF EXISTS "Doctors can view all patients" ON users;

CREATE POLICY "Doctors can view all patients"
    ON users FOR SELECT
    USING (
        role = 'patient'
        AND
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );
