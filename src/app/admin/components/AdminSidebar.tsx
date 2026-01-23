'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '../admin.module.css'
import {
    LayoutGrid,
    Users,
    Settings,
    LogOut
} from 'lucide-react'
import { bg } from 'date-fns/locale'
import { signOut } from '@/lib/supabase-auth'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/context/LanguageContext'

// Helper component for individual links
const SidebarItem = ({
    href,
    icon: Icon,
    label,
    isActive = false
}: {
    href: string,
    icon: React.ElementType,
    label: string,
    isActive?: boolean
}) => {
    return (
        <Link href={href} className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
            <Icon className={styles.navIcon} />
            <span>{label}</span>
        </Link>
    )
}

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { t } = useLanguage()

    // Helper to check if link is active
    const isActive = (path: string) => {
        if (path === '/admin/dashboard') {
            return pathname === path
        }
        return pathname?.startsWith(path)
    }

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/login')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div style={{ width: 32, height: 32, background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>A</div>
                Admin Panel
            </div>

            <nav className={styles.nav}>
                <SidebarItem
                    href="/admin/dashboard"
                    icon={LayoutGrid}
                    label={t('admin.sidebar.dashboard')}
                    isActive={isActive('/admin/dashboard')}
                />
                <SidebarItem
                    href="/admin/users"
                    icon={Users}
                    label={t('admin.sidebar.users')}
                    isActive={isActive('/admin/users')}
                />
                <SidebarItem
                    href="/admin/settings"
                    icon={Settings}
                    label={t('admin.sidebar.settings')}
                    isActive={isActive('/admin/settings')}
                />
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
                <button
                    onClick={handleSignOut}
                    className={styles.navLink}
                    style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', justifyContent: 'flex-start' }}
                >
                    <LogOut className={styles.navIcon} />
                    <span>{t('common.logout')}</span>
                </button>
            </div>
        </aside>
    )
}
