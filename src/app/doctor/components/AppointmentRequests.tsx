'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Check, X } from 'lucide-react'

// Simple CSS for this component to keep it self-contained or we can use inline styles
const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        height: '100%'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
    },
    title: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#0f172a'
    },
    viewAll: {
        fontSize: '0.85rem',
        color: '#3b82f6',
        textDecoration: 'none',
        cursor: 'pointer'
    },
    list: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1.25rem'
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    userInfo: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    avatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#e2e8f0',
        objectFit: 'cover' as const
    },
    name: {
        fontSize: '0.95rem',
        fontWeight: 600,
        color: '#0f172a',
        display: 'block'
    },
    details: {
        fontSize: '0.8rem',
        color: '#64748b'
    },
    actions: {
        display: 'flex',
        gap: '0.5rem'
    },
    btn: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    confirmBtn: {
        backgroundColor: '#dcfce7',
        color: '#166534'
    },
    declineBtn: {
        backgroundColor: '#fee2e2',
        color: '#991b1b'
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AppointmentRequests({ appointments }: { appointments: any[] }) {
    const supabase = createClient()
    const router = useRouter()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedApt, setSelectedApt] = React.useState<any>(null)
    const [scheduleTime, setScheduleTime] = React.useState('')

    const handleAction = async (id: string, status: 'scheduled' | 'cancelled') => {
        if (status === 'scheduled') {
            // Open modal for scheduling
            const apt = appointments.find(a => a.id === id)
            if (apt) {
                setSelectedApt(apt)
                // Default to the requested date/time (formatted for datetime-local)
                const date = new Date(apt.appointment_date)
                const isoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
                setScheduleTime(isoString)
            }
            return
        }

        // Handle decline immediately
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id)

            if (error) throw error
            router.refresh()
        } catch (error) {
            console.error('Error updating appointment:', error)
            alert('Failed to update appointment status')
        }
    }

    const confirmSchedule = async () => {
        if (!selectedApt || !scheduleTime) return

        try {
            const { error } = await supabase
                .from('appointments')
                .update({
                    status: 'scheduled',
                    appointment_date: new Date(scheduleTime).toISOString()
                })
                .eq('id', selectedApt.id)

            if (error) throw error

            setSelectedApt(null)
            router.refresh()
        } catch (error) {
            console.error('Error scheduling appointment:', error)
            alert('Failed to schedule appointment')
        }
    }

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <h3 style={styles.title}>Appointment Request</h3>
                <span style={styles.viewAll}>View All &gt;</span>
            </div>

            <div style={styles.list}>
                {appointments.length === 0 && (
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                        No pending requests
                    </p>
                )}
                {appointments.map((apt) => (
                    <div key={apt.id} style={styles.item}>
                        <div style={styles.userInfo}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://ui-avatars.com/api/?name=${apt.patient?.user?.full_name || 'User'}&background=random`}
                                alt={apt.patient?.user?.full_name}
                                style={styles.avatar}
                            />
                            <div>
                                <span style={styles.name}>{apt.patient?.user?.full_name}</span>
                                <span style={styles.details}>
                                    {new Date(apt.appointment_date).toLocaleDateString()} • {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                        <div style={styles.actions}>
                            <button
                                style={{ ...styles.btn, ...styles.declineBtn }}
                                onClick={() => handleAction(apt.id, 'cancelled')}
                                title="Decline"
                            >
                                <X size={16} />
                            </button>
                            <button
                                style={{ ...styles.btn, ...styles.confirmBtn }}
                                onClick={() => handleAction(apt.id, 'scheduled')}
                                title="Confirm"
                            >
                                <Check size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Schedule Modal */}
            {selectedApt && (
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
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '400px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Confirm Appointment</h3>
                        <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
                            Set the final time for {selectedApt.patient?.user?.full_name}.
                        </p>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                                Schedule Time
                            </label>
                            <input
                                type="datetime-local"
                                value={scheduleTime}
                                onChange={(e) => setScheduleTime(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedApt(null)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmSchedule}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#0f172a',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                Confirm Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
