'use client'

import React from 'react'
import { Search, Bell, HelpCircle } from 'lucide-react'
import styles from '../patient.module.css'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'

interface PatientHeaderProps {
    userName?: string | null
}

export default function PatientHeader({ userName }: PatientHeaderProps) {
    const { t } = useLanguage()

    return (
        <header className={styles.header}>
            {/* Mobile Menu Button */}


            <div className={styles.searchBar}>
                <Search size={18} color="#94a3b8" />
                <input
                    type="text"
                    placeholder={t('patient.header.searchPlaceholder')}
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.headerActions}>
                <LanguageSwitcher className={styles.languageSwitcher} />
                <button className={styles.iconBtn}>
                    <HelpCircle size={20} />
                </button>
                <button className={styles.iconBtn}>
                    <Bell size={20} />
                </button>

                <div className={styles.profile}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`https://ui-avatars.com/api/?name=${userName || 'Patient'}&background=random`}
                        alt="Profile"
                        className={styles.avatar}
                    />
                    <div className={styles.profileInfo}>
                        <span className={styles.profileName}>{userName || 'Patient Name'}</span>
                        <span className={styles.profileRole}>{t('patient.header.patient')}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
