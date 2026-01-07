import Link from 'next/link'
import styles from '@/app/page.module.css'

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>
                {/* Placeholder Logo Icon */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="16" fill="#E0F2FE" />
                    <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24C20.4183 24 24 20.4183 24 16C24 11.5817 20.4183 8 16 8ZM16 21C13.2386 21 11 18.7614 11 16C11 13.2386 13.2386 11 16 11C18.7614 11 21 13.2386 21 16C21 18.7614 18.7614 21 16 21Z" fill="#0EA5E9" />
                </svg>
                Cervical Cancer Care
            </Link>

            <div className={styles.navLinks}>
                <Link href="/overview" className={styles.navLink}>Overview</Link>
                <Link href="/foundation" className={styles.navLink}>Foundation</Link>
                <Link href="/solutions" className={styles.navLink}>Solutions</Link>
                <Link href="/resources" className={styles.navLink}>Resources</Link>
                <Link href="/publication" className={styles.navLink}>Publication</Link>
            </div>

            <div className={styles.authButtons}>
                <Link href="/login" className={styles.signInBtn}>
                    SIGN IN
                </Link>
                <Link href="/register" className={styles.signUpBtn}>
                    SIGN UP
                </Link>
            </div>
        </nav>
    )
}
