import React from 'react'

interface StatCardProps {
    title: string
    value: string
    subtext: string
    icon: React.ReactNode
    color: string
}

export default function StatCard({ title, value, subtext, icon, color }: StatCardProps) {
    return (
        <div style={{
            backgroundColor: color,
            borderRadius: '16px',
            padding: '1.5rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            minWidth: '240px',
            flex: 1
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {icon}
            </div>
            <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, lineHeight: 1 }}>{value}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>{subtext}</p>
            </div>
        </div>
    )
}
