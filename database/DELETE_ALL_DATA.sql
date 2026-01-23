-- ⚠️ COMPLETE DATABASE DELETION SCRIPT ⚠️
-- This will DELETE ALL DATA from your database including auth users
-- USE WITH EXTREME CAUTION

-- Step 1: Delete all data from tables (in correct order to respect foreign keys)
DELETE FROM audit_logs;
DELETE FROM medical_reports;
DELETE FROM educational_content;
DELETE FROM notifications;
DELETE FROM messages;
DELETE FROM appointments;
DELETE FROM symptoms_log;
DELETE FROM medications;
DELETE FROM treatments;
DELETE FROM diagnoses;
DELETE FROM screening_records;
DELETE FROM patient_medical_history;
DELETE FROM patients;
DELETE FROM users;

-- Step 2: Delete all authentication users
-- This removes users from Supabase Auth
DELETE FROM auth.users;

-- Step 3: Verify all tables are empty
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'patients', COUNT(*) FROM patients
UNION ALL
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments
UNION ALL
SELECT 'symptoms_log', COUNT(*) FROM symptoms_log
UNION ALL
SELECT 'medications', COUNT(*) FROM medications
UNION ALL
SELECT 'treatments', COUNT(*) FROM treatments
UNION ALL
SELECT 'diagnoses', COUNT(*) FROM diagnoses
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'educational_content', COUNT(*) FROM educational_content
UNION ALL
SELECT 'medical_reports', COUNT(*) FROM medical_reports
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs
UNION ALL
SELECT 'auth.users', COUNT(*) FROM auth.users;
