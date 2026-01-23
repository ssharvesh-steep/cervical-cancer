'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './page.module.css'

interface ProfileContentProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userData: any
}

export default function ProfileContent({ userData }: ProfileContentProps) {
    const { t } = useLanguage()

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{t('doctor.profile.title')}</h1>
                <p>{t('doctor.profile.subtitle')}</p>
            </header>

            <div className={styles.content}>
                <div className="card">
                    <h2>{t('doctor.profile.professionalInfo')}</h2>
                    <div className={styles.profileSection}>
                        <div className={styles.profileField}>
                            <label>{t('doctor.profile.fullName')}</label>
                            <p>Dr. {userData?.full_name}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>{t('doctor.profile.email')}</label>
                            <p>{userData?.email}</p>
                        </div>
                        {userData?.phone && (
                            <div className={styles.profileField}>
                                <label>{t('doctor.profile.phone')}</label>
                                <p>{userData.phone}</p>
                            </div>
                        )}
                        <div className={styles.profileField}>
                            <label>{t('doctor.profile.accountType')}</label>
                            <p className={styles.roleBadge}>
                                <span className="badge badge-primary">{userData?.role}</span>
                            </p>
                        </div>
                        <div className={styles.profileField}>
                            <label>{t('doctor.profile.accountStatus')}</label>
                            <p>
                                <span className={`badge ${userData?.is_active ? 'badge-success' : 'badge-error'}`}>
                                    {userData?.is_active ? t('doctor.profile.active') : t('doctor.profile.inactive')}
                                </span>
                            </p>
                        </div>
                        <div className={styles.profileField}>
                            <label>{t('doctor.profile.memberSince')}</label>
                            <p>{new Date(userData?.created_at).toLocaleDateString('en-US', {
                                month: 'long',
                                year: 'numeric'
                            })}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h2>{t('doctor.profile.accountSettings')}</h2>
                    <div className={styles.actions}>
                        <Link href="/doctor/profile/edit" className="btn btn-outline">{t('doctor.profile.editProfile')}</Link>
                        <button className="btn btn-outline">{t('doctor.profile.changePassword')}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
