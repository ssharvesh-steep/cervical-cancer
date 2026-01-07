'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '../doctor.module.css'
import {
    LayoutGrid,
    Calendar,
    Users,

    CreditCard,
    Mail,
    FileText,
    Settings,
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
    // Exact match for dashboard, startsWith for others to handle subpages
    const isActive = (path: string) => {
        if (path === '/doctor/dashboard') {
            return pathname === path
        }
        return pathname?.startsWith(path)
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>D</div>
                Doctor Dashboard
            </div>

            <nav className={styles.nav}>
                <SidebarItem
                    href="/doctor/dashboard"
                    icon={LayoutGrid}
                    label="Overview"
                    isActive={isActive('/doctor/dashboard')}
                />
                <SidebarItem
                    href="/doctor/appointments"
                    icon={Calendar}
                    label="Appointment"
                    isActive={isActive('/doctor/appointments')}
                />
                <SidebarItem
                    href="/doctor/patients"
                    icon={Users}
                    label="My Patients"
                    isActive={isActive('/doctor/patients')}
                />

                {/* Payments link removed as per request */}
                <SidebarItem
                    href="/doctor/messages"
                    icon={Mail}
                    label="Message"
                    isActive={isActive('/doctor/messages')}
                />
                <SidebarItem
                    href="/doctor/blog"
                    icon={FileText}
                    label="Blog"
                    isActive={isActive('/doctor/blog')}
                />
                <SidebarItem
                    href="/doctor/qr-code"
                    icon={QrCode}
                    label="My QR Code"
                    isActive={isActive('/doctor/qr-code')}
                />
                <SidebarItem
                    href="/doctor/settings"
                    icon={Settings}
                    label="Settings"
                    isActive={isActive('/doctor/settings')}
                />
            </nav>
        </aside>
    )
}
