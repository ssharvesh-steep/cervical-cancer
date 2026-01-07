import RegisterForm from '@/components/auth/RegisterForm'
import styles from './page.module.css'

export const metadata = {
    title: 'Create Account - Cervical Cancer Care',
    description: 'Create your account to get started',
}

export default function RegisterPage() {
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
                        <h1>Create Account</h1>
                        <p>Join our cervical cancer care platform</p>
                    </div>
                    <RegisterForm />
                </div>
            </div>
        </div>
    )
}
