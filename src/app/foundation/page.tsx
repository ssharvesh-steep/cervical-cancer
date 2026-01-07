import Navbar from '@/components/landing/Navbar'
import styles from '@/app/page.module.css'

export default function FoundationPage() {
    return (
        <div className={styles.container}>
            <Navbar />
            <div style={{ maxWidth: 800, margin: '4rem auto', padding: '0 2rem' }}>
                <h1 className={styles.title} style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Foundation</h1>
                <p className={styles.description} style={{ maxWidth: '100%' }}>
                    Built on the principles of empathy, accuracy, and accessibility. Our foundation supports initiatives to provide free screenings in underserved communities.
                </p>
                <div style={{ marginTop: '2rem', fontSize: '1.1rem', lineHeight: '1.8', color: '#475569' }}>
                    <p>
                        We partner with global health organizations to bring awareness and resources to where they are needed most.
                        Join us in our mission to create a world free of cervical cancer.
                    </p>
                </div>
            </div>
        </div>
    )
}
