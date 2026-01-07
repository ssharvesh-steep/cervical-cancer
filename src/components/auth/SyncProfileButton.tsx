'use client'

import { useFormStatus } from 'react-dom'

export function SyncProfileButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={pending}
        >
            {pending ? 'Repairing...' : 'Repair Profile'}
        </button>
    )
}
