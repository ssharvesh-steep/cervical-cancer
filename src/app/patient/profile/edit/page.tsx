'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import styles from './page.module.css'

export default function EditProfilePage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        date_of_birth: '',
        blood_group: '',
        marital_status: '',
        emergency_contact_name: '',
        emergency_contact_phone: ''
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/login')
            return
        }

        // Fetch user data
        const { data: userData } = await supabase
            .from('users')
            .select('full_name, phone')
            .eq('id', user.id)
            .single()

        // Fetch patient data
        const { data: patientData } = await supabase
            .from('patients')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (userData && patientData) {
            setFormData({
                full_name: userData.full_name || '',
                phone: userData.phone || '',
                date_of_birth: patientData.date_of_birth || '',
                blood_group: patientData.blood_group || '',
                marital_status: patientData.marital_status || '',
                emergency_contact_name: patientData.emergency_contact_name || '',
                emergency_contact_phone: patientData.emergency_contact_phone || ''
            })
        }
        setLoading(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        try {
            // Update User Data
            const { error: userError } = await supabase
                .from('users')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone
                })
                .eq('id', user.id)

            if (userError) throw userError

            // Update Patient Data
            const { error: patientError } = await supabase
                .from('patients')
                .update({
                    date_of_birth: formData.date_of_birth || null,
                    blood_group: formData.blood_group,
                    marital_status: formData.marital_status,
                    emergency_contact_name: formData.emergency_contact_name,
                    emergency_contact_phone: formData.emergency_contact_phone
                })
                .eq('user_id', user.id)

            if (patientError) throw patientError

            router.push('/patient/profile')
            router.refresh()
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Failed to update profile. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className={styles.container}>Loading...</div>
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Edit Profile</h1>
                <p>Update your personal and medical information</p>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.section}>
                    <h2>Personal Details</h2>
                    <div className={styles.fields}>
                        <div className={styles.field}>
                            <label htmlFor="full_name">Full Name</label>
                            <input
                                type="text"
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="date_of_birth">Date of Birth</label>
                            <input
                                type="date"
                                id="date_of_birth"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="marital_status">Marital Status</label>
                            <select
                                id="marital_status"
                                name="marital_status"
                                value={formData.marital_status}
                                onChange={handleChange}
                                className={styles.input}
                            >
                                <option value="">Select Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Medical Info</h2>
                    <div className={styles.fields}>
                        <div className={styles.field}>
                            <label htmlFor="blood_group">Blood Group</label>
                            <select
                                id="blood_group"
                                name="blood_group"
                                value={formData.blood_group}
                                onChange={handleChange}
                                className={styles.input}
                            >
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Emergency Contact</h2>
                    <div className={styles.fields}>
                        <div className={styles.field}>
                            <label htmlFor="emergency_contact_name">Contact Name</label>
                            <input
                                type="text"
                                id="emergency_contact_name"
                                name="emergency_contact_name"
                                value={formData.emergency_contact_name}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="emergency_contact_phone">Contact Phone</label>
                            <input
                                type="tel"
                                id="emergency_contact_phone"
                                name="emergency_contact_phone"
                                value={formData.emergency_contact_phone}
                                onChange={handleChange}
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Link href="/patient/profile" className={`${styles.button} ${styles.cancelButton}`}>
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className={`${styles.button} ${styles.saveButton}`}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}
