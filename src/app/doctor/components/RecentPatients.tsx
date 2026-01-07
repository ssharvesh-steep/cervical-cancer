import React from 'react'
import { MoreVertical } from 'lucide-react'

// Simple table styles
const styles = {
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginTop: '1rem'
    },
    th: {
        textAlign: 'left' as const,
        padding: '1rem',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: '#64748b',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc'
    },
    td: {
        padding: '1rem',
        fontSize: '0.9rem',
        color: '#334155',
        borderBottom: '1px solid #f1f5f9'
    },
    patientCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    avatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#e2e8f0',
        objectFit: 'cover' as const
    },
    statusBadge: {
        display: 'inline-block',
        padding: '0.25rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        backgroundColor: '#f1f5f9',
        color: '#475569'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1rem'
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: '#0f172a'
    },
    link: {
        fontSize: '0.9rem',
        color: '#3b82f6',
        textDecoration: 'none'
    }
}

export default function RecentPatients({ patients }: { patients: any[] }) {
    return (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', marginTop: '2rem' }}>
            <div style={styles.header}>
                <h3 style={styles.title}>Recent Patients</h3>
                <a href="/doctor/patients" style={styles.link}>View All &gt;</a>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Patient Name</th>
                            <th style={styles.th}>Visit Id</th>
                            <th style={styles.th}>Date</th>
                            <th style={styles.th}>Gender</th>
                            <th style={styles.th}>Diseases</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8' }}>
                                    No recent patients found.
                                </td>
                            </tr>
                        )}
                        {patients.map((patient) => (
                            <tr key={patient.id}>
                                <td style={styles.td}>
                                    <div style={styles.patientCell}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${patient.user?.full_name || 'User'}&background=random`}
                                            alt=""
                                            style={styles.avatar}
                                        />
                                        <span style={{ fontWeight: 500 }}>{patient.user?.full_name}</span>
                                    </div>
                                </td>
                                <td style={styles.td}>{patient.id.substring(0, 8).toUpperCase()}</td>
                                <td style={styles.td}>{new Date(patient.created_at).toLocaleDateString()}</td>
                                <td style={styles.td}>{patient.gender || 'Female'}</td>
                                <td style={styles.td}>-</td>
                                <td style={styles.td}>
                                    <span style={{ color: '#64748b' }}>Out-Patient</span>
                                </td>
                                <td style={styles.td}>
                                    <MoreVertical size={16} color="#94a3b8" style={{ cursor: 'pointer' }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
