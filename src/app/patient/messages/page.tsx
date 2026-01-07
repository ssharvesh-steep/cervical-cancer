
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MessageCenter from '@/components/shared/MessageCenter'
import styles from './page.module.css'

interface PageProps {
    searchParams: Promise<{ doctor?: string }>
}

export default async function PatientMessagesPage({ searchParams }: PageProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { doctor: doctorParam } = await searchParams

    // Get doctors from appointments
    const { data: appointmentDoctors } = await supabase
        .from('appointments')
        .select(`
      doctor_id,
      doctor:users!appointments_doctor_id_fkey(id, full_name, role)
    `)
        .eq('patient_id', (await supabase.from('patients').select('id').eq('user_id', user.id).single()).data?.id)
        .order('created_at', { ascending: false })

    // Get doctors from existing messages (sent or received)
    const { data: messageInteractions } = await supabase
        .from('messages')
        .select(`
            sender_id,
            receiver_id,
            sender:users!messages_sender_id_fkey(id, full_name, role),
            receiver:users!messages_receiver_id_fkey(id, full_name, role)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

    // Combine and deduplicate doctors
    const uniqueDoctorsMap = new Map()

    // Add from appointments
    appointmentDoctors?.forEach((app: any) => {
        if (app.doctor && app.doctor.id !== user.id) {
            uniqueDoctorsMap.set(app.doctor.id, app.doctor)
        }
    })

    // Add from messages
    messageInteractions?.forEach((msg: any) => {
        // If current user is sender, add receiver (doctor)
        if (msg.sender_id === user.id && msg.receiver && msg.receiver.id !== user.id) {
            uniqueDoctorsMap.set(msg.receiver.id, msg.receiver)
        }
        // If current user is receiver, add sender (doctor)
        if (msg.receiver_id === user.id && msg.sender && msg.sender.id !== user.id) {
            uniqueDoctorsMap.set(msg.sender.id, msg.sender)
        }
    })

    let allDoctors = Array.from(uniqueDoctorsMap.values()).map(doc => ({ doctor: doc }))

    // If a specific doctor is requested via query param, ensure they are in the list
    if (doctorParam) {
        const isAlreadyInList = allDoctors.some(d => d.doctor.id === doctorParam)

        if (!isAlreadyInList) {
            const { data: newDoctor } = await supabase
                .from('users')
                .select('id, full_name, role')
                .eq('id', doctorParam)
                .single()

            if (newDoctor) {
                // Add to the beginning of the list
                allDoctors = [{ doctor: newDoctor }, ...allDoctors]
            }
        }
    }

    // Determine the selected doctor: either from param or the first one in the list
    let selectedDoctor = null
    if (doctorParam) {
        selectedDoctor = allDoctors.find(d => d.doctor.id === doctorParam)?.doctor
    } else if (allDoctors.length > 0) {
        selectedDoctor = allDoctors[0].doctor
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Messages</h1>
                <p>Communicate with your healthcare providers</p>
            </header>

            <div className={styles.content}>
                <div className={styles.sidebar}>
                    <h3>Your Doctors</h3>
                    {allDoctors.length > 0 ? (
                        <div className={styles.doctorsList}>
                            {allDoctors.map((item) => (
                                <a
                                    key={item.doctor.id}
                                    href={`/patient/messages?doctor=${item.doctor.id}`}
                                    className={`${styles.doctorItem} ${selectedDoctor?.id === item.doctor.id ? styles.active : ''}`}
                                >
                                    <div className={styles.doctorAvatar}>
                                        {item.doctor.full_name?.charAt(0) || 'D'}
                                    </div>
                                    <div className={styles.doctorInfo}>
                                        <div className={styles.doctorName}>Dr. {item.doctor.full_name}</div>
                                        <div className={styles.doctorRole}>Healthcare Provider</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.emptyState}>
                            No messages yet. <a href="/patient/find-doctor">Find a doctor</a> to connect.
                        </p>
                    )}
                </div>

                <div className={styles.messageArea}>
                    <MessageCenter
                        currentUserId={user.id}
                        recipientId={selectedDoctor?.id}
                        recipientName={selectedDoctor ? `Dr. ${selectedDoctor.full_name}` : undefined}
                    />
                </div>
            </div>
        </div>
    )
}
