'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './symptoms.module.css'
import {
    Activity,
    Save,
    Calendar,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react'

interface SymptomLog {
    id: string
    log_date: string
    pain_level: number
    fatigue_level: number
    bleeding: boolean
    notes: string
    symptoms: Record<string, boolean>
}

export default function SymptomTrackerPage() {
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [logs, setLogs] = useState<SymptomLog[]>([])
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [painLevel, setPainLevel] = useState(0)
    const [fatigueLevel, setFatigueLevel] = useState(0)
    const [bleeding, setBleeding] = useState(false)
    const [notes, setNotes] = useState('')

    // Specific Symptoms State
    const [specificSymptoms, setSpecificSymptoms] = useState<{ [key: string]: boolean }>({
        nausea: false,
        vomiting: false,
        fever: false,
        appetite_loss: false,
        headache: false,
        discharge: false
    })

    const handleSymptomChange = (key: string) => {
        setSpecificSymptoms(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const fetchLogs = useCallback(async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: patient } = await supabase
                .from('patients')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (patient) {
                const { data } = await supabase
                    .from('symptoms_log')
                    .select('*')
                    .eq('patient_id', patient.id)
                    .order('log_date', { ascending: false })

                setLogs(data || [])
            }
        } catch (err) {
            console.error('Error fetching logs:', err)
        } finally {
            setIsLoading(false)
        }
    }, [supabase])

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        setSuccess(false)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const { data: patient } = await supabase
                .from('patients')
                .select('id')
                .eq('user_id', user.id)
                .single()

            if (!patient) throw new Error('Patient profile not found')

            const { error: insertError } = await supabase
                .from('symptoms_log')
                .insert({
                    patient_id: patient.id,
                    log_date: new Date().toISOString().split('T')[0],
                    pain_level: painLevel,
                    fatigue_level: fatigueLevel,
                    bleeding: bleeding,
                    notes: notes,
                    symptoms: specificSymptoms
                })

            if (insertError) throw insertError

            setSuccess(true)
            setNotes('')
            // Reset checkboxes
            setSpecificSymptoms({
                nausea: false,
                vomiting: false,
                fever: false,
                appetite_loss: false,
                headache: false,
                discharge: false
            })
            fetchLogs() // Refresh list

            setTimeout(() => setSuccess(false), 3000)

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to save symptom log'
            setError(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Symptom Tracker</h1>
            <p className={styles.subtitle}>
                Log your daily symptoms to help your doctor monitor your progress.
            </p>

            <div className={styles.grid}>
                {/* Form Section */}
                <div className={styles.formCard}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity className="text-blue-600" size={24} />
                        Log Today&apos;s Symptoms
                    </h2>

                    {error && (
                        <div className="alert alert-error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            <CheckCircle2 size={18} />
                            <span>Log saved successfully!</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Pain Level (0-10)</label>
                            <div className={styles.rangeContainer}>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={painLevel}
                                    onChange={(e) => setPainLevel(parseInt(e.target.value))}
                                    className={styles.rangeInput}
                                    style={{ background: `linear-gradient(to right, #22c55e 0%, #ef4444 100%)` }}
                                />
                                <span className={styles.rangeValue}>{painLevel}</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Fatigue Level (0-10)</label>
                            <div className={styles.rangeContainer}>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={fatigueLevel}
                                    onChange={(e) => setFatigueLevel(parseInt(e.target.value))}
                                    className={styles.rangeInput}
                                    style={{ background: `linear-gradient(to right, #22c55e 0%, #eab308 100%)` }}
                                />
                                <span className={styles.rangeValue}>{fatigueLevel}</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Specific Symptoms</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <input type="checkbox" checked={specificSymptoms.nausea} onChange={() => handleSymptomChange('nausea')} />
                                    Nausea
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <input type="checkbox" checked={specificSymptoms.vomiting} onChange={() => handleSymptomChange('vomiting')} />
                                    Vomiting
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <input type="checkbox" checked={specificSymptoms.fever} onChange={() => handleSymptomChange('fever')} />
                                    Fever
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <input type="checkbox" checked={specificSymptoms.appetite_loss} onChange={() => handleSymptomChange('appetite_loss')} />
                                    Loss of Appetite
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <input type="checkbox" checked={specificSymptoms.headache} onChange={() => handleSymptomChange('headache')} />
                                    Headache
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    <input type="checkbox" checked={specificSymptoms.discharge} onChange={() => handleSymptomChange('discharge')} />
                                    Vaginal Discharge
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={bleeding}
                                    onChange={(e) => setBleeding(e.target.checked)}
                                    style={{ width: '1.2rem', height: '1.2rem' }}
                                />
                                Experiencing Abnormal Bleeding?
                            </label>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Additional Notes</label>
                            <textarea
                                className="form-textarea"
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Any other symptoms or concerns..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Log
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* History Section */}
                <div className={styles.historyCard}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar className="text-blue-600" size={24} />
                        History
                    </h2>

                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                            <Loader2 className="animate-spin text-blue-600" size={32} />
                        </div>
                    ) : logs.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>
                            No logs found. Start by tracking your symptoms today.
                        </p>
                    ) : (
                        <div className={styles.historyList}>
                            {logs.map((log) => (
                                <div key={log.id} className={styles.historyItem}>
                                    <div className={styles.historyHeader}>
                                        <div className={styles.historyDate}>
                                            {new Date(log.log_date).toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        {log.bleeding && (
                                            <span className="badge badge-error">Bleeding</span>
                                        )}
                                    </div>
                                    <div className={styles.historyStats}>
                                        <span className={styles.stat}>
                                            <span style={{ fontWeight: 600 }}>Pain:</span>
                                            <span style={{
                                                color: log.pain_level > 5 ? 'var(--color-error)' : 'inherit',
                                                fontWeight: log.pain_level > 5 ? 600 : 400
                                            }}>{log.pain_level}/10</span>
                                        </span>
                                        <span className={styles.stat}>
                                            <span style={{ fontWeight: 600 }}>Fatigue:</span>
                                            <span>{log.fatigue_level}/10</span>
                                        </span>
                                    </div>

                                    {log.symptoms && Object.values(log.symptoms).some(v => v) && (
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                            {Object.entries(log.symptoms).filter((entry) => entry[1]).map(([k]) => (
                                                <span key={k} style={{
                                                    fontSize: '0.75rem',
                                                    background: 'var(--color-surface-elevated)',
                                                    padding: '2px 8px',
                                                    borderRadius: '12px',
                                                    border: '1px solid var(--color-border)',
                                                    textTransform: 'capitalize'
                                                }}>
                                                    {k.replace('_', ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {log.notes && (
                                        <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.875rem', fontStyle: 'italic' }}>
                                            &quot;{log.notes}&quot;
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
