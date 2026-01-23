'use client'

import Link from 'next/link'
import styles from '@/app/page.module.css'
import { useLanguage } from '@/context/LanguageContext'
import LanguageSwitcher from '../shared/LanguageSwitcher'

export default function Navbar() {
    const { t } = useLanguage()

    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>
                {/* Placeholder Logo Icon */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#E0F2FE" />
                    <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8ZM16 21C13.2386 21 11 18.7614 11 16C11 13.2386 13.2386 11 16 11C18.7614 11 21 13.2386 21 16C21 18.7614 18.7614 21 16 21Z" fill="#0EA5E9" />
                </svg>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Cervical Cancer Care
                </span>
            </Link>

            {/* Desktop navigation links - hidden on mobile via CSS */}
            <div className={styles.navLinks}>
                <Link href="/overview" className={styles.navLink}>{t('landing.nav.overview')}</Link>
                <Link href="/foundation" className={styles.navLink}>{t('landing.nav.foundation')}</Link>
                <Link href="/solutions" className={styles.navLink}>{t('landing.nav.solutions')}</Link>
                <Link href="/resources" className={styles.navLink}>{t('landing.nav.resources')}</Link>
                <Link href="/publication" className={styles.navLink}>{t('landing.nav.publication')}</Link>
            </div>

            <div className={styles.authButtons}>
                <LanguageSwitcher />
                <Link href="/login" className={styles.signInBtn}>
                    {t('landing.nav.signIn')}
                </Link>
                <Link href="/register" className={styles.signUpBtn}>
                    {t('landing.nav.signUp')}
                </Link>
            </div>
        </nav>
    )
}
