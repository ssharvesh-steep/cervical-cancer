'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Edit2 } from 'lucide-react'

export default function TodayAppointments({ appointments }: { appointments: any[] }) {
    const supabase = createClient()
    const router = useRouter()
    const [selectedApt, setSelectedApt] = React.useState<any>(null)
    const [scheduleTime, setScheduleTime] = React.useState('')

    const handleEdit = (apt: any) => {
        setSelectedApt(apt)
        // Default to current date/time
        const date = new Date(apt.appointment_date)
        const isoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
        setScheduleTime(isoString)
    }

    const confirmReschedule = async () => {
        if (!selectedApt || !scheduleTime) return

        try {
            const { error } = await supabase
                .from('appointments')
                .update({
                    appointment_date: new Date(scheduleTime).toISOString()
                })
                .eq('id', selectedApt.id)

            if (error) throw error

            setSelectedApt(null)
            router.refresh()
        } catch (error) {
            console.error('Error rescheduling appointment:', error)
            alert('Failed to reschedule appointment')
        }
    }

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            height: '100%',
        }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.5rem' }}>
                Upcoming Appointments
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {appointments.length === 0 && (
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center' }}>
                        No upcoming appointments
                    </p>
                )}
                {appointments.map((apt) => (
                    <div key={apt.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        borderRadius: '12px',
                        backgroundColor: apt.status === 'ongoing' ? '#f8fafc' : 'transparent',
                        border: '1px solid #f1f5f9'
                    }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://ui-avatars.com/api/?name=${apt.patient?.user?.full_name || 'User'}&background=random`}
                                alt={apt.patient?.user?.full_name}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }}
                            />
                            <div>
                                <span style={{
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    color: '#0f172a',
                                    display: 'block'
                                }}>
                                    {apt.patient?.user?.full_name}
                                </span>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {apt.appointment_type.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                color: apt.status === 'ongoing' ? '#16a34a' : '#64748b',
                                display: 'block'
                            }}>
                                {apt.status === 'ongoing' ? 'Ongoing' : new Date(apt.appointment_date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button
                                onClick={() => handleEdit(apt)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    color: '#94a3b8',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                                title="Reschedule"
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reschedule Modal */}
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
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Reschedule Appointment</h3>
                        <p style={{ marginBottom: '1.5rem', color: '#64748b' }}>
                            Change the time for {selectedApt.patient?.user?.full_name}.
                        </p>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.5rem' }}>
                                New Time
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
                                onClick={confirmReschedule}
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
                                Update Time
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
