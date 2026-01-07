import { createClient } from '@/lib/supabase/server'

export default async function DebugPage() {
    const supabase = await createClient()

    // Check auth user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Check users table
    const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(5)

    // Check patients table
    const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .limit(5)

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>Debug Information</h1>

            <h2>Auth User</h2>
            <pre>{JSON.stringify({ user, authError }, null, 2)}</pre>

            <h2>Users Table (First 5)</h2>
            <pre>{JSON.stringify({ users, usersError }, null, 2)}</pre>

            <h2>Patients Table (First 5)</h2>
            <pre>{JSON.stringify({ patients, patientsError }, null, 2)}</pre>
        </div>
    )
}
