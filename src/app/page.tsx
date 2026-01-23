'use client'

import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'
import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'
import { useLanguage } from '@/context/LanguageContext'

export default function HomePage() {
    const { t } = useLanguage()

    return (
        <div className={styles.container}>
            <div className={styles.bgShape1}></div>

            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <main className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>
                        {t('landing.heroTitle')}
                    </h1>
                    <p className={styles.description}>
                        {t('landing.heroSubtitle')}{' '}
                        <Link href="/register" className={styles.descriptionLink}>{t('landing.getStarted')}</Link>
                    </p>
                    <Link href="/register" className={styles.ctaButton}>
                        {t('landing.learnMore')}
                        <ArrowRight size={20} />
                    </Link>
                </div>

                <div className={styles.heroImageContainer}>
                    <Image
                        src="/landing-hero.png"
                        alt="Active lifestyle illustration"
                        width={800}
                        height={600}
                        priority
                        className={styles.heroImage}
                    />
                </div>
            </main>
        </div>
    )
}
