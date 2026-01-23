'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import styles from './page.module.css'

interface ProfileContentProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userData: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    patientData: any
}

export default function ProfileContent({ userData, patientData }: ProfileContentProps) {
    const { t } = useLanguage()

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>{t('patient.profile.title')}</h1>
                <p>{t('patient.profile.subtitle')}</p>
            </header>

            <div className={styles.content}>
                <div className="card">
                    <h2>{t('patient.profile.personalInfo')}</h2>
                    <div className={styles.profileSection}>
                        <div className={styles.profileField}>
                            <label>{t('patient.profile.fullName')}</label>
                            <p>{userData?.full_name}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>{t('patient.profile.email')}</label>
                            <p>{userData?.email}</p>
                        </div>
                        {userData?.phone && (
                            <div className={styles.profileField}>
                                <label>{t('patient.profile.phone')}</label>
                                <p>{userData.phone}</p>
                            </div>
                        )}
                        <div className={styles.profileField}>
                            <label>{t('patient.profile.accountType')}</label>
                            <p className={styles.roleBadge}>
                                <span className="badge badge-primary">{userData?.role}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {patientData && (
                    <div className="card">
                        <h2>{t('patient.profile.medicalInfo')}</h2>
                        <div className={styles.profileSection}>
                            {patientData.date_of_birth && (
                                <div className={styles.profileField}>
                                    <label>{t('patient.profile.dateOfBirth')}</label>
                                    <p>{new Date(patientData.date_of_birth).toLocaleDateString()}</p>
                                </div>
                            )}
                            {patientData.age && (
                                <div className={styles.profileField}>
                                    <label>{t('patient.profile.age')}</label>
                                    <p>{patientData.age} {t('patient.profile.years')}</p>
                                </div>
                            )}
                            {patientData.blood_group && (
                                <div className={styles.profileField}>
                                    <label>{t('patient.profile.bloodGroup')}</label>
                                    <p>{patientData.blood_group}</p>
                                </div>
                            )}
                            {patientData.marital_status && (
                                <div className={styles.profileField}>
                                    <label>{t('patient.profile.maritalStatus')}</label>
                                    <p>{patientData.marital_status}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {patientData && (patientData.emergency_contact_name || patientData.emergency_contact_phone) && (
                    <div className="card">
                        <h2>{t('patient.profile.emergencyContact')}</h2>
                        <div className={styles.profileSection}>
                            {patientData.emergency_contact_name && (
                                <div className={styles.profileField}>
                                    <label>{t('patient.profile.contactName')}</label>
                                    <p>{patientData.emergency_contact_name}</p>
                                </div>
                            )}
                            {patientData.emergency_contact_phone && (
                                <div className={styles.profileField}>
                                    <label>{t('patient.profile.contactPhone')}</label>
                                    <p>{patientData.emergency_contact_phone}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="card">
                    <h2>{t('patient.profile.accountSettings')}</h2>
                    <div className={styles.actions}>
                        <Link href="/patient/profile/edit" className="btn btn-outline">{t('patient.profile.editProfile')}</Link>
                        <button className="btn btn-outline">{t('patient.profile.changePassword')}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
