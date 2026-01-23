DO $$
DECLARE
    v_patient_id UUID;
    v_doctor_id UUID;
BEGIN
    -- 1. Find a doctor
    SELECT id INTO v_doctor_id FROM users WHERE role = 'doctor' LIMIT 1;
    
    -- 2. Find a patient
    SELECT id INTO v_patient_id FROM patients LIMIT 1;

    -- 3. Validation
    IF v_doctor_id IS NULL THEN
        RAISE EXCEPTION 'No doctor found in "users" table. Please register a doctor first.';
    END IF;

    IF v_patient_id IS NULL THEN
        RAISE EXCEPTION 'No patient found in "patients" table. Please register a patient first.';
    END IF;

    -- 4. Insert Sample Report
    -- Note: The file_path points to a non-existent file in storage. 
    -- This is just for UI demonstration purposes.
    INSERT INTO medical_reports (
        patient_id, 
        doctor_id, 
        file_name, 
        file_path, 
        file_type, 
        report_type, 
        description,
        created_at
    )
    VALUES (
        v_patient_id,
        v_doctor_id,
        'Sample_Lab_Results_Jan2026.pdf',
        'sample/lab_results_demo.pdf', -- Dummy path
        'application/pdf',
        'Lab Report',
        'Comprehensive blood work analysis (Demo Report)',
        NOW()
    );
    
    RAISE NOTICE 'Successfully inserted sample report for Patient % uploaded by Doctor %', v_patient_id, v_doctor_id;

END $$;
