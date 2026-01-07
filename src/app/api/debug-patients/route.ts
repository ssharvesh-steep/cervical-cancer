import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
    const supabaseAdmin = createAdminClient()

    if (!supabaseAdmin) {
        return NextResponse.json({ error: 'No admin client' })
    }

    // Check Users with role patient
    const { data: patients, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('role', 'patient')
        .order('created_at', { ascending: false })

    // Check all users
    const { count: totalUsers } = await supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })


    return NextResponse.json({
        totalUsersInDB: totalUsers,
        patientsFound: patients?.length || 0,
        samplePatients: patients || [],
        error: error
    })
}
