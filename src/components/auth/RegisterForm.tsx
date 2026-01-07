'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/supabase-auth'
import styles from './RegisterForm.module.css'

type UserRole = 'doctor' | 'patient'

export default function RegisterForm() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'patient' as UserRole,
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const result = await signUp({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                role: formData.role,
                phone: formData.phone || undefined,
            })

            setSuccess(true)

            // Check if email confirmation is required
            if (result.user && !result.user.confirmed_at) {
                setError('Please check your email to confirm your account before logging in.')
            } else {
                // Auto redirect after 2 seconds
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create account')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
                <label htmlFor="role" className="form-label">
                    I am a <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-select"
                    required
                    disabled={loading}
                >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                    Full Name <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="email" className="form-label">
                    Email Address <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="phone" className="form-label">
                    Phone Number
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="password" className="form-label">
                    Password <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="At least 6 characters"
                    required
                    disabled={loading}
                    minLength={6}
                />
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Re-enter your password"
                    required
                    disabled={loading}
                    minLength={6}
                />
            </div>

            {success && (
                <div className="alert alert-success" role="alert">
                    ✅ Account created successfully! {error ? '' : 'Redirecting to login...'}
                </div>
            )}

            {error && (
                <div className="alert alert-error" role="alert">
                    {error}
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%' }}
            >
                {loading ? (
                    <>
                        <span className="spinner"></span>
                        Creating account...
                    </>
                ) : (
                    'Create Account'
                )}
            </button>

            <div className={styles.links}>
                <span>Already have an account?</span>
                <a href="/login" className={styles.link}>
                    Sign in
                </a>
            </div>
        </form>
    )
}
