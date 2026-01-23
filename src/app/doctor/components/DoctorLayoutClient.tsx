'use client'

import React from 'react'
import Sidebar from './Sidebar'
import DoctorHeader from './DoctorHeader'
import styles from '../doctor.module.css'

interface DoctorLayoutClientProps {
    children: React.ReactNode
    userName?: string | null
}

export default function DoctorLayoutClient({ children, userName }: DoctorLayoutClientProps) {
    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                <DoctorHeader userName={userName} />

                {children}
            </main>
        </div>
    )
}
