import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'
import AppointmentsClient from './AppointmentsClient'

export default async function DoctorAppointmentsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch all future appointments (or recent past + future) to pass to client
    // For scalability, we might want to fetch by month on the client side later,
    // but for now, fetching a reasonable batch is fine.

    const { data: appointments } = await supabase
        .from('appointments')
        .select(`
            id,
            appointment_date,
            status,
            appointment_type,
            patient:patients!appointments_patient_id_fkey(
                user:users!patients_user_id_fkey(full_name, email)
            )
        `)
        .eq('doctor_id', user.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .order('appointment_date', { ascending: true }) as { data: any[] | null }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Appointments</h1>
                <p>Manage your schedule and view upcoming appointments</p>
            </header>

            <AppointmentsClient initialAppointments={appointments || []} />
        </div>
    )
}
