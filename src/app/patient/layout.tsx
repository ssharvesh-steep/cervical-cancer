import React from 'react'
import { createClient } from '@/lib/supabase/server'
import PatientLayoutClient from './components/PatientLayoutClient'

export default async function PatientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let userData: any = null
    try {
        if (user) {
            console.log('PatientLayout: Fetching profile for user', user.id)
            const { data, error } = await supabase
                .from('users')
                .select('full_name')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('PatientLayout: Error fetching user profile:', JSON.stringify(error, null, 2))
            } else {
                console.log('PatientLayout: User profile found:', data)
            }
            userData = data
        } else {
            console.log('PatientLayout: No authenticated user found')
        }
    } catch (error) {
        console.error('PatientLayout: Unexpected error fetching data:', error)
        // Fallback to null userData
    }

    return (
        <PatientLayoutClient userName={userData?.full_name}>
            {children}
        </PatientLayoutClient>
    )
}
