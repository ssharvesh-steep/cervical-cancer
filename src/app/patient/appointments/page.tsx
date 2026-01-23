import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BookAppointment from '@/components/patient/BookAppointment'
import styles from './page.module.css'

export default async function PatientAppointmentsPage({
    searchParams
}: {
    searchParams: Promise<{ doctor?: string }>
}) {
    const params = await searchParams
    const doctorId = params.doctor
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get patient data
    const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .single() as { data: any | null }

    // Get appointments
    const { data: appointments } = await supabase
        .from('appointments')
        .select(`
      *,
      doctor:users!appointments_doctor_id_fkey(full_name, email)
    `)
        .eq('patient_id', patientData?.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .order('appointment_date', { ascending: true }) as { data: any[] | null }

    const upcomingAppointments = appointments?.filter(apt =>
        new Date(apt.appointment_date) >= new Date() && apt.status === 'scheduled'
    )

    const pastAppointments = appointments?.filter(apt =>
        new Date(apt.appointment_date) < new Date() || apt.status !== 'scheduled'
    )

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>My Appointments</h1>
                <p>View and manage your appointments</p>
            </header>

            <div className={styles.content}>
                <section className={styles.section}>
                    <h2>Book New Appointment</h2>
                    <div className="card">
                        {patientData ? (
                            <BookAppointment
                                patientId={patientData.id}
                                preselectedDoctorId={doctorId}
                            />
                        ) : (
                            <div className="alert alert-warning">
                                <p><strong>Profile Incomplete</strong></p>
                                <p>Please complete your patient profile to book appointments.</p>
                                {/* Add a link to profile settings if available */}
                            </div>
                        )}
                    </div>
                </section>
                <section className={styles.section}>
                    <h2>Upcoming Appointments</h2>
                    {upcomingAppointments && upcomingAppointments.length > 0 ? (
                        <div className={styles.appointmentsList}>
                            {upcomingAppointments.map((apt) => (
                                <div key={apt.id} className="card">
                                    <div className={styles.appointmentCard}>
                                        <div className={styles.appointmentHeader}>
                                            <span className={styles.appointmentDate}>
                                                {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                            <span className={styles.appointmentTime}>
                                                {new Date(apt.appointment_date).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                        <div className={styles.appointmentDetails}>
                                            <div className={styles.detail}>
                                                <strong>Doctor:</strong> Dr. {apt.doctor?.full_name}
                                            </div>
                                            <div className={styles.detail}>
                                                <strong>Type:</strong> {apt.appointment_type.replace('_', ' ')}
                                            </div>
                                            {apt.notes && (
                                                <div className={styles.detail}>
                                                    <strong>Notes:</strong> {apt.notes}
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.appointmentActions}>
                                            <span className={`badge badge-${apt.status === 'scheduled' ? 'primary' : 'success'}`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyState}>No upcoming appointments</p>
                    )}
                </section>

                <section className={styles.section}>
                    <h2>Past Appointments</h2>
                    {pastAppointments && pastAppointments.length > 0 ? (
                        <div className={styles.appointmentsList}>
                            {pastAppointments.slice(0, 5).map((apt) => (
                                <div key={apt.id} className="card">
                                    <div className={styles.appointmentCard}>
                                        <div className={styles.appointmentHeader}>
                                            <span className={styles.appointmentDate}>
                                                {new Date(apt.appointment_date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                            <span className={`badge badge-${apt.status === 'completed' ? 'success' : 'error'}`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                        <div className={styles.appointmentDetails}>
                                            <div className={styles.detail}>
                                                <strong>Doctor:</strong> Dr. {apt.doctor?.full_name}
                                            </div>
                                            <div className={styles.detail}>
                                                <strong>Type:</strong> {apt.appointment_type.replace('_', ' ')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyState}>No past appointments</p>
                    )}
                </section>
            </div>
        </div>
    )
}
