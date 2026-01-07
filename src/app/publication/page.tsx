import Navbar from '@/components/landing/Navbar'
import styles from '@/app/page.module.css'

export default function PublicationPage() {
    return (
        <div className={styles.container}>
            <Navbar />
            <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}>
                <h1 className={styles.title} style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Publication</h1>
                <p className={styles.description} style={{ maxWidth: '100%' }}>
                    Latest research, articles, and news in the field of cervical cancer prevention and treatment.
                </p>
                <div style={{ marginTop: '3rem' }}>
                    <article style={{ marginBottom: '3rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>January 2026</span>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#1e293b', margin: '0.5rem 0' }}>Advances in Early Detection Algorithms</h2>
                        <p style={{ color: '#475569', lineHeight: '1.6' }}>
                            A deep dive into how machine learning models are improving the accuracy of Pap smear analysis...
                        </p>
                        <a href="#" style={{ color: '#0ea5e9', fontWeight: 600, display: 'inline-block', marginTop: '1rem' }}>Read Article &rarr;</a>
                    </article>
                    <article style={{ marginBottom: '3rem' }}>
                        <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>December 2025</span>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#1e293b', margin: '0.5rem 0' }}>Global Vaccination Drive Impact Report</h2>
                        <p style={{ color: '#475569', lineHeight: '1.6' }}>
                            Analyzing the success rates of HPV vaccination programs in developing nations...
                        </p>
                        <a href="#" style={{ color: '#0ea5e9', fontWeight: 600, display: 'inline-block', marginTop: '1rem' }}>Read Article &rarr;</a>
                    </article>
                </div>
            </div>
        </div>
    )
}
