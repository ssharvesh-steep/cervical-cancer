import Navbar from '@/components/landing/Navbar'
import styles from '@/app/page.module.css'

export default function SolutionsPage() {
    return (
        <div className={styles.container}>
            <Navbar />
            <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}>
                <h1 className={styles.title} style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Solutions</h1>
                <p className={styles.description} style={{ maxWidth: '100%' }}>
                    Comprehensive digital health solutions tailored for cervical cancer prevention and care.
                </p>
                <div style={{ marginTop: '2rem', display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                    <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0ea5e9', marginBottom: '0.5rem' }}>Digital Screening Records</h3>
                        <p style={{ color: '#64748b' }}>Securely store and share your screening history with any specialist.</p>
                    </div>
                    <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0ea5e9', marginBottom: '0.5rem' }}>Tele-Consultations</h3>
                        <p style={{ color: '#64748b' }}>Connect with oncologists and gynecologists from the comfort of your home.</p>
                    </div>
                    <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0ea5e9', marginBottom: '0.5rem' }}>AI-Powered Analysis</h3>
                        <p style={{ color: '#64748b' }}>Advanced tools to assist doctors in early diagnosis and risk assessment.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
