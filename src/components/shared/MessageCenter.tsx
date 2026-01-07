'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './MessageCenter.module.css'

interface Message {
    id: string
    sender_id: string
    receiver_id: string
    message: string
    is_read: boolean
    is_urgent: boolean
    created_at: string
    sender?: {
        full_name: string
        role: string
    }
}

interface MessageCenterProps {
    currentUserId: string
    recipientId?: string // This is the API prop, not the DB column, so it's fine to keep as is, but we map it to receiver_id
    recipientName?: string
}

export default function MessageCenter({ currentUserId, recipientId, recipientName }: MessageCenterProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        if (recipientId) {
            loadMessages()

            // Subscribe to real-time messages
            const channel = supabase
                .channel('messages')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'messages',
                        filter: `receiver_id=eq.${currentUserId}`,
                    },
                    (payload) => {
                        setMessages((prev) => [...prev, payload.new as Message])
                        scrollToBottom()
                    }
                )
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }
    }, [recipientId, currentUserId])

    const loadMessages = async () => {
        if (!recipientId) return

        setLoading(true)
        const { data, error } = await supabase
            .from('messages')
            .select(`
        *,
        sender:users!messages_sender_id_fkey(full_name, role)
      `)
            .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${currentUserId})`)
            .order('created_at', { ascending: true }) as { data: any[] | null, error: any }

        if (data) {
            setMessages(data)
            scrollToBottom()

            // Mark messages as read
            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('receiver_id', currentUserId)
                .eq('sender_id', recipientId)
                .eq('is_read', false)
        }

        setLoading(false)
    }

    // Auto-scroll when messages change
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newMessage.trim() || !recipientId) return

        // 1. Create a temporary message object (Optimistic UI)
        const optimisticMessage: Message = {
            id: `temp-${Date.now()}`, // Temporary ID
            sender_id: currentUserId,
            receiver_id: recipientId,
            message: newMessage.trim(),
            is_read: false,
            is_urgent: false,
            created_at: new Date().toISOString(),
        }

        // 2. Immediately update UI
        // Use functional update to ensure reliability
        setMessages((prev) => [...prev, optimisticMessage])
        setNewMessage('')

        // Scroll will happen via useEffect now

        setSending(true)

        // 3. Send to server
        const { error } = await supabase.from('messages').insert({
            sender_id: currentUserId,
            receiver_id: recipientId,
            message: optimisticMessage.message,
        })

        if (error) {
            console.error('Error sending message:', error)
            // Rollback on error
            setMessages((prev) => prev.filter(m => m.id !== optimisticMessage.id))
            alert('Failed to send message: ' + error.message)
            setNewMessage(optimisticMessage.message)
        }

        setSending(false)
    }

    if (!recipientId) {
        return (
            <div className={styles.emptyState}>
                <p>Select a conversation to start messaging</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>{recipientName || 'Messages'}</h3>
            </div>

            <div className={styles.messagesContainer}>
                {loading ? (
                    <div className={styles.loading}>
                        <span className="spinner"></span>
                        Loading messages...
                    </div>
                ) : messages.length === 0 ? (
                    <div className={styles.emptyMessages}>
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.message} ${msg.sender_id === currentUserId ? styles.sent : styles.received
                                    }`}
                            >
                                <div className={styles.messageContent}>
                                    <p>{msg.message}</p>
                                    <span className={styles.timestamp}>
                                        {new Date(msg.created_at).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <form onSubmit={handleSend} className={styles.inputContainer}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={styles.input}
                    disabled={sending}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={sending || !newMessage.trim()}
                >
                    {sending ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    )
}
