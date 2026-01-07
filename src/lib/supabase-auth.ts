import { createClient } from '@/lib/supabase/client'

type UserRole = 'doctor' | 'patient'

export interface SignUpData {
    email: string
    password: string
    fullName: string
    role: UserRole
    phone?: string
}

export interface SignInData {
    email: string
    password: string
}

export async function signUp(data: SignUpData) {
    const supabase = createClient()

    try {
        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.fullName,
                    role: data.role,
                    phone: data.phone || null,
                },
            },
        })

        if (authError) throw authError

        return { user: authData.user }
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign up')
    }
}

export async function signIn(data: SignInData) {
    const supabase = createClient()

    try {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })

        if (error) throw error

        return { user: authData.user, session: authData.session }
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign in')
    }
}

export async function signOut() {
    const supabase = createClient()

    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    } catch (error: any) {
        throw new Error(error.message || 'Failed to sign out')
    }
}

export async function getCurrentUser() {
    const supabase = createClient()

    try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    } catch (error) {
        return null
    }
}

export async function getUserRole(): Promise<UserRole | null> {
    const supabase = createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        if (error) throw error
        return data?.role as UserRole || null
    } catch (error) {
        return null
    }
}

export async function getUserProfile() {
    const supabase = createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) throw error
        return data
    } catch (error: any) {
        throw new Error(error.message || 'Failed to get user profile')
    }
}

export async function getPatientProfile() {
    const supabase = createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        // Get user profile
        const { data: userProfile, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        if (userError) throw userError
        if (!userProfile || userProfile.role !== 'patient') return null

        // Get patient-specific data
        const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (patientError) {
            // Patient record might not exist yet
            return { ...userProfile, patient: null }
        }

        return { ...userProfile, patient: patientData }
    } catch (error) {
        return null
    }
}

export async function getDoctorProfile() {
    const supabase = createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        // Get user profile
        const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

        if (error) throw error
        if (!userProfile || userProfile.role !== 'doctor') return null

        return userProfile
    } catch (error) {
        return null
    }
}
