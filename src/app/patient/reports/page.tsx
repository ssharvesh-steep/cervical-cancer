'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText, Download, Loader2, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface MedicalReport {
    id: string
    created_at: string
    file_name: string
    file_path: string
    report_type: string
    description?: string
}

export default function ReportsPage() {
    const [reports, setReports] = useState<MedicalReport[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()
    const { t } = useLanguage()

    useEffect(() => {
        async function fetchReports() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                // First get the patient record
                const { data: patient } = await supabase
                    .from('patients')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()

                if (!patient) {
                    setError('Patient profile not found.')
                    return
                }

                // fetch reports
                const { data, error: reportsError } = await supabase
                    .from('medical_reports')
                    .select('*')
                    .eq('patient_id', patient.id)
                    .order('created_at', { ascending: false })

                if (reportsError) throw reportsError

                setReports(data || [])
            } catch (err: unknown) {
                console.error('Error fetching reports:', err instanceof Error ? err.message : JSON.stringify(err, null, 2))
                setError('Failed to load reports.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchReports()
    }, [supabase])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-12">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        )
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
            </div>
        )
    }

    return (
        <div className="card">
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>{t('patient.reports.title')}</h1>

            {reports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-secondary)' }}>
                    <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>{t('patient.reports.noReports')}</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                background: 'var(--color-background)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    background: '#e0e7ff',
                                    color: '#4338ca',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{report.report_type}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                        {new Date(report.created_at).toLocaleDateString()}
                                        {report.description && ` • ${report.description}`}
                                    </div>
                                </div>
                            </div>

                            <a
                                href={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/medical-documents/${report.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Download size={16} />
                                {t('patient.reports.view')}
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
