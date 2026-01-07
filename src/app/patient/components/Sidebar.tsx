'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '../patient.module.css'
import {
    LayoutGrid,
    Calendar,
    FileText,
    Mail,
    BookOpen,
    Settings,
    User,
    Activity, // Using Activity for Report/Medical History if no specific report icon
    QrCode
} from 'lucide-react'

// Helper component for individual links
const SidebarItem = ({
    href,
    icon: Icon,
    label,
    isActive = false
}: {
    href: string,
    icon: any,
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

export default function Sidebar() {
    const pathname = usePathname()

    // Helper to check if link is active
    const isActive = (path: string) => {
        if (path === '/patient/dashboard') {
            return pathname === path
        }
        return pathname?.startsWith(path)
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>P</div>
                Patient Dashboard
            </div>

            <nav className={styles.nav}>
                <SidebarItem
                    href="/patient/dashboard"
                    icon={LayoutGrid}
                    label="Overview"
                    isActive={isActive('/patient/dashboard')}
                />
                <SidebarItem
                    href="/patient/appointments"
                    icon={Calendar}
                    label="Appointment"
                    isActive={isActive('/patient/appointments')}
                />
                <SidebarItem
                    href="/patient/reports"
                    icon={Activity}
                    label="Report"
                    isActive={isActive('/patient/reports')}
                />
                <SidebarItem
                    href="/patient/messages"
                    icon={Mail}
                    label="Message"
                    isActive={isActive('/patient/messages')}
                />
                <SidebarItem
                    href="/patient/education"
                    icon={BookOpen}
                    label="Blog"
                    isActive={isActive('/patient/education')}
                />
                <SidebarItem
                    href="/patient/scan-qr"
                    icon={QrCode}
                    label="Scan QR"
                    isActive={isActive('/patient/scan-qr')}
                />
                <SidebarItem
                    href="/patient/profile"
                    icon={User}
                    label="Profile"
                    isActive={isActive('/patient/profile')}
                />
                <SidebarItem
                    href="/patient/settings"
                    icon={Settings}
                    label="Settings"
                    isActive={isActive('/patient/settings')}
                />
            </nav>
        </aside>
    )
}
