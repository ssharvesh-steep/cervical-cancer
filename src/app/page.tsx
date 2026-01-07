import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'
import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/landing/Navbar'

export default function HomePage() {
    return (
        <div className={styles.container}>
            <div className={styles.bgShape1}></div>

            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <main className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>
                        Healthcare
                        <span className={styles.titleHighlight}>Unlocked</span>
                    </h1>
                    <p className={styles.description}>
                        Whether you are at work, home, traveling, or with family.
                        We ensure that you have access to screening records,
                        expert doctor consultations, and continuous health
                        monitoring whenever you need it. Your health is our priority. <Link href="/register" className={styles.descriptionLink}>Get Started</Link>
                    </p>
                    <Link href="/register" className={styles.ctaButton}>
                        LEARN MORE
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
