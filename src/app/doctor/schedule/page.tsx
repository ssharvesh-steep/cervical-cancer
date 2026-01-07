import React from 'react'
import { Clock } from 'lucide-react'

export default function SchedulePage() {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Schedule Timings</h1>
            <p>Manage your availability for appointments.</p>

            <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                    <div key={day} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ marginBottom: '1rem' }}>{day}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.9rem' }}>
                            <Clock size={16} />
                            <span>09:00 AM - 05:00 PM</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
