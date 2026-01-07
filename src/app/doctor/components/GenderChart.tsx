'use client'

import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
    { name: 'Male', value: 45, color: '#f59e0b' },
    { name: 'Female', value: 30, color: '#6366f1' },
    { name: 'Child', value: 25, color: '#0ea5e9' },
]

export default function GenderChart() {
    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Gender</h3>
                <select style={{
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.85rem',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                }}>
                    <option>2020</option>
                </select>
            </div>

            <div style={{ flex: 1, minHeight: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
                {data.map((item) => (
                    <div key={item.name} style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }}></div>
                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.name}</span>
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>{item.value}%</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
