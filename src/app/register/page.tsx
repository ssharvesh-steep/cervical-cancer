'use client'

import RegisterForm from '@/components/auth/RegisterForm'
import styles from './page.module.css'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '@/components/shared/LanguageSwitcher'

export default function RegisterPage() {
    const { t } = useLanguage()

    return (
        <div className={styles.container}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 1000 }}>
                <LanguageSwitcher />
            </div>
            <div className={styles.imageSection}>
                <div className={styles.imageOverlay} />
                <div className={styles.imageContent}>
                    <h2>{t('landing.heroTitle')}</h2>
                    <p>{t('landing.heroSubtitle').substring(0, 100)}...</p>
                </div>
            </div>
            <div className={styles.formSection}>
                <div className={styles.formWrapper}>
                    <div className={styles.header}>
                        <h1>{t('auth.createAccount')}</h1>
                        <p>{t('auth.createAccountSubtitle')}</p>
                    </div>
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}
