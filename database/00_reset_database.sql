-- Reset Database Script
-- WARNING: This will delete ALL data from the database
-- Use this to start fresh with a clean database

-- Delete all data from tables (in correct order to respect foreign keys)
DELETE FROM audit_logs;
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
DELETE FROM educational_content;

-- Reset sequences (if any)
-- Note: PostgreSQL automatically handles UUID generation, so no sequence reset needed

-- Optionally, delete all users from Supabase Auth
-- Note: This must be done manually in Supabase Dashboard → Authentication → Users
-- Or you can run this in SQL Editor:
-- DELETE FROM auth.users;

-- Verify all tables are empty
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
SELECT 'notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'educational_content', COUNT(*) FROM educational_content;
