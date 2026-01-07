'use client'

import React, { useState } from 'react'
import Calendar from 'react-calendar'
import styles from './page.module.css'
import 'react-calendar/dist/Calendar.css'
import { MoreVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Appointment = {
    id: string
    appointment_date: string
    status: string
    appointment_type: string
    patient: {
        user: {
            full_name: string
            email: string | null
        } | null
    }
}

export default function AppointmentsClient({ initialAppointments }: { initialAppointments: Appointment[] }) {
    const [date, setDate] = useState<Date>(new Date())
    const [filter, setFilter] = useState<string>('all')
    const [editingApt, setEditingApt] = useState<string | null>(null)
    const [selectedTime, setSelectedTime] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const supabase = createClient()

    // Filter appointments based on selected date and status filter
    const filteredAppointments = initialAppointments.filter(apt => {
        const aptDate = new Date(apt.appointment_date)
        const isSameDay = aptDate.getDate() === date.getDate() &&
            aptDate.getMonth() === date.getMonth() &&
            aptDate.getFullYear() === date.getFullYear()

        if (!isSameDay) return false

        if (filter === 'all') return true
        return apt.status === filter
    })

    const handleDateChange = (value: any) => {
        setDate(value as Date)
    }

    const handleSetTime = async (apt: Appointment) => {
        if (!selectedTime) return
        setSubmitting(true)

        // Construct new date object
        const currentAptDate = new Date(apt.appointment_date)
        const [hours, minutes] = selectedTime.split(':')
        currentAptDate.setHours(parseInt(hours), parseInt(minutes))

        const { error } = await supabase
            .from('appointments')
            .update({
                appointment_date: currentAptDate.toISOString(),
                status: 'scheduled'
            })
            .eq('id', apt.id)

        if (!error) {
            setEditingApt(null)
            // Ideally we should refresh the page or update the local state. 
            // For now, simple reload or we could pass a refresh handler prop.
            window.location.reload()
        } else {
            alert('Failed to update time')
        }
        setSubmitting(false)
    }

    return (
        <div className={styles.grid}>
            {/* Left Column: Calendar */}
            <div className={styles.calendarCard}>
                <h2 className={styles.calendarTitle}>Select Date</h2>
                <div className={styles.calendarWrapper}>
                    <Calendar
                        onChange={handleDateChange}
                        value={date}
                        className="custom-calendar"
                    />
                </div>
            </div>

            {/* Right Column: Appointments List */}
            <div className={styles.listCard}>
                <div className={styles.listHeader}>
                    <h2 className={styles.dateTitle}>
                        {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h2>
                    <div className={styles.filters}>
                        {['all', 'pending', 'scheduled', 'completed', 'cancelled'].map(f => (
                            <button
                                key={f}
                                className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                                onClick={() => setFilter(f)}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.appointmentsList}>
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map(apt => (
                            <div key={apt.id} className={styles.appointmentItem}>
                                <div className={styles.timeInfo}>
                                    {apt.status === 'pending' ? (
                                        <span className={styles.pendingTime}>Time Pending</span>
                                    ) : (
                                        <>
                                            {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            <span className={styles.duration}>30 min</span>
                                        </>
                                    )}
                                </div>

                                <div className={styles.patientInfo}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${apt.patient.user?.full_name || 'User'}&background=random`}
                                        alt=""
                                        className={styles.avatar}
                                    />
                                    <div>
                                        <span className={styles.name}>{apt.patient.user?.full_name || 'Unknown Patient'}</span>
                                        <span className={styles.type}>{apt.appointment_type.replace('_', ' ')}</span>
                                    </div>
                                </div>

                                <div className={styles.statusSection}>
                                    {apt.status === 'pending' && editingApt !== apt.id && (
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => setEditingApt(apt.id)}
                                        >
                                            Set Time
                                        </button>
                                    )}

                                    {editingApt === apt.id ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input
                                                type="time"
                                                className="form-input"
                                                style={{ padding: '0.25rem' }}
                                                value={selectedTime}
                                                onChange={(e) => setSelectedTime(e.target.value)}
                                            />
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleSetTime(apt)}
                                                disabled={submitting || !selectedTime}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                className="btn btn-sm btn-ghost"
                                                onClick={() => setEditingApt(null)}
                                            >
                                                X
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`${styles.statusBadge} ${styles[`status_${apt.status}`]}`}>
                                            {apt.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <h3>No appointments found</h3>
                            <p>There are no appointments scheduled for this date.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
