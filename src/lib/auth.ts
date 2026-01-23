import { account, databases, DATABASE_ID } from '@/lib/appwrite/client'
import { DatabaseService, ID } from '@/lib/appwrite/database'
import { appwriteConfig } from '@/lib/appwrite/config'

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
    try {
        // Create user account
        const user = await account.create(
            ID.unique(),
            data.email,
            data.password,
            data.fullName
        )

        // Create session (auto-login after signup)
        await account.createEmailPasswordSession(data.email, data.password)

        // Create user profile in database
        await DatabaseService.createDocument(
            appwriteConfig.collections.users || 'users',
            {
                role: data.role,
                full_name: data.fullName,
                email: data.email,
                phone: data.phone || null,
                is_active: true,
            },
            user.$id // Use the same ID as the auth user
        )

        // If patient, create patient record
        if (data.role === 'patient') {
            await DatabaseService.createDocument(
                appwriteConfig.collections.patients || 'patients',
                {
                    user_id: user.$id,
                }
            )
        }

        return { user }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to sign up'
        throw new Error(message)
    }
}

export async function signIn(data: SignInData) {
    try {
        const session = await account.createEmailPasswordSession(
            data.email,
            data.password
        )

        const user = await account.get()

        return { user, session }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to sign in'
        throw new Error(message)
    }
}

export async function signOut() {
    try {
        await account.deleteSession('current')
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to sign out'
        throw new Error(message)
    }
}

export async function resetPassword(email: string) {
    try {
        await account.createRecovery(
            email,
            `${window.location.origin}/auth/reset-password`
        )
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send reset email'
        throw new Error(message)
    }
}

export async function updatePassword(newPassword: string, oldPassword: string) {
    try {
        await account.updatePassword(newPassword, oldPassword)
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update password'
        throw new Error(message)
    }
}

export async function getCurrentUser() {
    try {
        const user = await account.get()
        return user
    } catch (error) {
        return null
    }
}

export async function getUserRole(): Promise<UserRole | null> {
    try {
        const user = await account.get()
        if (!user) return null

        const result = await DatabaseService.getDocument<{ role: UserRole }>(
            appwriteConfig.collections.users || 'users',
            user.$id
        )

        if (!result.success || !result.data) return null

        return result.data.role
    } catch (error) {
        return null
    }
}

export async function getUserProfile() {
    try {
        const user = await account.get()
        if (!user) return null

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await DatabaseService.getDocument<any>(
            appwriteConfig.collections.users || 'users',
            user.$id
        )

        if (!result.success) {
            throw new Error('Failed to get user profile')
        }

        return result.data
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get user profile'
        throw new Error(message)
    }
}

export async function getDoctorProfile() {
    try {
        const user = await account.get()
        if (!user) return null

        // First get user profile to check role
        const userProfile = await getUserProfile()
        if (!userProfile || userProfile.role !== 'doctor') {
            return null
        }

        return userProfile
    } catch (error) {
        return null
    }
}

export async function getPatientProfile() {
    try {
        const user = await account.get()
        if (!user) return null

        // Get user profile
        const userProfile = await getUserProfile()
        if (!userProfile || userProfile.role !== 'patient') {
            return null
        }

        // Get patient-specific data
        const result = await DatabaseService.listDocuments(
            appwriteConfig.collections.patients || 'patients',
            [`user_id=${user.$id}`]
        )

        if (!result.success || !result.data || result.data.length === 0) {
            return { ...userProfile, patient: null }
        }

        return { ...userProfile, patient: result.data[0] }
    } catch (error) {
        return null
    }
}
