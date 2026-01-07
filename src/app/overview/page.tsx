import Navbar from '@/components/landing/Navbar'
import styles from '@/app/page.module.css'

export default function OverviewPage() {
    return (
        <div className={styles.container}>
            <Navbar />
            <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}>
                <h1 className={styles.title} style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Overview</h1>
                <p className={styles.description} style={{ maxWidth: '100%' }}>
                    Cervical Cancer Care is dedicated to providing accessible, high-quality screenings and medical support for women worldwide.
                    Our platform bridges the gap between patients and specialized doctors, ensuring early detection and effective treatment plans.
                </p>
                <div style={{ marginTop: '2rem', fontSize: '1.1rem', lineHeight: '1.8', color: '#475569' }}>
                    <p>
                        We leverage technology to simplify appointment scheduling, record keeping, and doctor-patient communication.
                        Our goal is to reduce cervical cancer mortality rates through timely intervention and education.
                    </p>
                </div>
            </div>
        </div>
    )
}
