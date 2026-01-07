import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SymptomLogger from '@/components/patient/SymptomLogger'
import styles from './page.module.css'

export default async function PatientSymptomsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get patient data
    const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user.id)
        .single() as { data: any | null }

    // Get recent symptom logs
    const { data: recentLogs } = await supabase
        .from('symptoms_log')
        .select('*')
        .eq('patient_id', patientData?.id)
        .order('log_date', { ascending: false })
        .limit(10) as { data: any[] | null }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Symptom Tracker</h1>
                <p>Log your daily symptoms to help your doctor monitor your health</p>
            </header>

            <div className={styles.content}>
                <div className={styles.loggerSection}>
                    <h2>Log Today's Symptoms</h2>
                    <SymptomLogger patientId={patientData?.id} />
                </div>

                <div className={styles.historySection}>
                    <h2>Recent Logs</h2>
                    {recentLogs && recentLogs.length > 0 ? (
                        <div className={styles.logsList}>
                            {recentLogs.map((log) => (
                                <div key={log.id} className="card">
                                    <div className={styles.logHeader}>
                                        <span className={styles.logDate}>
                                            {new Date(log.log_date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                        <div className={styles.badges}>
                                            {log.bleeding && (
                                                <span className="badge badge-error">Bleeding</span>
                                            )}
                                            {log.pain_scale >= 7 && (
                                                <span className="badge badge-warning">High Pain</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.logDetails}>
                                        <div className={styles.symptoms}>
                                            <strong>Symptoms:</strong>
                                            <div className={styles.symptomTags}>
                                                {log.symptoms.map((symptom: string, idx: number) => (
                                                    <span key={idx} className={styles.symptomTag}>
                                                        {symptom}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.metrics}>
                                            <div className={styles.metric}>
                                                <span className={styles.metricLabel}>Pain:</span>
                                                <span className={styles.metricValue}>{log.pain_scale}/10</span>
                                            </div>
                                            <div className={styles.metric}>
                                                <span className={styles.metricLabel}>Fatigue:</span>
                                                <span className={styles.metricValue}>{log.fatigue_level}/10</span>
                                            </div>
                                            {log.bleeding && (
                                                <div className={styles.metric}>
                                                    <span className={styles.metricLabel}>Bleeding:</span>
                                                    <span className={styles.metricValue}>{log.bleeding_severity}</span>
                                                </div>
                                            )}
                                        </div>

                                        {log.notes && (
                                            <div className={styles.notes}>
                                                <strong>Notes:</strong>
                                                <p>{log.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyState}>No symptom logs yet. Start tracking your symptoms above.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
