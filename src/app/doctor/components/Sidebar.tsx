'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '../doctor.module.css'
import {
    LayoutGrid,
    Calendar,
    Users,
    Mail,
    FileText,
    Settings,
    QrCode,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

// Helper component for individual links
const SidebarItem = ({
    href,
    icon: Icon,
    label,
    isActive = false,
    onClick
}: {
    href: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any,
    label: string,
    isActive?: boolean,
    onClick?: () => void
}) => {
    return (
        <Link href={href} className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`} onClick={onClick}>
            <Icon className={styles.navIcon} />
            <span>{label}</span>
        </Link>
    )
}

export default function Sidebar() {
    const pathname = usePathname()
    const { t } = useLanguage()
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    // Helper to check if link is active
    // Exact match for dashboard, startsWith for others to handle subpages
    const isActive = (path: string) => {
        if (path === '/doctor/dashboard') {
            return pathname === path
        }
        return pathname?.startsWith(path)
    }

    const closeMobileMenu = () => {
        setIsMobileOpen(false)
    }

    const toggleMobileMenu = () => {
        setIsMobileOpen(prev => !prev)
    }

    // Expose toggle function for header to use
    React.useEffect(() => {
        const handleToggle = () => setIsMobileOpen(prev => !prev)
        window.toggleDoctorSidebar = handleToggle
        return () => {
            delete window.toggleDoctorSidebar
        }
    }, [])

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`${styles.sidebarOverlay} ${isMobileOpen ? styles.active : ''}`}
                onClick={closeMobileMenu}
            />

            <aside className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`}>
                {/* Toggle button on the side */}
                <button className={styles.sidebarToggleButton} onClick={toggleMobileMenu}>
                    {isMobileOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>

                <div className={styles.logo}>
                    <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>D</div>
                </div>

                <nav className={styles.nav}>
                    <SidebarItem
                        href="/doctor/dashboard"
                        icon={LayoutGrid}
                        label={t('doctor.sidebar.overview')}
                        isActive={isActive('/doctor/dashboard')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/doctor/appointments"
                        icon={Calendar}
                        label={t('doctor.sidebar.appointment')}
                        isActive={isActive('/doctor/appointments')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/doctor/patients"
                        icon={Users}
                        label={t('doctor.sidebar.myPatients')}
                        isActive={isActive('/doctor/patients')}
                        onClick={closeMobileMenu}
                    />

                    {/* Payments link removed as per request */}
                    <SidebarItem
                        href="/doctor/messages"
                        icon={Mail}
                        label={t('doctor.sidebar.message')}
                        isActive={isActive('/doctor/messages')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/doctor/blog"
                        icon={FileText}
                        label={t('doctor.sidebar.blog')}
                        isActive={isActive('/doctor/blog')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/doctor/qr-code"
                        icon={QrCode}
                        label={t('doctor.sidebar.myQrCode')}
                        isActive={isActive('/doctor/qr-code')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/doctor/settings"
                        icon={Settings}
                        label={t('doctor.sidebar.settings')}
                        isActive={isActive('/doctor/settings')}
                        onClick={closeMobileMenu}
                    />
                </nav>
            </aside>
        </>
    )
}

// Extend Window interface for TypeScript
declare global {
    interface Window {
        toggleDoctorSidebar?: () => void
    }
}
