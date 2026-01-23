import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'
import { SyncProfileButton } from '@/components/auth/SyncProfileButton'

export default async function PatientDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user data
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (userError || !userData) {
        // Handle case where user exists in Auth but not in public.users table

        return (
            <div className={styles.container}>
                <div className="alert alert-error" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                    <p><strong>User Profile Missing</strong></p>
                    <p>Auth ID: <code>{user.id}</code></p>

                    <p>This account exists in login system but is missing database records.</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <form action="/api/auth/sync" method="POST">
                            <SyncProfileButton />
                        </form>
                        <span style={{ fontSize: '0.9em' }}>OR run <code>database/fix_everything.sql</code></span>
                    </div>
                </div>
            </div>
        )
    }

    if (userData.role !== 'patient') {
        redirect('/doctor/dashboard')
    }

    // Get patient data
    const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

    // Create patient record if it doesn't exist (fallback for missing trigger)
    const safePatientId = patientData?.id

    if (!patientData && !patientError) {
        // Optionally insert here, or just handle null
    }

    // Get upcoming appointments
    const { data: appointments } = await supabase
        .from('appointments')
        .select(`
      *,
      doctor:users!appointments_doctor_id_fkey(full_name)
    `)
        .eq('patient_id', safePatientId)
        .in('status', ['scheduled', 'pending', 'confirmed'])
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date', { ascending: true })
        .limit(5)

    // Get active medications
    const { data: medications } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', safePatientId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5)

    // Get latest screening
    const { data: lastScreening } = await supabase
        .from('screening_records')
        .select('*')
        .eq('patient_id', safePatientId)
        .order('screening_date', { ascending: false })
        .limit(1)
        .maybeSingle()

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Welcome, {userData?.full_name}</h1>
                <p>Your health dashboard</p>
            </header>

            <div className={styles.grid}>
                {/* About App Section */}
                <div className={`card ${styles.aboutCard}`} style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
                    <h2 style={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>About Cervical Cancer Care</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📊 Real-time Tracking
                            </h3>
                            <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                                Monitor your screenings, medications, and symptoms in real-time. Stay on top of your health journey with live updates.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                👩‍⚕️ Doctor Connection
                            </h3>
                            <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                                Connect instantly with your doctor via scanned QR codes. Book appointments and share your health data securely.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📚 Educational Resources
                            </h3>
                            <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                                Access a library of verified information about prevention, screening, and treatment to make informed decisions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className={`card ${styles.statsCard}`}>
                    <h2>Health Overview</h2>
                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statLabel}>Upcoming Appointments</span>
                            <span className={styles.statValue}>{appointments?.length || 0}</span>
                        </div>
                        <div className={styles.stat}>
                            <span className={styles.statLabel}>Active Medications</span>
                            <span className={styles.statValue}>{medications?.length || 0}</span>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Latest Screening</h3>
                        {lastScreening ? (
                            <div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>{lastScreening.result || 'Pending'}</div>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(lastScreening.screening_date).toLocaleDateString()}</div>
                            </div>
                        ) : (
                            <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic' }}>No records found</div>
                        )}
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className={`card ${styles.appointmentsCard}`}>
                    <h2>Upcoming Appointments</h2>
                    {appointments && appointments.length > 0 ? (
                        <div className={styles.appointmentsList}>
                            {appointments.map((apt) => (
                                <div key={apt.id} className={styles.appointmentItem}>
                                    <div className={styles.appointmentDate}>
                                        {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <div className={styles.appointmentDetails}>
                                        <div className={styles.appointmentType}>
                                            {apt.appointment_type.replace('_', ' ')}
                                        </div>
                                        <div className={styles.appointmentDoctor}>
                                            Dr. {apt.doctor?.full_name}
                                        </div>
                                    </div>
                                    <span className={`badge ${apt.status === 'confirmed' || apt.status === 'scheduled'
                                        ? 'badge-success'
                                        : apt.status === 'pending'
                                            ? 'badge-warning'
                                            : 'badge-error'
                                        }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyState}>No upcoming appointments</p>
                    )}
                </div>

                {/* Active Medications */}
                <div className={`card ${styles.medicationsCard}`}>
                    <h2>Active Medications</h2>
                    {medications && medications.length > 0 ? (
                        <div className={styles.medicationsList}>
                            {medications.map((med) => (
                                <div key={med.id} className={styles.medicationItem}>
                                    <div className={styles.medicationName}>{med.medication_name}</div>
                                    <div className={styles.medicationDosage}>
                                        {med.dosage} - {med.frequency}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyState}>No active medications</p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className={`card ${styles.actionsCard}`}>
                    <h2>Quick Actions</h2>
                    <div className={styles.actions}>
                        <a href="/patient/symptoms" className="btn btn-primary">
                            Log Symptoms
                        </a>
                        <a href="/patient/appointments" className="btn btn-outline">
                            Book Appointment
                        </a>
                        <a href="/patient/education" className="btn btn-outline">
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
