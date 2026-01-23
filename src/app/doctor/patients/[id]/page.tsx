import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import styles from './page.module.css'
import UploadReport from '../../components/UploadReport'
import { FileText, Download, Activity } from 'lucide-react'
import RealtimeRefresher from '@/components/RealtimeRefresher'

interface SymptomLog {
    id: string
    log_date: string
    pain_level: number
    fatigue_level: number
    bleeding: boolean
    notes: string
    symptoms: Record<string, boolean>
}

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
        redirect('/login')
    }

    const { id: patientUserId } = await params

    // Get user data (Name, Email, Phone)
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', patientUserId)
        .single()

    // Get patient data (Medical info)
    const { data: patientData } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', patientUserId)
        .single()

    // Get medical history
    const { data: medicalHistory } = await supabase
        .from('patient_medical_history')
        .select('*')
        .eq('patient_id', patientData?.id)
        .order('diagnosed_date', { ascending: false })

    // Get screening records
    const { data: screeningRecords } = await supabase
        .from('screening_records')
        .select('*')
        .eq('patient_id', patientData?.id)
        .order('screening_date', { ascending: false })

    // Get diagnoses
    const { data: diagnoses } = await supabase
        .from('diagnoses')
        .select('*')
        .eq('patient_id', patientData?.id)
        .order('diagnosis_date', { ascending: false })

    // Get treatments
    const { data: treatments } = await supabase
        .from('treatments')
        .select('*')
        .eq('patient_id', patientData?.id)
        .order('start_date', { ascending: false })

    // Get medications
    const { data: medications } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', patientData?.id)
        .order('start_date', { ascending: false })

    // Get appointments
    const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientData?.id)
        .order('appointment_date', { ascending: false })

    // Check if doctor is connected to this patient via QR code (patient_doctors table only)
    if (patientData) {
        const { data: isConnected } = await supabase
            .from('patient_doctors')
            .select('id')
            .eq('patient_id', patientData.id)
            .eq('doctor_id', authUser.id)
            .limit(1)

        // If not connected via QR code, redirect to patients list
        if (!isConnected) {
            redirect('/doctor/patients')
        }
    }

    // Get medical reports
    const { data: reports } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('patient_id', patientData?.id)
        .order('created_at', { ascending: false })

    // Get symptom logs
    const { data: symptomLogs } = await supabase
        .from('symptoms_log')
        .select('*')
        .eq('patient_id', patientData?.id)
        .order('log_date', { ascending: false })


    if (userError || !userData) {
        return notFound()
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>{userData.full_name}</h1>
                    <p>Patient Profile</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/doctor/patients" className="btn btn-outline">
                        Back to List
                    </Link>
                    <Link href={`/doctor/patients/${patientUserId}/edit`} className="btn btn-primary">
                        Edit Profile
                    </Link>
                </div>
            </header>

            <div className={styles.grid}>
                {/* Personal Information */}
                <div className={styles.card}>
                    <h2>Personal Information</h2>
                    <div className={styles.profileSection}>
                        <div className={styles.profileField}>
                            <label>Full Name</label>
                            <p>{userData.full_name}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Email</label>
                            <p>{userData.email}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Phone</label>
                            <p>{userData.phone || 'Not provided'}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Member Since</label>
                            <p>{new Date(userData.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Medical Information */}
                <div className={styles.card}>
                    <h2>Medical Information</h2>
                    <div className={styles.profileSection}>
                        <div className={styles.profileField}>
                            <label>Date of Birth</label>
                            <p>
                                {patientData?.date_of_birth
                                    ? new Date(patientData.date_of_birth).toLocaleDateString()
                                    : 'Not recorded'}
                            </p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Age</label>
                            <p>{patientData?.age ? `${patientData.age} years` : '--'}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Blood Group</label>
                            <p>{patientData?.blood_group || '--'}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Marital Status</label>
                            <p>{patientData?.marital_status || '--'}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Gender</label>
                            <p>{patientData?.gender || '--'}</p>
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className={styles.card}>
                    <h2>Emergency Contact</h2>
                    <div className={styles.profileSection}>
                        <div className={styles.profileField}>
                            <label>Name</label>
                            <p>{patientData?.emergency_contact_name || 'Not provided'}</p>
                        </div>
                        <div className={styles.profileField}>
                            <label>Phone</label>
                            <p>{patientData?.emergency_contact_phone || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                {/* Medical History */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.card}>
                        <h2>Medical History</h2>
                        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                            {medicalHistory && medicalHistory.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Condition</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Diagnosed Date</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {medicalHistory.map((history: any) => (
                                                <tr key={history.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{history.condition}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {history.diagnosed_date ? new Date(history.diagnosed_date).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td style={{ padding: '0.75rem', maxWidth: '300px' }}>{history.notes || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                                    No medical history recorded yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Screening Records */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.card}>
                        <h2>Screening Records</h2>
                        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                            {screeningRecords && screeningRecords.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Screening Type</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Result</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {screeningRecords.map((record: any) => (
                                                <tr key={record.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{record.screening_type}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {new Date(record.screening_date).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '0.25rem',
                                                            background: record.result?.toLowerCase().includes('negative') ? '#ecfdf5' : '#fef2f2',
                                                            color: record.result?.toLowerCase().includes('negative') ? '#047857' : '#b91c1c',
                                                            fontWeight: 500
                                                        }}>
                                                            {record.result || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem', maxWidth: '300px' }}>{record.notes || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                                    No screening records available yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Diagnoses */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.card}>
                        <h2>Diagnoses</h2>
                        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                            {diagnoses && diagnoses.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Diagnosis Date</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Type</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Stage</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {diagnoses.map((diagnosis: any) => (
                                                <tr key={diagnosis.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {new Date(diagnosis.diagnosis_date).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{diagnosis.type || '-'}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '0.25rem',
                                                            background: '#fef3c7',
                                                            color: '#92400e',
                                                            fontWeight: 500
                                                        }}>
                                                            {diagnosis.stage || 'Not specified'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem', maxWidth: '300px' }}>{diagnosis.notes || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                                    No diagnoses recorded yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Treatments */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.card}>
                        <h2>Treatments</h2>
                        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                            {treatments && treatments.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Treatment Type</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Start Date</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>End Date</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {treatments.map((treatment: any) => (
                                                <tr key={treatment.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{treatment.treatment_type}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {new Date(treatment.start_date).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {treatment.end_date ? new Date(treatment.end_date).toLocaleDateString() : 'Ongoing'}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        <span style={{
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '0.25rem',
                                                            background: treatment.status === 'active' ? '#dbeafe' : '#f3f4f6',
                                                            color: treatment.status === 'active' ? '#1e40af' : '#6b7280',
                                                            fontWeight: 500,
                                                            textTransform: 'capitalize'
                                                        }}>
                                                            {treatment.status || 'Unknown'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '0.75rem', maxWidth: '300px' }}>{treatment.notes || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                                    No treatments recorded yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Medications */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.card}>
                        <h2>Current Medications</h2>
                        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                            {medications && medications.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Medication</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Dosage</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Frequency</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Start Date</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>End Date</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Prescribing Doctor</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {medications.map((medication: any) => (
                                                <tr key={medication.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                    <td style={{ padding: '0.75rem', fontWeight: 500 }}>{medication.medication_name}</td>
                                                    <td style={{ padding: '0.75rem' }}>{medication.dosage}</td>
                                                    <td style={{ padding: '0.75rem' }}>{medication.frequency}</td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {new Date(medication.start_date).toLocaleDateString()}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>
                                                        {medication.end_date ? new Date(medication.end_date).toLocaleDateString() : 'Ongoing'}
                                                    </td>
                                                    <td style={{ padding: '0.75rem' }}>{medication.prescribing_doctor || '-'}</td>
                                                    <td style={{ padding: '0.75rem', maxWidth: '200px' }}>{medication.notes || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                                    No medications recorded yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Symptom History */}
                <div style={{ gridColumn: '1 / -1' }}>
                    <div className={styles.card}>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity className="text-blue-600" size={24} />
                            Symptom History
                        </h2>

                        <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                            {symptomLogs && symptomLogs.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                        <thead>
                                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Pain (0-10)</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Fatigue (0-10)</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Bleeding</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Other Symptoms</th>
                                                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {symptomLogs.map((log: SymptomLog) => {
                                                const symptoms = log.symptoms || {}
                                                const activeSymptoms = Object.entries(symptoms)
                                                    .filter((entry) => entry[1] === true)
                                                    .map(([key]) => key.replace('_', ' '))

                                                return (
                                                    <tr key={log.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {new Date(log.log_date).toLocaleDateString()}
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            <span style={{
                                                                padding: '0.25rem 0.5rem',
                                                                borderRadius: '0.25rem',
                                                                background: log.pain_level > 5 ? '#fef2f2' : '#ecfdf5',
                                                                color: log.pain_level > 5 ? '#b91c1c' : '#047857',
                                                                fontWeight: 500
                                                            }}>
                                                                {log.pain_level}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>{log.fatigue_level}</td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {log.bleeding ? (
                                                                <span style={{ color: '#dc2626', fontWeight: 500 }}>Yes</span>
                                                            ) : (
                                                                <span style={{ color: '#059669' }}>No</span>
                                                            )}
                                                        </td>
                                                        <td style={{ padding: '0.75rem' }}>
                                                            {activeSymptoms.length > 0 ? (
                                                                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                                                    {activeSymptoms.map(sym => (
                                                                        <span key={sym} style={{
                                                                            fontSize: '0.75rem',
                                                                            background: '#f3f4f6',
                                                                            padding: '2px 6px',
                                                                            borderRadius: '4px',
                                                                            textTransform: 'capitalize'
                                                                        }}>
                                                                            {sym}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            ) : '-'}
                                                        </td>
                                                        <td style={{ padding: '0.75rem', maxWidth: '300px' }}>{log.notes || '-'}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                                    No symptoms logged by the patient yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Appointments */}
            <div style={{ gridColumn: '1 / -1' }}>
                <div className={styles.card}>
                    <h2>Appointments</h2>
                    <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                        {appointments && appointments.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Date</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Type</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Status</th>
                                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: 600 }}>Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {appointments.map((appointment: any) => (
                                            <tr key={appointment.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '0.75rem' }}>
                                                    {new Date(appointment.appointment_date).toLocaleDateString()} {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td style={{ padding: '0.75rem', fontWeight: 500, textTransform: 'capitalize' }}>
                                                    {appointment.appointment_type.replace('_', ' ')}
                                                </td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <span style={{
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '0.25rem',
                                                        background: appointment.status === 'confirmed' || appointment.status === 'completed' ? '#ecfdf5' :
                                                            appointment.status === 'cancelled' || appointment.status === 'no_show' ? '#fef2f2' : '#fff7ed',
                                                        color: appointment.status === 'confirmed' || appointment.status === 'completed' ? '#047857' :
                                                            appointment.status === 'cancelled' || appointment.status === 'no_show' ? '#b91c1c' : '#c2410c',
                                                        fontWeight: 500,
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '0.75rem', maxWidth: '300px' }}>{appointment.notes || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                                No appointments recorded yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Medical Reports Section */}
            <div style={{ gridColumn: '1 / -1' }}>
                <div className={styles.card}>
                    <h2>Medical Reports</h2>

                    {patientData && (
                        <UploadReport
                            patientId={patientData.id}
                            doctorId={authUser.id}
                        />
                    )}

                    <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                        {reports && reports.length > 0 ? (
                            reports.map((report: { id: string; report_type: string; created_at: string; description?: string; file_path: string }) => (
                                <div
                                    key={report.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1rem',
                                        background: '#f9fafb',
                                        borderRadius: '0.5rem',
                                        border: '1px solid #e5e7eb'
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
                                            <div style={{ fontWeight: 600, color: '#111827' }}>{report.report_type}</div>
                                            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
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
                                        View
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
                                No medical reports uploaded yet.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'none' }}>
                {/* Listen for changes to reports and appointments for this patient */}
                {patientData && (
                    <>
                        <RealtimeRefresher
                            table="medical_reports"
                            filter={`patient_id=eq.${patientData.id}`}
                        />
                        <RealtimeRefresher
                            table="appointments"
                            filter={`patient_id=eq.${patientData.id}`}
                        />
                        <RealtimeRefresher
                            table="symptoms_log"
                            filter={`patient_id=eq.${patientData.id}`}
                        />
                    </>
                )}
            </div>
        </div>
    )
}
