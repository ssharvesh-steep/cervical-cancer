'use client'

import React from 'react'
import LogoutButton from '../components/LogoutButton'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'

export default function SettingsPage() {
    const { t } = useLanguage()

    return (
        <div style={{ padding: '2rem' }}>
            <h1>{t('patient.settings.title')}</h1>
            <p>{t('patient.settings.subtitle')}</p>

            <div style={{ marginTop: '2rem', maxWidth: '600px', display: 'grid', gap: '1rem' }}>
                <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <h3>{t('patient.settings.profileSettings')}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>{t('patient.settings.updatePersonalInfo')}</p>
                    <Link href="/patient/profile/edit" style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>{t('patient.settings.editProfile')}</Link>
                </div>

                <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', borderColor: '#fee2e2' }}>
                    <h3 style={{ color: '#ef4444' }}>{t('patient.settings.session')}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>{t('patient.settings.signOutDescription')}</p>
                    <LogoutButton />
                </div>
            </div>
        </div>
    )
}
