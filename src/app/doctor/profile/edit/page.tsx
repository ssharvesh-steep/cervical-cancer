'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import styles from './page.module.css'

export default function EditDoctorProfilePage() {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        phone: ''
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

        if (userData) {
            setFormData({
                full_name: userData.full_name || '',
                phone: userData.phone || ''
            })
        }
        setLoading(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone
                })
                .eq('id', user.id)

            if (error) throw error

            router.push('/doctor/profile')
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
                <p>Update your professional information</p>
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
                    </div>
                </div>

                <div className={styles.actions}>
                    <Link href="/doctor/profile" className={`${styles.button} ${styles.cancelButton}`}>
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
