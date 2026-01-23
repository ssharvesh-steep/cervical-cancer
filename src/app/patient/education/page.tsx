'use client'

import React, { useState } from 'react'
import styles from './page.module.css'
import { X } from 'lucide-react'

export default function PatientEducationPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedArticle, setSelectedArticle] = useState<any>(null)

    const articles = [
        {
            id: 1,
            title: 'Understanding Cervical Cancer',
            category: 'Awareness',
            date: 'Jan 02, 2026',
            excerpt: 'Cervical cancer is highly preventable. Learn about the causes, risk factors, and how regular screening saves lives.',
            content: `Cervical cancer develops in a woman's cervix (the entrance to the uterus from the vagina). Almost all cervical cancer cases (99%) are linked to infection with high-risk human papillomaviruses (HPV), an extremely common virus transmitted through sexual contact.

**Key Facts:**
- **Prevention**: Effective primary (vaccination) and secondary (screening) prevention approaches will prevent most cervical cancer cases.
- **Curability**: When diagnosed, cervical cancer is one of the most successfully treatable forms of cancer, as long as it is detected early and managed effectively. 
- **Symptoms**: Early-stage cervical cancer generally produces no signs or symptoms. Signs of more advanced cancer include abnormal vaginal bleeding.

**Who is at risk?**
All women are at risk for cervical cancer. The risk is higher for those with persistent HPV infection, a weakened immune system, or who smoke.`,
            image: '🩺'
        },
        {
            id: 2,
            title: 'The Importance of Hydration',
            category: 'Wellness',
            date: 'Dec 29, 2025',
            excerpt: 'Staying hydrated is key to recovery and overall health. Discover simple tips to increase your daily water intake.',
            content: `Water is essential for every cell in your body to function correctly.

**Benefits of Staying Hydrated:**
1. **Boosts Energy**: Dehydration can lead to fatigue and mood swings.
2. **Improves Skin Health**: proper hydration keeps your skin elastic and healthy.
3. **Supports Digestion**: Water helps break down food so that your body can absorb the nutrients.

**Tips to Drink More Water:**
- Carry a reusable water bottle with you everywhere.
- Add a slice of lemon or cucumber for flavor.
- Drink a glass of water before every meal.
- Set reminders on your phone if you often forget.`,
            image: '💧'
        },
        {
            id: 3,
            title: '5 Myths About HPV Vaccines',
            category: 'Facts',
            date: 'Dec 20, 2025',
            excerpt: 'There is a lot of misinformation out there. We debut common myths about the HPV vaccine and its safety.',
            content: `Lets clear up some common misconceptions about the HPV vaccine:

**Myth 1: "Only girls need the HPV vaccine."**
*Fact*: HPV affects both males and females. Vaccination protects everyone from various cancers caused by the virus.

**Myth 2: "The vaccine causes fertility issues."**
*Fact*: There is no evidence suggesting the HPV vaccine affects fertility. In fact, by preventing cervical cancer and the need for treatment, it protects fertility.

**Myth 3: "It's too late for me to get vaccinated."**
*Fact*: While it's most effective when given at a younger age (9-14), it is recommended for everyone up to age 26, and in some cases up to age 45.`,
            image: '🛡️'
        },
        {
            id: 4,
            title: 'Managing Anxiety Before Screening',
            category: 'Mental Health',
            date: 'Dec 12, 2025',
            excerpt: 'Feeling nervous is normal. Here are breathing techniques and preparation tips to make your appointment stress-free.',
            content: `It is completely normal to feel anxious before a cervical screening (Pap smear). Here are some ways to make the experience more comfortable:

- **Talk to your Doctor**: Let them know you are nervous. They can explain the process step-by-step and go at your pace.
- **Wear Comfortable Clothing**: Wear a skirt or dress so you only need to remove your underwear, which can make you feel less exposed.
- **Practice Deep Breathing**: Try the 4-7-8 technique: Inhale for 4 seconds, hold for 7, and exhale for 8. This signals your nervous system to relax.
- **Bring a Distraction**: Listen to music or a podcast during the appointment if allowed.`,
            image: '🧘‍♀️'
        },
        {
            id: 5,
            title: 'Post-Screening Care Guide',
            category: 'Guide',
            date: 'Dec 05, 2025',
            excerpt: 'What to expect after your Pap smear or HPV test? Learn about spotting, results timing, and next steps.',
            content: `After your screening, you can usually go back to your normal activities immediately.

**What to expect:**
- **Spotting**: You may experience some light bleeding or spotting for a day or two. This is normal.
- **Results**: It typically takes 1-3 weeks to get your results. The clinic will contact you.

**Understanding Your Results:**
- **Normal/Negative**: No abnormalities found. You will be invited for your next routine screening in 3-5 years.
- **Abnormal/Positive**: This does NOT mean you have cancer. It usually means there are some cell changes that need monitoring or simple treatment. Your doctor will explain the next steps clearly.`,
            image: '📝'
        }
    ]

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Health & Wellness Blog</h1>
                <p style={{ color: '#64748b' }}>Tips, guides, and news to help you stay healthy and informed.</p>
            </header>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {articles.map((article) => (
                    <div key={article.id} style={{
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{article.image}</div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{
                                fontSize: '0.75rem',
                                padding: '0.25rem 0.75rem',
                                backgroundColor: '#f0f9ff',
                                color: '#0369a1',
                                borderRadius: '999px',
                                fontWeight: 600
                            }}>
                                {article.category}
                            </span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                            {article.title}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6', marginBottom: '1rem', flex: 1 }}>
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
                            Read Article →
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
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'start', backgroundColor: '#fafafa' }}>
                            <div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: '#f0f9ff',
                                    color: '#0369a1',
                                    borderRadius: '999px',
                                    fontWeight: 600,
                                    marginBottom: '0.5rem',
                                    display: 'inline-block'
                                }}>
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
