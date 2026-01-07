'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Upload, Clipboard, Camera } from 'lucide-react'
import styles from './scanner.module.css'

export default function QRScannerPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [isScanning, setIsScanning] = useState(true)
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Initialize scanner
        const html5QrCode = new Html5Qrcode("reader")
        scannerRef.current = html5QrCode

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE]
        }

        const startScanning = async () => {
            try {
                await html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    onScanSuccess,
                    (errorMessage) => {
                        // Ignore scan errors, they happen every frame
                    }
                )
            } catch (err) {
                console.error("Error starting scanner", err)
                setError("Could not start camera. Please allow permissions.")
            }
        }

        startScanning()

        return () => {
            if (html5QrCode.isScanning) {
                html5QrCode.stop().then(() => {
                    html5QrCode.clear()
                }).catch(err => console.error("Error stopping scanner", err))
            }
        }
    }, [])

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
    }, [])

    const onScanSuccess = async (decodedText: string) => {
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
            // Not JSON
            setError("Invalid QR Code format.")
            setIsScanning(true)
        }
    }

    const saveDoctorAndRedirect = async (doctorId: string) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            try {
                const { data: patient } = await supabase
                    .from('patients')
                    .select('id')
                    .eq('user_id', user.id)
                    .single()

                if (patient) {
                    const { error } = await supabase
                        .from('patient_doctors')
                        .insert({
                            patient_id: patient.id,
                            doctor_id: doctorId
                        })

                    if (error && error.code !== '23505') {
                        console.error('Error saving doctor:', error)
                    }
                }
            } catch (err) {
                console.error("Error in save flow:", err)
            }
        }

        router.push(`/patient/appointments?doctor=${doctorId}`)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            scanFile(file)
        }
    }

    const scanFile = async (file: File) => {
        if (!scannerRef.current) return

        try {
            const result = await scannerRef.current.scanFileV2(file, true)
            if (result) {
                onScanSuccess(result.decodedText)
            }
        } catch (err) {
            setError("Could not read QR code from image.")
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Scan QR Code</h1>
                <p>Scan, Upload, or Paste a QR code to connect.</p>
            </header>

            <div className={styles.scannerWrapper}>
                <div id="reader" className={styles.videoContainer}></div>

                {/* Advanced Overlay */}
                <div className={styles.overlay}>
                    <div className={styles.scanFrame}>
                        <div className={styles.scanLine}></div>
                    </div>
                </div>
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            <div className={styles.actions}>
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

            <div style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                Advanced Scanner Active
            </div>
        </div>
    )
}
