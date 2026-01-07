import Navbar from '@/components/landing/Navbar'
import styles from '@/app/page.module.css'

export default function ResourcesPage() {
    return (
        <div className={styles.container}>
            <Navbar />
            <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}>
                <h1 className={styles.title} style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Resources</h1>
                <p className={styles.description} style={{ maxWidth: '100%' }}>
                    Educational materials, guides, and support networks for patients and families.
                </p>
                <ul style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0 }}>
                    <li style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <a href="#" style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '1.2rem', textDecoration: 'none' }}>Patient Guide to HPV Screening</a>
                        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>A step-by-step guide on what to expect during your screening.</p>
                    </li>
                    <li style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <a href="#" style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '1.2rem', textDecoration: 'none' }}>Understanding your Results</a>
                        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>How to interpret medical reports and what to do next.</p>
                    </li>
                    <li style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <a href="#" style={{ color: '#0ea5e9', fontWeight: 600, fontSize: '1.2rem', textDecoration: 'none' }}>Support Groups</a>
                        <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Connect with a community of survivors and medical experts.</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}
