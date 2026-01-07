import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'

export default async function PatientDetailsPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
        redirect('/login')
    }

    const patientUserId = params.id

    // Get user data (Name, Email, Phone)
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', patientUserId)
        .single()

    // Get patient data (Medical info)
    const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', patientUserId)
        .single()

    if (userError || !userData) {
        return notFound()
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>{userData.full_name}</h1>
                    <p>Patient Profile</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/doctor/patients" className="btn btn-outline">
                        Back to List
                    </Link>
                    <Link href={`/doctor/patients/${patientUserId}/edit`} className="btn btn-primary">
                        Edit Profile
                    </Link>
                </div>
            </header>

            <div className={styles.grid}>
                {/* Personal Information */}
                <div className={styles.card}>
                    <h2>Personal Information</h2>
                    <div className={styles.profileSection}>
                        <div className={styles.profileField}>
                            <label>Full Name</label>
                            <p>{userData.full_name}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Email</label>
                            <p>{userData.email}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Phone</label>
                            <p>{userData.phone || 'Not provided'}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Member Since</label>
                            <p>{new Date(userData.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Medical Information */}
                <div className={styles.card}>
                    <h2>Medical Information</h2>
                    <div className={styles.profileSection}>
                        <div className={styles.profileField}>
                            <label>Date of Birth</label>
                            <p>
                                {patientData?.date_of_birth
                                    ? new Date(patientData.date_of_birth).toLocaleDateString()
                                    : 'Not recorded'}
                            </p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Age</label>
                            <p>{patientData?.age ? `${patientData.age} years` : '--'}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Blood Group</label>
                            <p>{patientData?.blood_group || '--'}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Marital Status</label>
                            <p>{patientData?.marital_status || '--'}</p>
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className={styles.card}>
                    <h2>Emergency Contact</h2>
                    <div className={styles.profileSection}>
                        <div className={styles.profileField}>
                            <label>Name</label>
                            <p>{patientData?.emergency_contact_name || 'Not provided'}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Phone</label>
                            <p>{patientData?.emergency_contact_phone || 'Not provided'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
