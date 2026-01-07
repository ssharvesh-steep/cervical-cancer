import React from 'react'
import styles from './patient.module.css'
import {
    Search,
    Bell,
    HelpCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Sidebar from './components/Sidebar'

export default async function PatientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userData = null
    if (user) {
        const { data } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', user.id)
            .single()
        userData = data
    }

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.searchBar}>
                        <Search size={18} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.headerActions}>
                        <button className={styles.iconBtn}>
                            <HelpCircle size={20} />
                        </button>
                        <button className={styles.iconBtn}>
                            <Bell size={20} />
                        </button>

                        <div className={styles.profile}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://ui-avatars.com/api/?name=${userData?.full_name || 'Patient'}&background=random`}
                                alt="Profile"
                                className={styles.avatar}
                            />
                            <div className={styles.profileInfo}>
                                <span className={styles.profileName}>{userData?.full_name || 'Patient'}</span>
                                <span className={styles.profileRole}>Patient</span>
                            </div>
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    )
}
