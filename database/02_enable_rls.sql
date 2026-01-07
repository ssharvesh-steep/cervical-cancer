-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_medical_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE screening_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
    ON users FOR SELECT
    USING ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
    ON users FOR UPDATE
    USING ((select auth.uid()) = id);

-- Patients policies
CREATE POLICY "Patients can view their own data"
    ON patients FOR SELECT
    USING (user_id = (select auth.uid()));

CREATE POLICY "Doctors can view all patients"
    ON patients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = (select auth.uid())
            AND users.role = 'doctor'
        )
    );

-- Symptoms log policies
CREATE POLICY "Patients can view their own symptoms"
    ON symptoms_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM patients
            WHERE patients.id = symptoms_log.patient_id
            AND patients.user_id = (select auth.uid())
        )
    );

CREATE POLICY "Patients can insert their own symptoms"
    ON symptoms_log FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM patients
            WHERE patients.id = patient_id
            AND patients.user_id = (select auth.uid())
        )
    );

CREATE POLICY "Doctors can view all symptoms"
    ON symptoms_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = (select auth.uid())
            AND users.role = 'doctor'
        )
    );

-- Messages policies
CREATE POLICY "Users can view their own messages"
    ON messages FOR SELECT
    USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    WITH CHECK (sender_id = (select auth.uid()));

CREATE POLICY "Users can update their own messages"
    ON messages FOR UPDATE
    USING (sender_id = (select auth.uid()) OR receiver_id = (select auth.uid()));

-- Educational content policies (public read)
CREATE POLICY "Anyone can view educational content"
    ON educational_content FOR SELECT
    USING (true);

-- Appointments policies
CREATE POLICY "Users can view their own appointments"
    ON appointments FOR SELECT
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE user_id = (select auth.uid())
        )
        OR doctor_id = (select auth.uid())
    );

-- Medications policies
CREATE POLICY "Patients can view their own medications"
    ON medications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM patients
            WHERE patients.id = medications.patient_id
            AND patients.user_id = (select auth.uid())
        )
    );

CREATE POLICY "Doctors can view all medications"
    ON medications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = (select auth.uid())
            AND users.role = 'doctor'
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (user_id = (select auth.uid()));
