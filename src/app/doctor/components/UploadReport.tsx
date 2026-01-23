'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UploadReportProps {
    patientId: string
    doctorId: string
}

export default function UploadReport({ patientId, doctorId }: UploadReportProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [reportType, setReportType] = useState('Lab Report')
    const [description, setDescription] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
                setError('File size exceeds 50MB limit.')
                return
            }
            setFile(selectedFile)
            setError(null)
            setSuccess(false)
        }
    }

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.')
            return
        }

        setIsUploading(true)
        setError(null)

        try {
            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${patientId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('medical-documents')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            // 2. Insert into Database
            const { error: dbError } = await supabase
                .from('medical_reports')
                .insert({
                    patient_id: patientId,
                    doctor_id: doctorId,
                    file_name: file.name,
                    file_path: fileName,
                    file_type: file.type,
                    report_type: reportType,
                    description: description
                })

            if (dbError) throw dbError

            setSuccess(true)
            setFile(null)
            setDescription('')
            setReportType('Lab Report')
            if (fileInputRef.current) fileInputRef.current.value = ''

            // Refresh the page to show new report
            router.refresh()

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000)

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload report. Please try again.'
            setError(errorMessage)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={20} className="text-blue-600" />
                Upload Medical Report
            </h3>

            {error && (
                <div style={{ padding: '0.75rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {success && (
                <div style={{ padding: '0.75rem', background: '#ecfdf5', color: '#059669', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <CheckCircle size={16} />
                    Report uploaded successfully!
                </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Report Type</label>
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                    >
                        <option value="Lab Report">Lab Report</option>
                        <option value="Imaging/Scan">Imaging/Scan</option>
                        <option value="Prescription">Prescription</option>
                        <option value="Discharge Summary">Discharge Summary</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Description (Optional)</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="E.g., Blood test results for Jan 2024"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>File Attachment</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            style={{
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                background: '#f3f4f6',
                                borderRadius: '0.375rem',
                                fontSize: '0.875rem',
                                color: '#374151',
                                border: '1px solid #d1d5db',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <FileText size={16} />
                            {file ? 'Change File' : 'Select File'}
                        </label>
                        {file && <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{file.name}</span>}
                    </div>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                    <button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: isUploading ? '#93c5fd' : '#2563eb',
                            color: 'white',
                            borderRadius: '0.375rem',
                            border: 'none',
                            fontWeight: 500,
                            cursor: isUploading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            'Upload Report'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
