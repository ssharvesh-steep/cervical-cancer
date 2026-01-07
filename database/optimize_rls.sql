-- Optimize RLS policies by wrapping auth functions in select subqueries
-- This prevents re-evaluation for every row

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Patients can view their own data" ON patients;
DROP POLICY IF EXISTS "Doctors can view all patients" ON patients;
DROP POLICY IF EXISTS "Patients can view their own symptoms" ON symptoms_log;
DROP POLICY IF EXISTS "Patients can insert their own symptoms" ON symptoms_log;
DROP POLICY IF EXISTS "Doctors can view all symptoms" ON symptoms_log;
DROP POLICY IF EXISTS "Users can view their own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Anyone can view educational content" ON educational_content; -- No change needed really but good to be rigorous
DROP POLICY IF EXISTS "Users can view their own appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can view their own medications" ON medications;
DROP POLICY IF EXISTS "Doctors can view all medications" ON medications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

-- Recreate with optimizations

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
