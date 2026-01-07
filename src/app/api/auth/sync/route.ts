import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabaseAdmin = createAdminClient()

    if (!supabaseAdmin) {
        return NextResponse.json({
            error: 'Configuration Error: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local. Please add it to enable profile repair.'
        }, { status: 500 })
    }

    try {
        // 1. Check/Create Public User
        const { data: publicUser } = await supabaseAdmin
            .from('users')
            .select('id, role')
            .eq('id', user.id)
            .maybeSingle()

        if (!publicUser) {
            const fullName = user.user_metadata?.full_name || 'User'
            const role = user.user_metadata?.role || 'patient'

            const { error: insertError } = await supabaseAdmin
                .from('users')
                .insert({
                    id: user.id,
                    email: user.email,
                    full_name: fullName,
                    role: role
                })

            if (insertError) throw insertError
        }

        // 2. Check/Create Patient Record if role is patient
        const role = user.user_metadata?.role || publicUser?.role || 'patient'

        if (role === 'patient') {
            const { data: patientRecord } = await supabaseAdmin
                .from('patients')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle()

            if (!patientRecord) {
                const { error: patientError } = await supabaseAdmin
                    .from('patients')
                    .insert({
                        user_id: user.id
                    })

                if (patientError) throw patientError
            }
        }

        return NextResponse.json({ success: true, message: 'Profile synced successfully' })
    } catch (error: any) {
        console.error('Profile sync error:', error)
        return NextResponse.json({
            error: error.message || 'Failed to sync profile'
        }, { status: 500 })
    }
}
