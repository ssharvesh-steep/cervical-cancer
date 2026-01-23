DO $$
DECLARE
    v_patient_id UUID;
BEGIN
    -- 1. Find a patient
    SELECT id INTO v_patient_id FROM patients LIMIT 1;

    -- 2. Validation
    IF v_patient_id IS NULL THEN
        RAISE EXCEPTION 'No patient found in "patients" table. Please register a patient first.';
    END IF;

    -- 3. Insert Sample Symptoms for the last few days
    
    -- Today (Moderate)
    INSERT INTO symptoms_log (patient_id, log_date, pain_level, fatigue_level, bleeding, notes, symptoms)
    VALUES (v_patient_id, CURRENT_DATE, 5, 4, false, 'Feeling a bit tired today.', '{}');

    -- Yesterday (High pain)
    INSERT INTO symptoms_log (patient_id, log_date, pain_level, fatigue_level, bleeding, notes, symptoms)
    VALUES (v_patient_id, CURRENT_DATE - INTERVAL '1 day', 7, 8, true, 'Experiencing some discomfort.', '{}');

    -- 2 days ago (Low)
    INSERT INTO symptoms_log (patient_id, log_date, pain_level, fatigue_level, bleeding, notes, symptoms)
    VALUES (v_patient_id, CURRENT_DATE - INTERVAL '2 days', 2, 3, false, 'Feeling much better.', '{}');

    -- 3 days ago (High fatigue)
    INSERT INTO symptoms_log (patient_id, log_date, pain_level, fatigue_level, bleeding, notes, symptoms)
    VALUES (v_patient_id, CURRENT_DATE - INTERVAL '3 days', 3, 9, false, 'Extremely exhausted.', '{}');

    RAISE NOTICE 'Successfully inserted sample symptom logs for Patient %', v_patient_id;

END $$;
