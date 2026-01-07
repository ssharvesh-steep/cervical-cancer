'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

export default function BlogPage() {
    const [selectedArticle, setSelectedArticle] = useState<any>(null)

    const articles = [
        {
            id: 1,
            title: 'New Screening Guidelines 2026',
            category: 'Guidelines',
            date: 'Jan 05, 2026',
            excerpt: 'The WHO has updated the recommended frequency for HPV DNA testing for women aged 30-49.',
            content: `The World Health Organization (WHO) has released updated guidelines for cervical cancer screening. The key updates include:

1. **Frequency**: It is now recommended that women aged 30 to 49 years be screened with high-performance HPV DNA testing every 5 to 10 years, rather than every 3 years.
2. **Primary Screening Method**: HPV DNA testing is preferred over VIA (Visual Inspection with Acetic Acid) or cytology (Pap smear) due to its higher sensitivity.
3. **Self-Sampling**: To increase coverage, self-sampling for HPV testing is strongly encouraged in regions with limited access to clinics.

These changes aim to reduce the burden on healthcare systems while maintaining effective detection rates for pre-cancerous lesions.`,
            color: 'bg-blue-100 text-blue-800'
        },
        {
            id: 2,
            title: 'Advances in HPV Vaccination',
            category: 'Research',
            date: 'Dec 28, 2025',
            excerpt: 'Single-dose efficacy studies show promising results for long-term protection in adolescents.',
            content: `Recent clinical trials suggest that a single dose of the HPV vaccine may offer protection comparable to the standard two-dose or three-dose schedules.

**Study Findings:**
- A study conducted over 5 years involving 10,000 adolescents showed 98% efficacy in preventing persistent HPV 16/18 infections with a single dose.
- Antibody levels remained stable and significantly higher than natural immunity.

**Implications:**
Adopting a single-dose schedule could drastically reduce logistical challenges and costs, potentially accelerating the elimination of cervical cancer in low-resource settings.`,
            color: 'bg-purple-100 text-purple-800'
        },
        {
            id: 3,
            title: 'Tele-medicine Best Practices',
            category: 'Practice',
            date: 'Dec 15, 2025',
            excerpt: 'How to conduct effective follow-up consultations for cervical screening abnormalities remotely.',
            content: `Tele-medicine has become a vital tool for follow-up care. Here are best practices for discussing screening abnormalities remotely:

- **Privacy**: Ensure the patient is in a private space before starting the call.
- **Visual Aids**: Use screen sharing to show diagrams explaining the difference between 'abnormal cells' and 'cancer'.
- **Clear Action Plan**: Send a digital summary of the next steps (e.g., date for colposcopy) immediately after the call.
- **Empathy**: Validating patient anxiety is crucial when they cannot see your non-verbal cues clearly. Pausing frequently to ask for questions is recommended.`,
            color: 'bg-green-100 text-green-800'
        },
        {
            id: 4,
            title: 'AI in Early Detection',
            category: 'Technology',
            date: 'Dec 02, 2025',
            excerpt: 'New algorithms demonstrate 95% sensitivity in identifying pre-cancerous lesions from colposcopy images.',
            content: `Artificial Intelligence is transforming colposcopy. A new deep-learning algorithm trained on over 100,000 cervical images has achieved a sensitivity of 95%, surpassing manual interpretation by general gynecologists.

**Key Features:**
- **Real-time Analysis**: Takes only 2 seconds to analyze an image during the exam.
- **Heatmaps**: Highlights suspicious areas in green/red to guide biopsies.
- **Integration**: Compatible with standard digital colposcopes.

This technology acts as a "second pair of eyes," significantly reducing missed diagnoses in high-volume clinics.`,
            color: 'bg-indigo-100 text-indigo-800'
        }
    ]

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>Medical Updates</h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Latest research, guidelines, and technology in cervical cancer care.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {articles.map((article) => (
                    <div key={article.id} style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${article.color}`}>
                                {article.category}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{article.date}</span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                            {article.title}
                        </h3>
                        <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
                            {article.excerpt}
                        </p>
                        <button
                            onClick={() => setSelectedArticle(article)}
                            style={{
                                color: '#0ea5e9',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                textAlign: 'left',
                                width: 'fit-content'
                            }}
                        >
                            Read Full Article →
                        </button>
                    </div>
                ))}
            </div>

            {/* Full Article Modal */}
            {selectedArticle && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '700px',
                        maxHeight: '85vh',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Header */}
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${selectedArticle.color}`} style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                                    {selectedArticle.category}
                                </span>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.2' }}>{selectedArticle.title}</h2>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.5rem' }}>Published on {selectedArticle.date}</p>
                            </div>
                            <button
                                onClick={() => setSelectedArticle(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '2rem', overflowY: 'auto', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap' }}>
                            {selectedArticle.content}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
