'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client' // Use client-side client
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await supabase.auth.signOut()
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Error logging out:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: 500
            }}
        >
            <LogOut size={18} />
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    )
}
