'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugPage() {
    const [status, setStatus] = useState<any>({ loading: true })
    const supabase = createClient()

    useEffect(() => {
        async function checkData() {
            const result: any = {}

            // 1. Check Auth User
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            result.authUser = user ? { id: user.id, email: user.email, meta: user.user_metadata } : null
            result.authError = authError

            if (user) {
                // 2. Check Public User Profile
                const { data: profile, error: profileError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                result.publicProfile = profile
                result.profileError = profileError

                // 3. Check Patient Record
                const { data: patient, error: patientError } = await supabase
                    .from('patients')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

                result.patientRecord = patient
                result.patientError = patientError
            }

            setStatus(result)
        }

        checkData()
    }, [supabase])

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>Debug Info</h1>
            <pre style={{ background: '#f4f4f5', padding: '1rem', borderRadius: '8px', overflow: 'auto' }}>
                {JSON.stringify(status, null, 2)}
            </pre>
            <button
                onClick={() => window.location.reload()}
                style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}
            >
                Refresh
            </button>
        </div>
    )
}
