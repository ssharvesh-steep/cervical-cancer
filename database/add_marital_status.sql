-- Add missing marital_status column to patients table

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'marital_status') THEN
        ALTER TABLE patients ADD COLUMN marital_status TEXT CHECK (marital_status IN ('Single', 'Married', 'Divorced', 'Widowed'));
    END IF;
END $$;

-- Verify columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'patients';
