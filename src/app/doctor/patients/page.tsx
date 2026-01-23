import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'
import Link from 'next/link'
import RealtimeRefresher from '@/components/RealtimeRefresher'

export default async function DoctorPatientsPage() {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
        redirect('/login')
    }

    // Get only patients who have connected via QR code (patient_doctors table only)
    const { data: connectedPatients } = await supabase
        .from('patient_doctors')
        .select('patient_id')
        .eq('doctor_id', authUser.id)

    // Get unique patient IDs from QR code connections only
    const allConnectedPatientIds = Array.from(new Set(connectedPatients?.map(c => c.patient_id) || []))

    // If no connected patients, return empty list
    if (allConnectedPatientIds.length === 0) {
        return (
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1>My Patients</h1>
                    <p>Manage your patient records</p>
                </header>
                <div className={styles.emptyState}>
                    <p>No connected patients yet. Patients will appear here once they scan your QR code to connect with you.</p>
                </div>
                <div style={{ display: 'none' }}>
                    <RealtimeRefresher table="patient_doctors" />
                </div>
            </div>
        )
    }

    // Get patient records for connected patients
    const { data: patientRecords } = await supabase
        .from('patients')
        .select(`
            id,
            user_id,
            date_of_birth
        `)
        .in('id', allConnectedPatientIds)

    // Get user details for these patients
    const patientUserIds = patientRecords?.map(p => p.user_id) || []
    const { data: allPatients } = await supabase
        .from('users')
        .select(`
            id,
            full_name,
            email,
            phone,
            created_at
        `)
        .in('id', patientUserIds)
        .order('created_at', { ascending: false })

    // Get appointment counts for each patient
    const patientsWithAppointments = await Promise.all(
        (allPatients || []).map(async (user) => {
            // Find the patient record for this user
            const { data: patientRecord } = await supabase
                .from('patients')
                .select('id, date_of_birth')
                .eq('user_id', user.id)
                .single()

            return {
                id: patientRecord?.id || user.id,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    phone: user.phone
                },
                date_of_birth: patientRecord?.date_of_birth || null,
                lastAppointment: null,
                hasAppointment: false
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
                                        <span className={styles.label}>Connection:</span>
                                        <span>Connected via QR Code</span>
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

            <div style={{ display: 'none' }}>
                <RealtimeRefresher table="patient_doctors" />
            </div>
        </div>
    )
}
