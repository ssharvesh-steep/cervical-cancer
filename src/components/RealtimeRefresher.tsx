'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface RealtimeRefresherProps {
    table: string
    channelName?: string
    filter?: string
}

export default function RealtimeRefresher({ table, channelName, filter }: RealtimeRefresherProps) {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const channel = supabase
            .channel(channelName || `public:${table}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: table,
                    filter: filter
                },
                () => {
                    console.log(`Change detected in ${table}, refreshing...`)
                    router.refresh()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, router, table, channelName, filter])

    return null
}
