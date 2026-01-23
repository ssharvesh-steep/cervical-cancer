-- ============================================
-- FIX RLS SECURITY VULNERABILITIES
-- ============================================
-- This script fixes the security issue where RLS policies
-- use user_metadata (which users can edit) instead of
-- the protected users table for role verification.
--
-- Run this in Supabase SQL Editor to fix the warnings.
-- ============================================

BEGIN;

-- Drop all insecure policies that use user_metadata
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Doctors can view all users" ON users;
DROP POLICY IF EXISTS "Doctors can update all users" ON users;
DROP POLICY IF EXISTS "Anyone can view doctors" ON users;
DROP POLICY IF EXISTS "Patients can view their own data" ON patients;
DROP POLICY IF EXISTS "Doctors can view all patients" ON patients;
DROP POLICY IF EXISTS "Doctors can update all patients" ON patients;
DROP POLICY IF EXISTS "Patients can view their own symptoms" ON symptoms_log;
DROP POLICY IF EXISTS "Patients can insert their own symptoms" ON symptoms_log;
DROP POLICY IF EXISTS "Doctors can view all symptoms" ON symptoms_log;
DROP POLICY IF EXISTS "Patients can view their own medications" ON medications;
DROP POLICY IF EXISTS "Doctors can view all medications" ON medications;

-- ============================================
-- SECURE POLICIES - Using users table
-- ============================================

-- Users Table Policies
-- ------------------------------------

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Doctors can view all users (SECURE - checks users table)
CREATE POLICY "Doctors can view all users"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

-- Doctors can update all users (SECURE - checks users table)
CREATE POLICY "Doctors can update all users"
    ON users FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

-- Anyone can view active doctors (for patient to find doctors)
CREATE POLICY "Anyone can view doctors"
    ON users FOR SELECT
    USING (role = 'doctor' AND is_active = true);

-- Patients Table Policies
-- ------------------------------------

-- Patients can view their own data
CREATE POLICY "Patients can view their own data"
    ON patients FOR SELECT
    USING (user_id = auth.uid());

-- Doctors can view all patients (SECURE - checks users table)
CREATE POLICY "Doctors can view all patients"
    ON patients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

-- Doctors can update all patients (SECURE - checks users table)
CREATE POLICY "Doctors can update all patients"
    ON patients FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

-- Symptoms Log Policies
-- ------------------------------------

-- Patients can view their own symptoms
CREATE POLICY "Patients can view their own symptoms"
    ON symptoms_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM patients
            WHERE patients.id = symptoms_log.patient_id
            AND patients.user_id = auth.uid()
        )
    );

-- Patients can insert their own symptoms
CREATE POLICY "Patients can insert their own symptoms"
    ON symptoms_log FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM patients
            WHERE patients.id = patient_id
            AND patients.user_id = auth.uid()
        )
    );

-- Doctors can view all symptoms (SECURE - checks users table)
CREATE POLICY "Doctors can view all symptoms"
    ON symptoms_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

-- Medications Policies
-- ------------------------------------

-- Patients can view their own medications
CREATE POLICY "Patients can view their own medications"
    ON medications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM patients
            WHERE patients.id = medications.patient_id
            AND patients.user_id = auth.uid()
        )
    );

-- Doctors can view all medications (SECURE - checks users table)
CREATE POLICY "Doctors can view all medications"
    ON medications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'doctor'
        )
    );

COMMIT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the policies are working correctly

-- Check that policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('users', 'patients', 'symptoms_log', 'medications')
ORDER BY tablename, policyname;

-- Verify no policies reference user_metadata
-- (This should return 0 rows)
SELECT tablename, policyname, qual
FROM pg_policies
WHERE schemaname = 'public'
AND (qual::text LIKE '%user_metadata%' OR with_check::text LIKE '%user_metadata%');
