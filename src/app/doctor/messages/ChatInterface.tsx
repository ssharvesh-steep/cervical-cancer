'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'
import { Search, Send, MessageCircle } from 'lucide-react'

// Types
type User = {
    id: string
    full_name: string
    avatar_url?: string
}

type Message = {
    id: string
    sender_id: string
    receiver_id: string
    message: string
    created_at: string
}

export default function ChatInterface({
    currentUserId,
    chats // List of users the doctor has chatted with (or all patients)
}: {
    currentUserId: string
    chats: User[]
}) {
    const supabase = createClient()
    const [selectedUser, setSelectedUser] = useState<User | null>(chats.length > 0 ? chats[0] : null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Filter chat list
    const filteredChats = chats.filter(user =>
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Fetch messages when selected user changes
    useEffect(() => {
        if (!selectedUser) return

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${currentUserId})`)
                .order('created_at', { ascending: true })

            if (data) setMessages(data)
        }

        fetchMessages()

        // Real-time subscription
        const channel = supabase
            .channel('chat_messages')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `receiver_id=eq.${currentUserId}`
            }, (payload) => {
                if (payload.new.sender_id === selectedUser.id) {
                    setMessages(prev => [...prev, payload.new as Message])
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [selectedUser, currentUserId, supabase])

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedUser) return

        const msgContent = newMessage.trim()
        setNewMessage('') // Optimistic clear

        // Optimistic UI update
        const tempId = Math.random().toString()
        const optimisticMsg: Message = {
            id: tempId,
            sender_id: currentUserId,
            receiver_id: selectedUser.id,
            message: msgContent,
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, optimisticMsg])

        // Send to DB
        const { data, error } = await supabase
            .from('messages')
            .insert({
                sender_id: currentUserId,
                receiver_id: selectedUser.id,
                message: msgContent
            })
            .select()
            .single()

        if (error) {
            console.error('Error sending message:', error)
            // Rollback usage would go here, effectively removing the optimistic message
        } else if (data) {
            // Replace temp ID with real one if needed, or just let strict mode refresh it
            // Ideally we update the specific item in the array
            setMessages(prev => prev.map(m => m.id === tempId ? data : m))
        }
    }

    return (
        <div className={styles.container}>
            {/* Sidebar List */}
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>Messages</h2>
                    <div className={styles.searchBox}>
                        <Search className={styles.searchIcon} size={18} />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.userList}>
                    {filteredChats.map(user => (
                        <div
                            key={user.id}
                            className={`${styles.userItem} ${selectedUser?.id === user.id ? styles.userItemActive : ''}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://ui-avatars.com/api/?name=${user.full_name}&background=random`}
                                alt={user.full_name}
                                className={styles.avatar}
                            />
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>{user.full_name}</span>
                                <span className={styles.lastMessage}>Click to chat</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={styles.chatArea}>
                {selectedUser ? (
                    <>
                        <div className={styles.chatHeader}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://ui-avatars.com/api/?name=${selectedUser.full_name}&background=random`}
                                alt={selectedUser.full_name}
                                className={styles.avatar}
                                style={{ width: 40, height: 40 }}
                            />
                            <div>
                                <div className={styles.chatHeaderName}>{selectedUser.full_name}</div>
                                <div className={styles.chatHeaderStatus}>
                                    <div style={{ width: 8, height: 8, background: '#16a34a', borderRadius: '50%' }}></div>
                                    Online
                                </div>
                            </div>
                        </div>

                        <div className={styles.messagesList}>
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`${styles.messageBubble} ${msg.sender_id === currentUserId ? styles.sent : styles.received}`}
                                >
                                    {msg.message}
                                    <span className={styles.messageTime}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className={styles.inputArea}>
                            <form className={styles.inputWrapper} onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className={styles.inputField}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className={styles.sendButton} disabled={!newMessage.trim()}>
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className={styles.emptyChatState}>
                        <MessageCircle size={48} />
                        <h3>Select a patient to start messaging</h3>
                    </div>
                )}
            </div>
        </div>
    )
}
