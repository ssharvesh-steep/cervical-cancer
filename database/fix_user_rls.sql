-- Drop the policy if it exists to avoid "already exists" errors
DROP POLICY IF EXISTS "Doctors can view all users" ON users;

-- Create the policy to allow doctors to see patient lists
CREATE POLICY "Doctors can view all users"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users AS u
            WHERE u.id = auth.uid()
            AND u.role = 'doctor'
        )
    );
