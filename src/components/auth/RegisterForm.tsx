'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/supabase-auth'
import styles from './RegisterForm.module.css'
import { useLanguage } from '@/context/LanguageContext'

type UserRole = 'doctor' | 'patient'

export default function RegisterForm() {
    const router = useRouter()
    const { t } = useLanguage()
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
        const value = e.target.name === 'password' || e.target.name === 'confirmPassword'
            ? e.target.value.trim() // Trim passwords to avoid whitespace issues
            : e.target.value;

        setFormData({
            ...formData,
            [e.target.name]: value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)

        // Trim all fields
        const trimmedData = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password.trim(),
            confirmPassword: formData.confirmPassword.trim(),
            role: formData.role
        };

        // Validation
        if (!trimmedData.fullName) {
            setError(t('auth.errors.fullNameRequired') || 'Full name is required')
            return
        }

        if (!trimmedData.email) {
            setError(t('auth.errors.emailRequired') || 'Email is required')
            return
        }

        if (trimmedData.password !== trimmedData.confirmPassword) {
            setError(t('auth.errors.passwordsNotMatch'))
            return
        }

        if (trimmedData.password.length < 6) {
            setError(t('auth.errors.passwordTooShort') || 'Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            const result = await signUp({
                email: trimmedData.email,
                password: trimmedData.password,
                fullName: trimmedData.fullName,
                role: trimmedData.role,
                phone: trimmedData.phone || undefined,
            })

            setSuccess(true)

            // Check if email confirmation is required
            if (result.user && !result.user.confirmed_at) {
                setError(t('auth.errors.emailConfirmationRequired'))
            } else {
                // Auto redirect after 2 seconds
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            }
        } catch (err) {
            console.error('Registration error:', err);
            const errorMessage = err instanceof Error ? err.message : t('auth.errors.accountCreationFailed');
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
                <label htmlFor="role" className="form-label">
                    {t('auth.role')} <span style={{ color: 'var(--color-error)' }}>*</span>
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
                    <option value="patient">{t('auth.patient')}</option>
                    <option value="doctor">{t('auth.doctor')}</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                    {t('auth.fullName')} <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={t('auth.fullName')}
                    required
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="email" className="form-label">
                    {t('auth.email')} <span style={{ color: 'var(--color-error)' }}>*</span>
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
                    {t('auth.phone')}
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
                    {t('auth.password')} <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={t('auth.password')}
                    required
                    disabled={loading}
                    minLength={6}
                />
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                    {t('auth.confirmPassword')} <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder={t('auth.confirmPassword')}
                    required
                    disabled={loading}
                    minLength={6}
                />
            </div>

            {success && (
                <div className="alert alert-success" role="alert">
                    ✅ {t('auth.success.accountCreated')} {error ? '' : t('auth.success.redirecting')}
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
                        {t('auth.buttons.creating')}
                    </>
                ) : (
                    t('auth.buttons.create')
                )}
            </button>

            <div className={styles.links}>
                <span>{t('auth.haveAccount')}</span>
                <a href="/login" className={styles.link}>
                    {t('auth.buttons.signIn')}
                </a>
            </div>
        </form>
    )
}
