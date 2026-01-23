'use client'

import React from 'react'
import { Search, Bell, HelpCircle, Menu, MoreVertical } from 'lucide-react'
import styles from '../doctor.module.css'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'

interface DoctorHeaderProps {
    userName?: string | null
}

export default function DoctorHeader({ userName }: DoctorHeaderProps) {
    const { t } = useLanguage()

    const toggleMobileMenu = () => {
        if (typeof window !== 'undefined' && window.toggleDoctorSidebar) {
            window.toggleDoctorSidebar()
        }
    }

    return (
        <header className={styles.header}>
            {/* Mobile Menu Button */}
            <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
                <Menu size={24} />
            </button>

            <div className={styles.searchBar}>
                <Search size={18} color="#94a3b8" />
                <input
                    type="text"
                    placeholder={t('doctor.header.searchPlaceholder')}
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
                <button className={styles.iconBtn}>
                    <MoreVertical size={20} />
                </button>

                <div className={styles.profile}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`https://ui-avatars.com/api/?name=${userName || 'Doctor'}&background=0D8ABC&color=fff`}
                        alt="Profile"
                        className={styles.avatar}
                    />
                    <div className={styles.profileInfo}>
                        <span className={styles.profileName}>{userName || t('doctor.header.doctor')}</span>
                        <span className={styles.profileRole}>{t('doctor.header.doctor')}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
