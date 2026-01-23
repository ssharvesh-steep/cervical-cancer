'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAdminProfile } from '@/lib/supabase-auth'
import AdminSidebar from './components/AdminSidebar'
import styles from './admin.module.css'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const profile = await getAdminProfile()
                if (!profile) {
                    router.push('/login')
                }
            } catch (error) {
                console.error('Error checking auth:', error)
                router.push('/login')
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [router])

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
                <div style={{
                    width: 40,
                    height: 40,
                    border: '3px solid #e2e8f0',
                    borderTopColor: '#3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                 `}} />
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <AdminSidebar />
            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}
