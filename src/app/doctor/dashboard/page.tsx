import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'
import StatCard from '../components/StatCard'
import AppointmentRequests from '../components/AppointmentRequests'
import PatientStats from '../components/PatientStats'
import RecentPatients from '../components/RecentPatients'
import { Calendar, User, Briefcase, Video } from 'lucide-react'
import { SyncProfileButton } from '@/components/auth/SyncProfileButton'

export default async function DoctorDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get doctor data
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (userError || !userData) {
        console.error('User profile not found:', userError)
        return (
            <div className={styles.container}>
                <div className="alert alert-error" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                    <p>User profile not found. This can happen if the account setup didn't complete.</p>
                    <form action="/api/auth/sync" method="POST">
                        <SyncProfileButton />
                    </form>
                </div>
            </div>
        )
    }

    if (userData.role !== 'doctor') {
        redirect('/patient/dashboard')
    }

    // Get upcoming appointments
    const { data: upcomingAppointments } = await supabase
        .from('appointments')
        .select(`
      *,
      patient:patients!appointments_patient_id_fkey(
        id,
        user:users!patients_user_id_fkey(full_name)
      )
    `)
        .eq('doctor_id', user.id)
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date', { ascending: true })
        .limit(10) as { data: any[] | null }

    // Total Patients Count
    const { count: patientCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'patient')

    // Total Appointments Count
    const { count: totalAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user.id)

    // Pending Requests Count
    const { count: pendingCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', user.id)
        .eq('status', 'pending')

    // Pending Requests List (for the table)
    const { data: pendingAppointments } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          appointment_type,
          created_at,
          patient:patients!appointments_patient_id_fkey(
            user:users!patients_user_id_fkey(full_name)
          )
        `)
        .eq('doctor_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5) as { data: any[] | null }

    // Recent Patients (Just fetching recent appointments/patients for now)
    // Recent Patients (Fetching from users table to ensure all registered patients show up)
    const { data: recentUsers } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'patient')
        .order('created_at', { ascending: false })
        .limit(10)

    console.log('DEBUG: Recent Users Found:', recentUsers?.length)
    if (recentUsers && recentUsers.length > 0) {
        console.log('DEBUG: First User:', recentUsers[0])
    }

    const recentPatients = recentUsers?.map(user => ({
        id: user.id, // Using user ID as the key
        created_at: user.created_at || new Date().toISOString(),
        gender: 'Female', // Default/Placeholder as simple registration might not have this
        user: {
            full_name: user.full_name,
            email: user.email,
            // Add other user fields if needed
        }
    })) || []


    return (
        <div className={styles.container}>
            <div className={styles.welcomeSection}>
                <h1 className={styles.welcomeTitle}>Welcome, Dr. {userData?.full_name?.split(' ')[0] || 'Doctor'}</h1>
                <p className={styles.welcomeSubtitle}>Have a nice day at great work</p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <StatCard
                    title="Appointments"
                    value={totalAppointments?.toString() || "0"}
                    subtext="All Time"
                    icon={<Calendar size={24} color="white" />}
                    color="#8b5cf6" // Purple
                />
                <StatCard
                    title="Total Patient"
                    value={patientCount?.toString() || "0"}
                    subtext="Registered Patients"
                    icon={<User size={24} color="white" />}
                    color="#f43f5e" // Red/Pink
                />
                <StatCard
                    title="Pending Requests"
                    value={pendingCount?.toString() || "0"}
                    subtext="Awaiting Approval"
                    icon={<Briefcase size={24} color="white" />}
                    color="#f59e0b" // Orange
                />
                <StatCard
                    title="Upcoming Appointments"
                    value={upcomingAppointments?.length.toString() || "0"}
                    subtext="Next 10 Appointments"
                    icon={<Video size={24} color="white" />}
                    color="#0ea5e9" // Blue
                />
            </div>

            {/* Main Content Grid */}
            <div className={styles.mainGrid}>
                {/* Column 1: Requests */}
                <AppointmentRequests appointments={pendingAppointments || []} />

                {/* Column 2: Stats Center */}
                <div className={styles.centerColumn}>
                    <PatientStats totalPatients={patientCount || 0} />
                </div>
            </div>

            {/* Recent Patients Table */}
            <RecentPatients patients={recentPatients || []} />
        </div>
    )
}
