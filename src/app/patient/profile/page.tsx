import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'

export default async function PatientProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user data
    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single() as { data: any | null }

    // Get patient data
    const { data: patientData } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user.id)
        .single() as { data: any | null }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>My Profile</h1>
                <p>View and manage your personal information</p>
            </header>

            <div className={styles.content}>
                <div className="card">
                    <h2>Personal Information</h2>
                    <div className={styles.profileSection}>
                        <div className={styles.profileField}>
                            <label>Full Name</label>
                            <p>{userData?.full_name}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Email</label>
                            <p>{userData?.email}</p>
                        </div>
                        {userData?.phone && (
                            <div className={styles.profileField}>
                                <label>Phone</label>
                                <p>{userData.phone}</p>
                            </div>
                        )}
                        <div className={styles.profileField}>
                            <label>Account Type</label>
                            <p className={styles.roleBadge}>
                                <span className="badge badge-primary">{userData?.role}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {patientData && (
                    <div className="card">
                        <h2>Medical Information</h2>
                        <div className={styles.profileSection}>
                            {patientData.date_of_birth && (
                                <div className={styles.profileField}>
                                    <label>Date of Birth</label>
                                    <p>{new Date(patientData.date_of_birth).toLocaleDateString()}</p>
                                </div>
                            )}
                            {patientData.age && (
                                <div className={styles.profileField}>
                                    <label>Age</label>
                                    <p>{patientData.age} years</p>
                                </div>
                            )}
                            {patientData.blood_group && (
                                <div className={styles.profileField}>
                                    <label>Blood Group</label>
                                    <p>{patientData.blood_group}</p>
                                </div>
                            )}
                            {patientData.marital_status && (
                                <div className={styles.profileField}>
                                    <label>Marital Status</label>
                                    <p>{patientData.marital_status}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {patientData && (patientData.emergency_contact_name || patientData.emergency_contact_phone) && (
                    <div className="card">
                        <h2>Emergency Contact</h2>
                        <div className={styles.profileSection}>
                            {patientData.emergency_contact_name && (
                                <div className={styles.profileField}>
                                    <label>Contact Name</label>
                                    <p>{patientData.emergency_contact_name}</p>
                                </div>
                            )}
                            {patientData.emergency_contact_phone && (
                                <div className={styles.profileField}>
                                    <label>Contact Phone</label>
                                    <p>{patientData.emergency_contact_phone}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="card">
                    <h2>Account Settings</h2>
                    <div className={styles.actions}>
                        <Link href="/patient/profile/edit" className="btn btn-outline">Edit Profile</Link>
                        <button className="btn btn-outline">Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
