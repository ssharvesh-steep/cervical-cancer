-- Fix Fetch Errors and Missing Tables

BEGIN;

-- 1. Create medical_reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.medical_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    report_type TEXT NOT NULL,
    description TEXT,
    uploaded_by UUID REFERENCES public.users(id)
);

-- Enable RLS for medical_reports
ALTER TABLE public.medical_reports ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS policies for medical_reports
DROP POLICY IF EXISTS "Patients can view their own reports" ON public.medical_reports;
CREATE POLICY "Patients can view their own reports"
    ON public.medical_reports FOR SELECT
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Doctors can view relevant reports" ON public.medical_reports;
CREATE POLICY "Doctors can view relevant reports"
    ON public.medical_reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'doctor'
        )
    );

DROP POLICY IF EXISTS "Doctors can insert reports" ON public.medical_reports;
CREATE POLICY "Doctors can insert reports"
    ON public.medical_reports FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'doctor'
        )
    );

-- 3. Fix Users RLS to allow viewing doctor profiles
-- Drop existing policy if it conflicts or is too restrictive just for this check
DROP POLICY IF EXISTS "Anyone can view doctors" ON public.users;

-- Create policy to allow viewing users where role is 'doctor'
CREATE POLICY "Anyone can view doctors"
    ON public.users FOR SELECT
    USING (role = 'doctor' AND is_active = true);


-- 4. Ensure patient_doctors table exists (idempotent check)
CREATE TABLE IF NOT EXISTS public.patient_doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(patient_id, doctor_id)
);

ALTER TABLE public.patient_doctors ENABLE ROW LEVEL SECURITY;

-- Re-apply policies for patient_doctors to be safe
DROP POLICY IF EXISTS "Patients can view their saved doctors" ON public.patient_doctors;
CREATE POLICY "Patients can view their saved doctors"
    ON public.patient_doctors FOR SELECT
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Patients can save doctors" ON public.patient_doctors;
CREATE POLICY "Patients can save doctors"
    ON public.patient_doctors FOR INSERT
    WITH CHECK (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Patients can remove saved doctors" ON public.patient_doctors;
CREATE POLICY "Patients can remove saved doctors"
    ON public.patient_doctors FOR DELETE
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE user_id = auth.uid()
        )
    );

COMMIT;
