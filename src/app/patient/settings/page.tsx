import React from 'react'
import LogoutButton from '../components/LogoutButton'

export default function SettingsPage() {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Settings</h1>
            <p>Manage your account settings and preferences.</p>

            <div style={{ marginTop: '2rem', maxWidth: '600px', display: 'grid', gap: '1rem' }}>
                <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', borderColor: '#fee2e2' }}>
                    <h3 style={{ color: '#ef4444' }}>Session</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>Sign out of your account on this device.</p>
                    <LogoutButton />
                </div>
            </div>
        </div>
    )
}
