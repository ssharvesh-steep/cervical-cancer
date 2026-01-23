import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileContent from './ProfileContent'

export default async function DoctorProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user data
    const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .single() as { data: any | null }

    return <ProfileContent userData={userData} />
}
