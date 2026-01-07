import LoginForm from '@/components/auth/LoginForm'
import styles from './page.module.css'

export const metadata = {
    title: 'Sign In - Cervical Cancer Care',
    description: 'Sign in to your account',
}

export default function LoginPage() {
    return (
        <div className={styles.container}>
            <div className={styles.imageSection}>
                <div className={styles.imageOverlay} />
                <div className={styles.imageContent}>
                    <h2>Advancing Cervical Cancer Care</h2>
                    <p>Join our network of healthcare professionals dedicated to early detection and prevention.</p>
                </div>
            </div>
            <div className={styles.formSection}>
                <div className={styles.formWrapper}>
                    <div className={styles.header}>
                        <h1>Welcome Back</h1>
                        <p>Sign in to your doctor dashboard</p>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}
