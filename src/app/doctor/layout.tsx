import React from 'react'
import { createClient } from '@/lib/supabase/server'
import DoctorLayoutClient from './components/DoctorLayoutClient'

export default async function DoctorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userData = null
    if (user) {
        const { data } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', user.id)
            .single()
        userData = data
    }

    return (
        <DoctorLayoutClient userName={userData?.full_name}>
            {children}
        </DoctorLayoutClient>
    )
}
