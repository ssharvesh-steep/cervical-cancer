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

    // Generate 50 mock patients
    const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

    const mockPatients = [];
    for (let i = 0; i < 50; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        mockPatients.push({
            name: `${firstName} ${lastName}`,
            email: `patient.test.${i + 1}@example.com`, // Ensure unique emails
            phone: `555-0${100 + i}`
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

                const { error: patientError } = await supabaseAdmin
                    .from('patients')
                    .insert({
                        user_id: user.user.id,
                        date_of_birth: '1990-01-01', // Default DOB
                        gender: 'Female', // As per context
                        phone: patient.phone,
                        blood_group: 'O+',
                        address: '123 Seed Street'
                    })

                if (patientError) {
                    console.error('Error creating patient record:', patientError)
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

    // We need patient IDs. Since triggers might create public.users/patients, let's fetch them from public schema
    const { data: allPatientRecords } = await supabaseAdmin.from('users').select('id').eq('role', 'patient')

    let appointmentsCreated = 0

    if (allDoctorIds.length > 0 && allPatientRecords && allPatientRecords.length > 0) {
        const appointmentTypes = ['General Checkup', 'Follow-up', 'Consultation', 'Screening']

        for (const patient of allPatientRecords) {
            // Randomly decide to give this patient an appointment
            if (Math.random() > 0.3) {
                const randomDoctorId = allDoctorIds[Math.floor(Math.random() * allDoctorIds.length)]
                const randomType = appointmentTypes[Math.floor(Math.random() * appointmentTypes.length)]

                // Random date in the next 7 days
                const date = new Date()
                date.setDate(date.getDate() + Math.floor(Math.random() * 7))
                date.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0)

                await supabaseAdmin.from('appointments').insert({
                    patient_id: patient.id, // Assuming user ID is used or handle properly if separate table
                    doctor_id: randomDoctorId,
                    appointment_date: date.toISOString(),
                    appointment_type: randomType,
                    status: 'scheduled',
                    notes: 'Generated by seed'
                })
                appointmentsCreated++
            }
        }
    }

    return NextResponse.json({
        success: true,
        patientsCreated: createdPatients.length,
        doctorsCreated: createdDoctors.length,
        appointmentsCreated: appointmentsCreated,
        message: 'Seeding complete. Default password is "password123"'
    })
}
