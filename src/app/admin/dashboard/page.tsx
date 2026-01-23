'use client'

import { useEffect, useState } from 'react'
import { Users, UserPlus, Activity, TrendingUp } from 'lucide-react'
import styles from '../admin.module.css'
import { useLanguage } from '@/context/LanguageContext'
import { createClient } from '@/lib/supabase/client'

export default function AdminDashboard() {
    const { t } = useLanguage()
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0,
        doctors: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            const supabase = createClient()
            try {
                // Get total users
                const { count: totalUsers } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })

                // Get doctors
                const { count: doctors } = await supabase
                    .from('users')
                    .select('*', { count: 'exact', head: true })
                    .eq('role', 'doctor')

                // Mock other stats for now as they might need complex queries or tracking
                setStats({
                    totalUsers: totalUsers || 0,
                    activeUsers: Math.floor((totalUsers || 0) * 0.8), // Mock
                    newUsers: 2, // Mock
                    doctors: doctors || 0
                })
            } catch (error) {
                console.error('Error fetching stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    return (
        <div>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>{t('admin.dashboard.title')}</h1>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>{t('admin.dashboard.welcome')}</p>
                </div>

                <div className={styles.profile}>
                    <div className={styles.profileInfo} style={{ textAlign: 'right' }}>
                        <span className={styles.profileName}>Admin User</span>
                        <span className={styles.profileRole}>{t('admin.header.admin')}</span>
                    </div>
                    <div className={styles.avatar}>A</div>
                </div>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statTitle}>{t('admin.dashboard.totalUsers')}</span>
                        <Users className={styles.statIcon} size={20} />
                    </div>
                    <span className={styles.statValue}>{loading ? '-' : stats.totalUsers}</span>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statTitle}>{t('admin.dashboard.activeUsers')}</span>
                        <Activity className={styles.statIcon} size={20} style={{ backgroundColor: '#ecfccb', color: '#65a30d' }} />
                    </div>
                    <span className={styles.statValue}>{loading ? '-' : stats.activeUsers}</span>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statTitle}>{t('admin.dashboard.newUsers')}</span>
                        <UserPlus className={styles.statIcon} size={20} style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }} />
                    </div>
                    <span className={styles.statValue}>{loading ? '-' : stats.newUsers}</span>
                    <span style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <TrendingUp size={12} /> +12% from last week
                    </span>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statTitle}>Doctors</span>
                        <Users className={styles.statIcon} size={20} style={{ backgroundColor: '#fce7f3', color: '#db2777' }} />
                    </div>
                    <span className={styles.statValue}>{loading ? '-' : stats.doctors}</span>
                </div>
            </div>

            {/* Recent Activity or Quick Actions could go here */}
        </div>
    )
}
