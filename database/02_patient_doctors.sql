-- Create patient_doctors table to store saved doctors
CREATE TABLE IF NOT EXISTS patient_doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(patient_id, doctor_id)
);

-- Enable RLS
ALTER TABLE patient_doctors ENABLE ROW LEVEL SECURITY;

-- Policies
-- Patients can view their own saved doctors
CREATE POLICY "Patients can view their saved doctors"
    ON patient_doctors FOR SELECT
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = auth.uid()
        )
    );

-- Patients can add saved doctors
CREATE POLICY "Patients can save doctors"
    ON patient_doctors FOR INSERT
    WITH CHECK (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = auth.uid()
        )
    );

-- Patients can remove saved doctors
CREATE POLICY "Patients can remove saved doctors"
    ON patient_doctors FOR DELETE
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = auth.uid()
        )
    );
