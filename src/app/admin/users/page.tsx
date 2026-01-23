'use client'

import { useEffect, useState } from 'react'
import { Search, Trash2, Edit2, Shield, User, Stethoscope } from 'lucide-react'
import styles from '../admin.module.css'
import { useLanguage } from '@/context/LanguageContext'

interface UserData {
    id: string
    email: string
    role: string
    created_at: string
    full_name?: string
}

export default function UsersPage() {
    const { t } = useLanguage()
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [deletingId, setDeletingId] = useState<string | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users')
            if (response.ok) {
                const data = await response.json()
                setUsers(data.users || [])
            } else {
                console.error('Failed to fetch users')
            }
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

        setDeletingId(userId)
        try {
            const response = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            })

            if (response.ok) {
                setUsers(users.filter(user => user.id !== userId))
            } else {
                alert('Failed to delete user')
            }
        } catch (error) {
            console.error('Error deleting user:', error)
            alert('Error deleting user')
        } finally {
            setDeletingId(null)
        }
    }

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'admin': return styles.badgeAdmin
            case 'doctor': return styles.badgeRole // You might want a specific color for doctor
            default: return styles.badgeRole
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <Shield size={14} />
            case 'doctor': return <Stethoscope size={14} />
            default: return <User size={14} />
        }
    }

    return (
        <div>
            <header className={styles.header}>
                <h1 className={styles.title}>{t('admin.users.title')}</h1>
                <div className={styles.headerActions}>
                    <div className={styles.searchBar}>
                        <Search size={18} color="#64748b" />
                        <input
                            type="text"
                            placeholder={t('admin.users.search')}
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <h2 className={styles.tableTitle}>All Users</h2>
                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                        {filteredUsers.length} users found
                    </span>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>{t('admin.users.table.name')}</th>
                                <th>{t('admin.users.table.email')}</th>
                                <th>{t('admin.users.table.role')}</th>
                                <th>{t('admin.users.table.joined')}</th>
                                <th>{t('admin.users.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div className={styles.avatar} style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                                                    {user.full_name ? user.full_name[0].toUpperCase() : 'U'}
                                                </div>
                                                <span style={{ fontWeight: 500, color: '#0f172a' }}>
                                                    {user.full_name || 'N/A'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`${styles.badge} ${getRoleBadgeClass(user.role)}`} style={{ gap: '0.25rem' }}>
                                                {getRoleIcon(user.role)}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className={styles.iconBtn} title={t('admin.users.actions.edit')}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
                                                    title={t('admin.users.actions.delete')}
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={deletingId === user.id}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
