'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '../patient.module.css'
import {
    LayoutGrid,
    Calendar,
    Mail,
    BookOpen,
    Settings,
    User,
    Activity, // Using Activity for Report/Medical History if no specific report icon
    QrCode,
    Utensils,
    ClipboardList
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
    icon: React.ElementType,
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
    const isActive = (path: string) => {
        if (path === '/patient/dashboard') {
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
        window.togglePatientSidebar = handleToggle
        return () => {
            delete window.togglePatientSidebar
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


                <nav className={styles.nav}>
                    <SidebarItem
                        href="/patient/dashboard"
                        icon={LayoutGrid}
                        label={t('patient.sidebar.overview')}
                        isActive={isActive('/patient/dashboard')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/patient/appointments"
                        icon={Calendar}
                        label={t('patient.sidebar.appointment')}
                        isActive={isActive('/patient/appointments')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/patient/reports"
                        icon={Activity}
                        label={t('patient.sidebar.report')}
                        isActive={isActive('/patient/reports')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/patient/symptoms"
                        icon={ClipboardList}
                        label={t('patient.sidebar.symptoms')}
                        isActive={isActive('/patient/symptoms')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/patient/messages"
                        icon={Mail}
                        label={t('patient.sidebar.message')}
                        isActive={isActive('/patient/messages')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/patient/education"
                        icon={BookOpen}
                        label={t('patient.sidebar.blog')}
                        isActive={isActive('/patient/education')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/patient/scan-qr"
                        icon={QrCode}
                        label={t('patient.sidebar.scanQr')}
                        isActive={isActive('/patient/scan-qr')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/patient/food-plan"
                        icon={Utensils}
                        label={t('patient.sidebar.foodPlan')}
                        isActive={isActive('/patient/food-plan')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/patient/profile"
                        icon={User}
                        label={t('patient.sidebar.profile')}
                        isActive={isActive('/patient/profile')}
                        onClick={closeMobileMenu}
                    />
                    <SidebarItem
                        href="/patient/settings"
                        icon={Settings}
                        label={t('patient.sidebar.settings')}
                        isActive={isActive('/patient/settings')}
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
        togglePatientSidebar?: () => void
    }
}
