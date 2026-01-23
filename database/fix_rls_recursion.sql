-- Fix RLS Infinite Recursion on Users Table

BEGIN;

-- 1. Drop ALL existing policies on the 'users' table to ensure we remove the recursive one.
-- We must be thorough here as we don't know the exact name of the bad policy.
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Anyone can view doctors" ON public.users;
DROP POLICY IF EXISTS "Doctors can view all patients" ON public.users;
DROP POLICY IF EXISTS "Doctors can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin view all" ON public.users;
DROP POLICY IF EXISTS "public_view" ON public.users;
DROP POLICY IF EXISTS "Doctors can view patients" ON public.users;

-- 2. Re-create SAFE policies

-- Policy 1: Users can view their own profile
-- No recursion: compares auth.uid() (context) with id (row).
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Policy 3: Everyone can view active doctors
-- No recursion: compares 'role' (row column) with literal string.
-- This allows listing doctors for appointments.
CREATE POLICY "Anyone can view doctors"
    ON public.users FOR SELECT
    USING (role = 'doctor' AND is_active = true);

-- Policy 4: Doctors can view patients
-- SAFETY: We use auth.jwt() to check the *viewer's* role, instead of querying the users table.
-- Querying the users table for the viewer's role would cause the recursion.
CREATE POLICY "Doctors can view patients"
    ON public.users FOR SELECT
    USING (
        role = 'patient' 
        AND 
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'doctor'
    );

COMMIT;
