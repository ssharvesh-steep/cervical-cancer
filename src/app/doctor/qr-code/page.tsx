'use client'

import React, { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Download } from 'lucide-react'

export default function DoctorQRCodePage() {
    const [userId, setUserId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUserId(user.id)
            }
            setLoading(false)
        }
        fetchUser()
    }, [])

    const downloadQR = () => {
        const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement
        if (!canvas) return

        const pngUrl = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.href = pngUrl
        downloadLink.download = "doctor-qr-code.png"
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
                <Loader2 className="animate-spin" size={32} color="#3b82f6" />
            </div>
        )
    }

    if (!userId) {
        return <div>Error loading profile.</div>
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#0f172a' }}>My QR Code</h1>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Ask patients to scan this code to connect with you.</p>

            <div style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <QRCodeCanvas
                        id="qr-code-canvas"
                        value={JSON.stringify({ doctorId: userId })}
                        size={256}
                        level="M"
                        includeMargin={true}
                    />
                </div>

                <button
                    onClick={downloadQR}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 500
                    }}
                >
                    <Download size={20} />
                    Download QR Code
                </button>

                <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>How it works</h3>
                    <p style={{ color: '#64748b', lineHeight: '1.5' }}>
                        When a patient scans this code from their app, they will be instantly connected to your messaging inbox.
                    </p>
                </div>
            </div>
        </div>
    )
}
