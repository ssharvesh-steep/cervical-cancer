'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getUserRole } from '@/lib/supabase-auth'
import styles from './LoginForm.module.css'

export default function LoginForm() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signIn({ email, password })

            // Get user role and redirect to appropriate dashboard
            const role = await getUserRole()

            if (role === 'patient') {
                window.location.href = '/patient/dashboard'
            } else if (role === 'doctor') {
                window.location.href = '/doctor/dashboard'
            } else {
                // Fallback to patient dashboard which handles missing profiles
                window.location.href = '/patient/dashboard'
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to sign in')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
                <label htmlFor="email" className="form-label">
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    minLength={6}
                />
            </div>

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
                        Signing in...
                    </>
                ) : (
                    'Sign In'
                )}
            </button>

            <div className={styles.links}>
                <a href="/auth/forgot-password" className={styles.link}>
                    Forgot password?
                </a>
                <a href="/register" className={styles.link}>
                    Create an account
                </a>
            </div>
        </form>
    )
}
