-- Allow patients (and all authenticated users) to view doctor profiles
-- This is necessary for the "Book Appointment" and "Find Doctor" features to work

BEGIN;

-- Drop existing policy if it conflicts (unlikely to exist specifically for this, but good practice)
DROP POLICY IF EXISTS "Anyone can view doctors" ON users;

-- Create policy to allow viewing users where role is 'doctor'
CREATE POLICY "Anyone can view doctors" ON users FOR SELECT
USING (role = 'doctor' AND is_active = true);

COMMIT;
