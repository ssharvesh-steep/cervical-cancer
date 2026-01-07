import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'

export default async function DoctorProfilePage() {
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

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>My Profile</h1>
                <p>View and manage your professional information</p>
            </header>

            <div className={styles.content}>
                <div className="card">
                    <h2>Professional Information</h2>
                    <div className={styles.profileSection}>
                        <div className={styles.profileField}>
                            <label>Full Name</label>
                            <p>Dr. {userData?.full_name}</p>
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
                        <div className={styles.profileField}>
                            <label>Account Status</label>
                            <p>
                                <span className={`badge ${userData?.is_active ? 'badge-success' : 'badge-error'}`}>
                                    {userData?.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Member Since</label>
                            <p>{new Date(userData?.created_at).toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric'
                            })}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2>Account Settings</h2>
                    <div className={styles.actions}>
                        <a href="/doctor/profile/edit" className="btn btn-outline">Edit Profile</a>
                        <button className="btn btn-outline">Change Password</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
