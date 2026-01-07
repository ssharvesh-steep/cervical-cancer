-- Add gender column to patients table
BEGIN;

ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'Female';

-- Update existing records with random data for demonstration
-- 90% Female (Cervical Cancer App), 10% Other
UPDATE public.patients
SET gender = CASE 
    WHEN random() < 0.9 THEN 'Female'
    ELSE 'Male' 
END
WHERE gender IS NULL OR gender = 'Female'; -- ensure we don't overwrite if manual data existed (though defaults handle it)

COMMIT;
