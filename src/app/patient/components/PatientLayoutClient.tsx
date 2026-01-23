'use client'

import React from 'react'
import Sidebar from './Sidebar'
import PatientHeader from './PatientHeader'
import styles from '../patient.module.css'

interface PatientLayoutClientProps {
    children: React.ReactNode
    userName?: string | null
}

export default function PatientLayoutClient({ children, userName }: PatientLayoutClientProps) {
    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.main}>
                <PatientHeader userName={userName} />

                {children}
            </main>
        </div>
    )
}
