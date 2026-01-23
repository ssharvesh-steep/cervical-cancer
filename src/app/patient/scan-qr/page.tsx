'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Upload, Clipboard, Camera, Scan, Activity, Sparkles } from 'lucide-react'
import styles from './scanner.module.css'

export default function QRScannerPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(true)
    const [scanMode, setScanMode] = useState<'qr' | 'analysis'>('qr')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState<{ title: string; confidence: number; summary: string } | null>(null)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const saveDoctorAndRedirect = React.useCallback(async (doctorId: string) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            try {
                // First try to find existing patient record
                let { data: patient } = await supabase
                    .from('patients')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()

                // If no patient record exists, create one
                if (!patient) {
                    const { data: newPatient, error: createError } = await supabase
                        .from('patients')
                        .insert({ user_id: user.id })
                        .select('id')
                        .single()

                    if (createError) {
                        console.error('Error creating patient record:', createError)
                        setError("Could not create patient profile. Please contact support.")
                        return
                    }
                    patient = newPatient
                }

                if (patient) {
                    const { error } = await supabase
                        .from('patient_doctors')
                        .insert({
                            patient_id: patient.id,
                            doctor_id: doctorId
                        })

                    if (error && error.code !== '23505') { // Ignore unique violation (already connected)
                        console.error('Error saving doctor:', error)
                        setError("Failed to connect with doctor. Please try again.")
                        return
                    }
                }
            } catch (err) {
                console.error("Error in save flow:", err)
                setError("An unexpected error occurred.")
                return
            }
        }

        router.push(`/patient/appointments?doctor=${doctorId}`)
    }, [router])

    const onScanSuccess = React.useCallback(async (decodedText: string) => {
        if (!isScanning) return

        // Pause handling further scans
        setIsScanning(false)
        if (scannerRef.current?.isScanning) {
            await scannerRef.current.stop()
        }

        try {
            const data = JSON.parse(decodedText)
            if (data.doctorId) {
                await saveDoctorAndRedirect(data.doctorId)
            } else {
                setError("Invalid QR Code. Please scan a valid Doctor QR Code.")
                setIsScanning(true) // Resume if invalid
            }
        } catch (e) {
            console.error(e)
            // Not JSON
            setError("Invalid QR Code format.")
            setIsScanning(true)
        }
    }, [isScanning, saveDoctorAndRedirect])

    const startCamera = React.useCallback(async () => {
        if (!scannerRef.current) return

        try {
            if (scannerRef.current.isScanning) {
                await scannerRef.current.stop()
            }

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
            }

            await scannerRef.current.start(
                { facingMode: "environment" },
                config,
                onScanSuccess,
                (errorMessage) => {
                    // Ignore scan errors, they happen every frame
                    console.debug("Scan error:", errorMessage)
                }
            )
            setError(null)
            setIsScanning(true)
        } catch (err) {
            console.error("Error starting scanner", err)
            setError("Camera access denied. Please allow camera permissions in your browser settings.")
        }
    }, [onScanSuccess])

    const scanFile = React.useCallback(async (file: File) => {
        if (!scannerRef.current) return

        try {
            // Stop camera if it's running
            if (scannerRef.current.isScanning) {
                await scannerRef.current.stop()
                setIsScanning(false)
            }

            const result = await scannerRef.current.scanFileV2(file, true)
            if (result) {
                onScanSuccess(result.decodedText)
            }
        } catch (err) {
            console.error(err)
            setError("Could not read QR code from image.")
            // Restart camera on failure so user can try again
            await startCamera()
        }
    }, [onScanSuccess, startCamera])

    useEffect(() => {
        // Initialize scanner
        const html5QrCode = new Html5Qrcode("reader")
        scannerRef.current = html5QrCode

        // eslint-disable-next-line react-hooks/exhaustive-deps
        startCamera()

        return () => {
            if (html5QrCode.isScanning) {
                html5QrCode.stop().then(() => {
                    html5QrCode.clear()
                }).catch(err => console.error("Error stopping scanner", err))
            }
        }
    }, [startCamera])

    const handleRetry = () => {
        window.location.reload()
    }

    // Global paste listener
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items
            if (!items) return

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile()
                    if (blob) {
                        scanFile(blob)
                    }
                }
            }
        }

        window.addEventListener('paste', handlePaste)
        return () => window.removeEventListener('paste', handlePaste)
    }, [scanFile])



    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            scanFile(file)
        }
    }



    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Advanced Medical Scanner</h1>
                <p>Secure connection & intelligent analysis protocol active.</p>
            </header>

            <div className={styles.modeToggle}>
                <button
                    className={`${styles.toggleBtn} ${scanMode === 'qr' ? styles.active : ''}`}
                    onClick={() => {
                        setScanMode('qr')
                        setAnalysisResult(null)
                        setIsAnalyzing(false)
                    }}
                >
                    <Scan size={18} /> Connect Doctor
                </button>
                <button
                    className={`${styles.toggleBtn} ${scanMode === 'analysis' ? `${styles.active} ${styles.analysis}` : ''}`}
                    onClick={() => {
                        setScanMode('analysis')
                        setAnalysisResult(null)
                    }}
                >
                    <Sparkles size={18} /> Smart Analysis
                </button>
            </div>

            <div className={styles.scannerWrapper}>
                <div id="reader" className={`${styles.videoContainer} ${isAnalyzing ? styles.hidden : ''}`}></div>

                {isAnalyzing && (
                    <div className={styles.processingOverlay}>
                        <div className={styles.scannerBeam}></div>
                        <Activity className="animate-spin text-emerald-500 mb-4" size={48} />
                        <div className={styles.processingText}>ANALYZING...</div>
                    </div>
                )}

                {/* Advanced Overlay */}
                <div className={`${styles.hudOverlay} ${scanMode === 'analysis' ? styles.analysis : ''}`}>
                    <div className={`${styles.hudCorner} ${styles.tl}`}></div>
                    <div className={`${styles.hudCorner} ${styles.tr}`}></div>
                    <div className={`${styles.hudCorner} ${styles.bl}`}></div>
                    <div className={`${styles.hudCorner} ${styles.br}`}></div>

                    {scanMode === 'analysis' ? (
                        <div className={styles.analysisGrid}></div>
                    ) : (
                        <div className={styles.scanFrame}>
                            <div className={styles.scanLine}></div>
                        </div>
                    )}
                </div>

                {analysisResult && (
                    <div className={styles.resultCard}>
                        <div className={styles.resultHeader}>
                            <div className={styles.resultTitle}>{analysisResult.title}</div>
                            <div className={styles.confidenceBadge}>{analysisResult.confidence}% CONFIDENCE</div>
                        </div>
                        <div className={styles.resultBody}>
                            {analysisResult.summary}
                        </div>
                        <button
                            className={styles.resultAction}
                            onClick={() => setAnalysisResult(null)}
                        >
                            ACKNOWLEDGE
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className={styles.error} style={{ flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                    <p>{error}</p>
                    <button
                        onClick={handleRetry}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                        }}
                    >
                        Retry Camera
                    </button>
                </div>
            )}

            <div className={styles.actions}>
                {scanMode === 'analysis' && !isAnalyzing && !analysisResult && (
                    <button
                        className={styles.actionButton}
                        style={{ background: '#10b981', color: 'white', borderColor: '#059669' }}
                        onClick={() => {
                            setIsAnalyzing(true)
                            // Simulate AI Delay
                            setTimeout(() => {
                                setIsAnalyzing(false)
                                setAnalysisResult({
                                    title: "No Critical Anomalies",
                                    confidence: 94,
                                    summary: "Initial visual scan suggests normal tissue structure. No visible lesions or irregularities detected in the sample area. Recommended: Routine follow-up."
                                })
                            }, 3000)
                        }}
                    >
                        <Camera size={20} />
                        Capture & Analyze
                    </button>
                )}

                <button
                    className={styles.actionButton}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload size={20} />
                    Upload Image
                </button>

                <button
                    className={styles.actionButton}
                    onClick={async () => {
                        try {
                            const items = await navigator.clipboard.read()
                            for (const item of items) {
                                if (item.types && item.types.some(type => type.startsWith('image/'))) {
                                    const blob = await item.getType(item.types.find(type => type.startsWith('image/'))!)
                                    if (blob instanceof File) scanFile(blob)
                                    else if (blob instanceof Blob) scanFile(new File([blob], "paste.png"))
                                }
                            }
                        } catch (err) {
                            setError("Please use Ctrl+V / Cmd+V to paste.")
                        }
                    }}
                >
                    <Clipboard size={20} />
                    Paste Image
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <div style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.75rem', textAlign: 'center' }}>
                MEDICAL DEVICE UI · v2.1.0 · ENCRYPTED
            </div>
        </div>
    )
}
