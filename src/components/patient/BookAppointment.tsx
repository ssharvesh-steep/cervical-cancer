'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './BookAppointment.module.css'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

interface Doctor {
    id: string
    full_name: string
    email: string
}

interface BookAppointmentProps {
    patientId: string
    preselectedDoctorId?: string
}

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function BookAppointment({ patientId, preselectedDoctorId }: BookAppointmentProps) {
    const router = useRouter()
    const supabase = createClient()
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Calendar state
    const [date, setDate] = useState<Value>(new Date())

    const [formData, setFormData] = useState({
        doctorId: '',
        appointmentType: 'consultation' as const,
        notes: '',
    })

    useEffect(() => {
        loadDoctors()
    }, [])

    const loadDoctors = async () => {
        let data: Doctor[] = []
        let error = null

        if (preselectedDoctorId) {
            // Case 1: Preselected Doctor (from QR scan)
            const result = await supabase
                .from('users')
                .select('id, full_name, email')
                .eq('id', preselectedDoctorId)
                .single()

            if (result.data) data = [result.data]
            error = result.error
        } else {
            // Case 2: Load Saved Doctors
            const result = await supabase
                .from('patient_doctors')
                .select(`
                    doctor:users (
                        id,
                        full_name,
                        email
                    )
                `)
                .eq('patient_id', patientId)

            if (result.data) {
                // Flatten the structure: result.data is { doctor: { ... } }[]
                data = result.data.map((item: any) => item.doctor).filter((doc: any) => doc !== null)
            }
            error = result.error
        }

        if (data) {
            setDoctors(data)
            if (preselectedDoctorId && data.length > 0) {
                setFormData(prev => ({ ...prev, doctorId: data[0].id }))
            }
        }
        if (error) {
            console.error('Error loading doctors:', error)
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        setSubmitting(true)

        if (!date) {
            setError('Please select a date')
            setSubmitting(false)
            return
        }

        try {
            // Combine date with default time (00:00) as time is now set by doctor
            // Ensure we use the date from the Calendar
            const selectedDate = date instanceof Date ? date : new Date()
            // Set default time to start of day for consistency or let backend handle it. 
            // We use YYYY-MM-DD from locale to ensure correct date string
            const offsetDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000))
            const dateString = offsetDate.toISOString().split('T')[0]

            const appointmentDateTime = new Date(`${dateString}T00:00:00`)

            const { error: submitError } = await supabase
                .from('appointments')
                .insert({
                    patient_id: patientId,
                    doctor_id: formData.doctorId,
                    appointment_date: appointmentDateTime.toISOString(),
                    appointment_type: formData.appointmentType,
                    status: 'pending', // Pending status until doctor confirms time
                    notes: formData.notes || null,
                })

            if (submitError) throw submitError

            setSuccess(true)

            // Reset form
            setFormData({
                doctorId: '',
                appointmentType: 'consultation',
                notes: '',
            })
            setDate(new Date())

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push('/patient/appointments')
                router.refresh()
            }, 2000)
        } catch (err: any) {
            console.error('Booking error full object:', err)
            console.error('Booking error message:', err.message)
            console.error('Booking error details:', err.details)
            console.error('Booking error hint:', err.hint)
            console.error('Submission Data:', {
                patientId,
                doctorId: formData.doctorId,
                appointmentDate: date,
                time: '00:00:00'
            })
            setError(`Failed to book: ${err.message || 'Unknown error'}`)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <div className={styles.loading}>Loading doctors...</div>
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
                <label htmlFor="doctor" className="form-label">
                    Select Doctor <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                {preselectedDoctorId && doctors.length > 0 ? (
                    <div className="form-control" style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155' }}>
                        Dr. {doctors[0].full_name}
                        <input type="hidden" value={doctors[0].id} />
                    </div>
                ) : doctors.length > 0 ? (
                    <div>
                        <select
                            id="doctor"
                            value={formData.doctorId}
                            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                            className="form-select"
                            required
                            disabled={submitting}
                        >
                            <option value="">Choose a saved doctor...</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    Dr. {doctor.full_name}
                                </option>
                            ))}
                        </select>
                        <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                            <a href="/patient/scan-qr" style={{ fontSize: '0.85rem', color: '#3b82f6', textDecoration: 'none' }}>
                                + Scan new doctor
                            </a>
                        </div>
                    </div>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                        <p style={{ marginBottom: '1rem', color: '#64748b' }}>To book with a new doctor, please scan their QR code.</p>
                        <a href="/patient/scan-qr" className="btn btn-primary">Scan QR Code</a>
                    </div>
                )}
            </div>

            {(doctors.length > 0) && (
                <>

                    <div className="form-group">
                        <label htmlFor="appointmentType" className="form-label">
                            Appointment Type <span style={{ color: 'var(--color-error)' }}>*</span>
                        </label>
                        <select
                            id="appointmentType"
                            value={formData.appointmentType}
                            onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value as any })}
                            className="form-select"
                            required
                            disabled={submitting}
                        >
                            <option value="consultation">Consultation</option>
                            <option value="follow_up">Follow-up</option>
                            <option value="screening">Screening</option>
                            <option value="treatment">Treatment</option>
                            <option value="teleconsultation">Teleconsultation</option>
                        </select>
                    </div>

                    <div className={styles.dateTimeRow}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">
                                Preferred Date <span style={{ color: 'var(--color-error)' }}>*</span>
                            </label>
                            <div className={styles.calendarWrapper}>
                                <Calendar
                                    onChange={setDate}
                                    value={date}
                                    minDate={new Date()}
                                    className="custom-calendar"
                                />
                            </div>
                            <p className={styles.helpText} style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                                * The doctor will confirm the specific time.
                            </p>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes" className="form-label">
                            Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="form-textarea"
                            rows={4}
                            placeholder="Any specific concerns or questions..."
                            disabled={submitting}
                        />
                    </div>

                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            ✅ Request sent! Waiting for doctor confirmation. Redirecting...
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting || doctors.length === 0}
                        style={{ width: '100%' }}
                    >
                        {submitting ? 'Sending Request...' : 'Request Appointment'}
                    </button>

                    {doctors.length === 0 && (
                        <p className={styles.noDoctors}>No doctors available at the moment.</p>
                    )}
                </>
            )}

            {doctors.length === 0 && !loading && (
                <p className={styles.noDoctors} style={{ display: 'none' }}></p>
            )}
        </form>
    )
}
