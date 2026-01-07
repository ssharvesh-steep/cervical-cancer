import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'

export default async function DoctorPatientsPage() {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
        redirect('/login')
    }

    // Get ALL patients (fetching from users table to ensure all registered patients show up)
    const { data: allPatients } = await supabase
        .from('users')
        .select(`
            id,
            full_name,
            email,
            phone,
            created_at
        `)
        .eq('role', 'patient')
        .order('created_at', { ascending: false })

    // Get appointment counts for each patient
    const patientsWithAppointments = await Promise.all(
        (allPatients || []).map(async (user) => {
            // Check for appointments
            const { data: appointments } = await supabase
                .from('appointments')
                .select('appointment_date')
                .eq('patient_id', user.id) // Assuming patient_id in appointments refers to the user.id or there's a join. 
            // Actually, patient_id in appointments usually refers to the PATIENT table ID, not USER ID.
            // However, if we don't have a patient record, they can't have appointments.
            // We need to find if there is a patient record for this user first.

            // Let's try to find their patient record first
            const { data: patientRecord } = await supabase
                .from('patients')
                .select('id, date_of_birth')
                .eq('user_id', user.id)
                .single()

            let lastAppointment = null
            let appointmentCount = 0

            if (patientRecord) {
                const { data: appts } = await supabase
                    .from('appointments')
                    .select('appointment_date')
                    .eq('patient_id', patientRecord.id)
                    .eq('doctor_id', authUser.id)
                    .order('appointment_date', { ascending: false })
                    .limit(1)

                if (appts && appts.length > 0) {
                    lastAppointment = appts[0].appointment_date
                    appointmentCount = 1 // Simplified for check
                }
            }

            return {
                id: patientRecord?.id || user.id, // Fallback to user ID if no patient record
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    phone: user.phone
                },
                date_of_birth: patientRecord?.date_of_birth || null,
                lastAppointment: lastAppointment,
                hasAppointment: appointmentCount > 0
            }
        })
    )

    const patients = patientsWithAppointments

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>My Patients</h1>
                <p>Manage your patient records</p>
            </header>

            <div className={styles.grid}>
                {patients && patients.length > 0 ? (
                    patients.map((patient) => (
                        <div key={patient.id} className="card">
                            <div className={styles.patientCard}>
                                <div className={styles.patientHeader}>
                                    <div className={styles.patientAvatar}>
                                        {patient.user?.full_name?.charAt(0) || '?'}
                                    </div>
                                    <div className={styles.patientInfo}>
                                        <h3>{patient.user?.full_name || 'Unknown Patient'}</h3>
                                        <p className={styles.patientEmail}>{patient.user?.email || 'No email'}</p>
                                    </div>
                                </div>

                                <div className={styles.patientDetails}>
                                    {patient.user?.phone && (
                                        <div className={styles.detail}>
                                            <span className={styles.label}>Phone:</span>
                                            <span>{patient.user.phone}</span>
                                        </div>
                                    )}
                                    {patient.date_of_birth && (
                                        <div className={styles.detail}>
                                            <span className={styles.label}>Date of Birth:</span>
                                            <span>{new Date(patient.date_of_birth).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    <div className={styles.detail}>
                                        <span className={styles.label}>Last Visit:</span>
                                        <span>
                                            {patient.lastAppointment
                                                ? new Date(patient.lastAppointment).toLocaleDateString()
                                                : 'No appointments yet'}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    {patient.user?.id && (
                                        <>
                                            <a href={`/doctor/patients/${patient.user.id}`} className="btn btn-primary btn-sm">
                                                View Details
                                            </a>
                                            <a href={`/doctor/messages?patient=${patient.user.id}`} className="btn btn-outline btn-sm">
                                                Send Message
                                            </a>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <p>No patients registered yet. Patients will appear here when they create accounts.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
