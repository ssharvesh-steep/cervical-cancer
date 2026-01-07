'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './SymptomLogger.module.css'

interface SymptomLoggerProps {
    patientId: string
}

const commonSymptoms = [
    'Abnormal bleeding',
    'Pelvic pain',
    'Pain during intercourse',
    'Unusual discharge',
    'Fatigue',
    'Weight loss',
    'Back pain',
    'Leg swelling',
    'Loss of appetite',
]

export default function SymptomLogger({ patientId }: SymptomLoggerProps) {
    const router = useRouter()
    const supabase = createClient()
    const [formData, setFormData] = useState({
        logDate: new Date().toISOString().split('T')[0],
        symptoms: [] as string[],
        painScale: 5,
        bleeding: false,
        bleedingSeverity: null as 'light' | 'moderate' | 'heavy' | null,
        fatigueLevel: 5,
        notes: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSymptomToggle = (symptom: string) => {
        setFormData(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setLoading(true)

        try {
            const { error: submitError } = await supabase
                .from('symptoms_log')
                .insert({
                    patient_id: patientId,
                    log_date: formData.logDate,
                    symptoms: formData.symptoms,
                    pain_scale: formData.painScale,
                    bleeding: formData.bleeding,
                    bleeding_severity: formData.bleedingSeverity,
                    fatigue_level: formData.fatigueLevel,
                    notes: formData.notes || null,
                })

            if (submitError) throw submitError

            setSuccess(true)
            // Reset form
            setFormData({
                logDate: new Date().toISOString().split('T')[0],
                symptoms: [],
                painScale: 5,
                bleeding: false,
                bleedingSeverity: null,
                fatigueLevel: 5,
                notes: '',
            })

            setTimeout(() => {
                router.refresh()
            }, 1000)

        } catch (err) {
            console.error('Symptom log error:', err)
            setError('Failed to log symptoms. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
                <label htmlFor="logDate" className="form-label">Date</label>
                <input
                    id="logDate"
                    type="date"
                    value={formData.logDate}
                    onChange={(e) => setFormData({ ...formData, logDate: e.target.value })}
                    className="form-input"
                    required
                    max={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className="form-group">
                <label className="form-label">Symptoms</label>
                <div className={styles.symptomsGrid}>
                    {commonSymptoms.map((symptom) => (
                        <button
                            key={symptom}
                            type="button"
                            onClick={() => handleSymptomToggle(symptom)}
                            className={`${styles.symptomButton} ${formData.symptoms.includes(symptom) ? styles.selected : ''
                                }`}
                        >
                            {symptom}
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="painScale" className="form-label">
                    Pain Level: {formData.painScale}/10
                </label>
                <input
                    id="painScale"
                    type="range"
                    min="1"
                    max="10"
                    value={formData.painScale}
                    onChange={(e) => setFormData({ ...formData, painScale: parseInt(e.target.value) })}
                    className={styles.slider}
                />
                <div className={styles.scaleLabels}>
                    <span>Mild</span>
                    <span>Severe</span>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">
                    <input
                        type="checkbox"
                        checked={formData.bleeding}
                        onChange={(e) => setFormData({ ...formData, bleeding: e.target.checked })}
                        className={styles.checkbox}
                    />
                    Experiencing bleeding
                </label>

                {formData.bleeding && (
                    <div className={styles.bleedingOptions}>
                        {(['light', 'moderate', 'heavy'] as const).map((severity) => (
                            <label key={severity} className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="bleedingSeverity"
                                    value={severity}
                                    checked={formData.bleedingSeverity === severity}
                                    onChange={() => setFormData({ ...formData, bleedingSeverity: severity })}
                                    className={styles.radio}
                                />
                                {severity.charAt(0).toUpperCase() + severity.slice(1)}
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="fatigueLevel" className="form-label">
                    Fatigue Level: {formData.fatigueLevel}/10
                </label>
                <input
                    id="fatigueLevel"
                    type="range"
                    min="1"
                    max="10"
                    value={formData.fatigueLevel}
                    onChange={(e) => setFormData({ ...formData, fatigueLevel: parseInt(e.target.value) })}
                    className={styles.slider}
                />
                <div className={styles.scaleLabels}>
                    <span>Energetic</span>
                    <span>Exhausted</span>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes" className="form-label">Additional Notes</label>
                <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="form-textarea"
                    rows={4}
                    placeholder="Any additional details about your symptoms..."
                />
            </div>

            {error && (
                <div className="alert alert-error">{error}</div>
            )}

            {success && (
                <div className="alert alert-success">Symptoms logged successfully!</div>
            )}

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || formData.symptoms.length === 0}
                style={{ width: '100%' }}
            >
                {loading ? 'Logging...' : 'Log Symptoms'}
            </button>
        </form>
    )
}
