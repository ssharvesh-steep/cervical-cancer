'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './AppointmentRequests.module.css'

interface Appointment {
    id: string
    appointment_date: string
    appointment_type: string
    patient: {
        user: {
            full_name: string
        }
    }
}

interface Props {
    appointments: Appointment[]
}

export default function AppointmentRequests({ appointments: initialAppointments }: Props) {
    const [appointments, setAppointments] = useState(initialAppointments)
    const [processing, setProcessing] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleAction = async (id: string, status: 'confirmed' | 'cancelled') => {
        setProcessing(id)

        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status })
                .eq('id', id)

            if (error) throw error

            // Remove from local state
            setAppointments(prev => prev.filter(apt => apt.id !== id))
            router.refresh()
        } catch (error) {
            console.error('Error updating appointment:', error)
            alert('Failed to update appointment')
        } finally {
            setProcessing(null)
        }
    }

    if (appointments.length === 0) {
        return (
            <p className={styles.emptyState}>No pending appointment requests</p>
        )
    }

    return (
        <div className={styles.list}>
            {appointments.map((apt) => (
                <div key={apt.id} className={styles.item}>
                    <div className={styles.info}>
                        <div className={styles.patientName}>
                            {apt.patient?.user?.full_name}
                        </div>
                        <div className={styles.details}>
                            <span className={styles.type}>
                                {apt.appointment_type.replace('_', ' ')}
                            </span>
                            <span className={styles.date}>
                                {new Date(apt.appointment_date).toLocaleDateString()} at {' '}
                                {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button
                            onClick={() => handleAction(apt.id, 'confirmed')}
                            disabled={processing === apt.id}
                            className={`${styles.btn} ${styles.approve}`}
                        >
                            {processing === apt.id ? '...' : 'Approve'}
                        </button>
                        <button
                            onClick={() => handleAction(apt.id, 'cancelled')}
                            disabled={processing === apt.id}
                            className={`${styles.btn} ${styles.reject}`}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
