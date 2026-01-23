import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Helper to check admin status server-side
async function isUserAdmin() {
    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll() { return cookieStore.getAll() },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setAll(cookiesToSet: any) {
                // We don't need to set cookies here for just reading
            }
        }
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: userRole } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    return userRole?.role === 'admin'
}

export async function GET(request: Request) {
    if (!(await isUserAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cookieStore = await cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createServerClient(supabaseUrl, supabaseKey, { cookies: { getAll: () => cookieStore.getAll(), setAll: () => { } } })

    try {
        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role')

        let query = supabase.from('users').select('*')

        if (role) {
            query = query.eq('role', role)
        }

        const { data, error } = await query.order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ users: data })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    if (!(await isUserAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { userId } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        // Use database admin client to delete from auth system if possible
        // Note: admin.ts provides createAdminClient
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (supabaseServiceRoleKey) {
            const supabaseAdmin = createServerClient(supabaseUrl, supabaseServiceRoleKey, {
                cookies: {
                    getAll() { return [] },
                    setAll() { }
                }
            })

            // Delete from auth.users (cascade should handle public.users, but we can do both)
            const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

            if (authError) {
                console.error('Error deleting auth user:', authError)
                // Continue to try deleting from public table as fallback
            }
        }

        const cookieStore = await cookies()
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Or SERVICE_ROLE if available
        const supabase = createServerClient(supabaseUrl, supabaseKey, { cookies: { getAll: () => cookieStore.getAll(), setAll: () => { } } })

        const { error } = await supabase.from('users').delete().eq('id', userId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export async function PATCH(request: Request) {
    if (!(await isUserAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { userId, role } = await request.json()

        if (!userId || !role) {
            return NextResponse.json({ error: 'User ID and Role required' }, { status: 400 })
        }

        const cookieStore = await cookies()
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        const supabase = createServerClient(supabaseUrl, supabaseKey, { cookies: { getAll: () => cookieStore.getAll(), setAll: () => { } } })

        const { error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', userId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
