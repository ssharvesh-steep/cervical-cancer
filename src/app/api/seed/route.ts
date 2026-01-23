import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    const supabaseAdmin = createAdminClient()

    if (!supabaseAdmin) {
        return NextResponse.json({
            error: 'Admin client could not be initialized. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local'
        }, { status: 500 })
    }

    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()

    // Safety check: Don't seed if we already have a lot of users to prevent duplicates spam
    if (users && users.length > 100) {
        return NextResponse.json({
            message: 'Database appears to be already populated (100+ users). Skipping seed.'
        })
    }

    // Generate 50 mock patients with diverse names (including Tamil names)
    const firstNames = [
        'Priya', 'Lakshmi', 'Meera', 'Kavitha', 'Anjali', 'Divya', 'Shanti', 'Malini', 'Rani', 'Kamala',
        'Mary', 'Jennifer', 'Sarah', 'Patricia', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Karen',
        'Deepa', 'Sushma', 'Radha', 'Geetha', 'Nithya', 'Vidya', 'Uma', 'Latha', 'Revathi', 'Swathi'
    ];
    const lastNames = [
        'Kumar', 'Devi', 'Lakshmi', 'Raman', 'Krishnan', 'Subramanian', 'Iyer', 'Nair', 'Menon', 'Pillai',
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Sharma', 'Patel', 'Reddy', 'Rao', 'Naidu', 'Murthy', 'Srinivasan', 'Venkatesh', 'Raghavan', 'Chandran'
    ];

    const mockPatients = [];
    const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    
    for (let i = 0; i < 50; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const birthYear = 1970 + Math.floor(Math.random() * 40); // Ages 25-65
        const birthMonth = Math.floor(Math.random() * 12);
        const birthDay = Math.floor(Math.random() * 28) + 1;
        
        mockPatients.push({
            name: `${firstName} ${lastName}`,
            email: `patient.test.${i + 1}@example.com`, // Ensure unique emails
            phone: `+91-${9000000000 + i}`, // Indian phone format
            dateOfBirth: new Date(birthYear, birthMonth, birthDay).toISOString().split('T')[0],
            bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
            emergencyContact: `Emergency Contact ${i + 1}`,
            emergencyPhone: `+91-${8000000000 + i}`
        });
    }

    const mockDoctors = [
        { name: 'Dr. Jennifer White', email: 'dr.white@example.com' },
        { name: 'Dr. Richard Harris', email: 'dr.harris@example.com' },
    ]

    const createdPatients = []
    const createdDoctors = []

    // Create Patients
    for (const patient of mockPatients) {
        // Check if exists
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', patient.email)
            .single()

        if (!existingUser) {
            const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
                email: patient.email,
                password: 'password123',
                email_confirm: true,
                user_metadata: {
                    full_name: patient.name,
                    role: 'patient',
                    phone: patient.phone
                }
            })
            if (user.user) {
                createdPatients.push(user.user)

                // Explicitly create public.patients record
                // We assume public.users is handled by a trigger, but patients might not be
                // Let's verify if user exists in public.users first (give it a ms if trigger based) could be race condition
                // But simplified: just try inserting into patients. using user.user.id

                // Wait a bit for trigger to create user record
                await new Promise(resolve => setTimeout(resolve, 100))

                // Update user phone in users table
                await supabaseAdmin
                    .from('users')
                    .update({ phone: patient.phone })
                    .eq('id', user.user.id)

                // Get patient record (should be created by trigger, but ensure it exists)
                const { data: patientRecord } = await supabaseAdmin
                    .from('patients')
                    .select('id')
                    .eq('user_id', user.user.id)
                    .single()

                let patientId = patientRecord?.id

                // If patient record doesn't exist, create it
                if (!patientId) {
                    const { data: newPatient, error: patientError } = await supabaseAdmin
                        .from('patients')
                        .insert({
                            user_id: user.user.id,
                            date_of_birth: patient.dateOfBirth || new Date(1990 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
                            blood_group: patient.bloodGroup || ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
                            emergency_contact_name: patient.emergencyContact || `Emergency Contact`,
                            emergency_contact_phone: patient.emergencyPhone || `+91-${8000000000 + Math.floor(Math.random() * 1000)}`
                        })
                        .select('id')
                        .single()

                    if (newPatient) {
                        patientId = newPatient.id
                    } else if (patientError) {
                        console.error('Error creating patient record:', patientError)
                    }
                }
            }
        }
    }

    // Create Doctors
    for (const doctor of mockDoctors) {
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', doctor.email)
            .single()

        if (!existingUser) {
            const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
                email: doctor.email,
                password: 'password123',
                email_confirm: true,
                user_metadata: {
                    full_name: doctor.name,
                    role: 'doctor'
                }
            })
            if (user.user) createdDoctors.push(user.user)
        }
    }

    // Assign some appointments
    // We need a doctor to assign to. We'll use the newly created ones or the current logged in user if possible?
    // Let's just use the created doctors + fetch 1 random existing doctor
    const { data: existingDoctors } = await supabaseAdmin.from('users').select('id').eq('role', 'doctor').limit(1)
    const allDoctorIds = [...createdDoctors.map(d => d.id), ...existingDoctors?.map(d => d.id) || []]

    // Get all patient records from patients table (not users table)
    const { data: allPatientRecords } = await supabaseAdmin
        .from('patients')
        .select('id, user_id')

    let symptomsCreated = 0
    let screeningsCreated = 0
    let reportsCreated = 0

    if (allDoctorIds.length > 0 && allPatientRecords && allPatientRecords.length > 0) {
        for (const patient of allPatientRecords) {
            // Don't create fake appointments - only QR code connections are allowed

            // Create symptoms logs for some patients
            if (Math.random() > 0.4) {
                const symptomDates = []
                for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
                    const symptomDate = new Date()
                    symptomDate.setDate(symptomDate.getDate() - Math.floor(Math.random() * 30))
                    symptomDates.push(symptomDate)
                }

                for (const logDate of symptomDates) {
                    const symptoms = {
                        nausea: Math.random() > 0.7,
                        vomiting: Math.random() > 0.8,
                        fever: Math.random() > 0.7,
                        appetiteLoss: Math.random() > 0.6,
                        headache: Math.random() > 0.5,
                        discharge: Math.random() > 0.6
                    }

                    await supabaseAdmin.from('symptoms_log').insert({
                        patient_id: patient.id,
                        log_date: logDate.toISOString().split('T')[0],
                        symptoms: symptoms,
                        pain_level: Math.floor(Math.random() * 6),
                        fatigue_level: Math.floor(Math.random() * 7),
                        bleeding: Math.random() > 0.7,
                        notes: 'Sample symptom log entry'
                    })
                    symptomsCreated++
                }
            }

            // Create screening records for some patients
            if (Math.random() > 0.5) {
                const screeningDate = new Date()
                screeningDate.setDate(screeningDate.getDate() - Math.floor(Math.random() * 365))

                await supabaseAdmin.from('screening_records').insert({
                    patient_id: patient.id,
                    screening_date: screeningDate.toISOString().split('T')[0],
                    screening_type: ['Pap Smear', 'HPV Test', 'Colposcopy', 'Biopsy'][Math.floor(Math.random() * 4)],
                    result: ['Normal', 'Abnormal', 'Pending'][Math.floor(Math.random() * 3)],
                    notes: 'Sample screening record'
                })
                screeningsCreated++
            }

            // Don't create fake connections - patients must scan QR code to connect

            // Create medical reports for some patients
            if (Math.random() > 0.4 && allDoctorIds.length > 0) {
                const reportTypes = [
                    'Pap Smear Report',
                    'HPV Test Results',
                    'Colposcopy Report',
                    'Biopsy Report',
                    'Blood Test Report',
                    'Ultrasound Report',
                    'CT Scan Report',
                    'Pathology Report'
                ]
                const fileTypes = ['application/pdf', 'image/png', 'image/jpeg']
                
                // Create 1-3 reports per patient
                const numReports = Math.floor(Math.random() * 3) + 1
                
                for (let r = 0; r < numReports; r++) {
                    const reportDate = new Date()
                    reportDate.setDate(reportDate.getDate() - Math.floor(Math.random() * 180)) // Last 6 months
                    
                    const randomDoctorId = allDoctorIds[Math.floor(Math.random() * allDoctorIds.length)]
                    const reportType = reportTypes[Math.floor(Math.random() * reportTypes.length)]
                    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)]
                    const fileExtension = fileType === 'application/pdf' ? 'pdf' : fileType === 'image/png' ? 'png' : 'jpg'
                    
                    // Generate a sample file path (in real scenario, this would be uploaded to storage)
                    const fileName = `${reportType.replace(/\s+/g, '_')}_${reportDate.toISOString().split('T')[0]}.${fileExtension}`
                    const filePath = `${patient.user_id}/${fileName}`

                    await supabaseAdmin.from('medical_reports').insert({
                        patient_id: patient.id,
                        doctor_id: randomDoctorId,
                        file_name: fileName,
                        file_path: filePath,
                        file_type: fileType,
                        report_type: reportType,
                        description: `Sample ${reportType.toLowerCase()} generated for testing purposes. This is a placeholder report.`
                    })
                    reportsCreated++
                }
            }
        }
    }

    return NextResponse.json({
        success: true,
        patientsCreated: createdPatients.length,
        doctorsCreated: createdDoctors.length,
        symptomsCreated: symptomsCreated,
        screeningsCreated: screeningsCreated,
        reportsCreated: reportsCreated,
        message: 'Seeding complete. Default password is "password123" for all accounts. Note: Patients must scan doctor QR codes to connect.'
    })
}
