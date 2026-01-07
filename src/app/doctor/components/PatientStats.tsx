import React from 'react'
import { User, UserPlus } from 'lucide-react'

export default function PatientStats({ totalPatients }: { totalPatients: number }) {
    // Mock data for splitting into New/Old since we just have total count
    // In a real app we'd query this specifically
    const newPatients = Math.floor(totalPatients * 0.15)
    const oldPatients = totalPatients - newPatients

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Patients</h3>
                <select style={{
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.85rem',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                }}>
                    <option>2025</option>
                </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#dbeafe',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <UserPlus size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{newPatients}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>New Patients</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>+15%</span>
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#ffff', // transparent or white
                    borderRadius: '12px'
                    // No background/border for second item per design typically, or faint one
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#ffedd5',
                        color: '#ea580c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <User size={20} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{oldPatients}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Old Patients</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>+15%</span>
                </div>
            </div>
        </div>
    )
}
