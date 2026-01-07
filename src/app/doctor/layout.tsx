import React from 'react'
import Link from 'next/link'
import styles from './doctor.module.css'
import {
    LayoutGrid,
    Calendar,
    Users,
    Clock,
    CreditCard,
    Mail,
    FileText,
    Settings,
    Search,
    Bell,
    HelpCircle
} from 'lucide-react'
import Image from 'next/image'

import { createClient } from '@/lib/supabase/server'
import Sidebar from './components/Sidebar'

export default async function DoctorLayout({
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
                            placeholder="Search Appointment, Patient or etc"
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
                                src={`https://ui-avatars.com/api/?name=${userData?.full_name || 'Doctor'}&background=0D8ABC&color=fff`}
                                alt="Profile"
                                className={styles.avatar}
                            />
                            <div className={styles.profileInfo}>
                                <span className={styles.profileName}>{userData?.full_name || 'Doctor'}</span>
                                <span className={styles.profileRole}>Doctor</span>
                            </div>
                        </div>
                    </div>
                </header>

                {children}
            </main>
        </div>
    )
}
