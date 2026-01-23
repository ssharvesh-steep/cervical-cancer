import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ChatInterface from './ChatInterface'

export default async function MessagesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get only patients who have connected via QR code (patient_doctors table)
    const { data: connectedPatients } = await supabase
        .from('patient_doctors')
        .select('patient_id')
        .eq('doctor_id', user.id)

    // Get unique patient IDs from QR code connections
    const patientIds = Array.from(new Set(connectedPatients?.map(c => c.patient_id) || []))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let patients: any[] = []

    if (patientIds.length > 0) {
        // Get User details for connected patients
        const { data: patientsData } = await supabase
            .from('patients')
            .select(`
                id,
                user:users!patients_user_id_fkey(id, full_name, email)
            `)
            .in('id', patientIds)

        // Flatten structure for the chat interface
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        patients = patientsData?.map((p: any) => {
            const user = Array.isArray(p.user) ? p.user[0] : p.user;
            return {
                id: user?.id, // We use the USER ID for messaging, not patient ID
                full_name: user?.full_name,
                email: user?.email
            };
        }) || []
    }

    return <ChatInterface currentUserId={user.id} chats={patients} />
}
