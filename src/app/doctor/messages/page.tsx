import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChatInterface from './ChatInterface'

export default async function MessagesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get patients associated with the doctor (either via appointments or explicit assignments)
    // For now, getting all patients that have had an appointment with this doctor
    // A distinct query is best here.

    // Step 1: Get Patient IDs from appointments
    const { data: appointments } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('doctor_id', user.id)

    // Unique patient IDs
    const patientIds = Array.from(new Set(appointments?.map(a => a.patient_id) || []))

    let patients: any[] = []

    if (patientIds.length > 0) {
        // Step 2: Get User details for these patients
        const { data: patientsData } = await supabase
            .from('patients')
            .select(`
                id,
                user:users!patients_user_id_fkey(id, full_name, email)
            `)
            .in('id', patientIds)

        // Flatten structure for the chat interface
        patients = patientsData?.map((p: any) => {
            const user = Array.isArray(p.user) ? p.user[0] : p.user;
            return {
                id: user?.id, // We use the USER ID for messaging, not patient ID
                full_name: user?.full_name,
                email: user?.email
            };
        }) || []
    }

    // If no specific patients found (fresh account), maybe fetch all users for demo purposes?
    // Let's fallback to fetching recent registered users if list is empty, for the sake of the demo
    if (patients.length === 0) {
        const { data: allUsers } = await supabase
            .from('users')
            .select('id, full_name, email')
            .neq('id', user.id) // Don't chat with self
            .limit(10)

        patients = allUsers || []
    }

    return <ChatInterface currentUserId={user.id} chats={patients} />
}
