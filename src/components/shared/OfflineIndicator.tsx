'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
    const [isOnline, setIsOnline] = useState(true);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        // Set initial state
        if (typeof navigator !== 'undefined' && navigator.onLine !== isOnline) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsOnline(navigator.onLine);
        }

        const handleOnline = () => {
            setIsOnline(true);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowNotification(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (!showNotification) return null;

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
            <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${isOnline
                    ? 'bg-success-50 text-success-700 border border-success-200'
                    : 'bg-warning-50 text-warning-700 border border-warning-200'
                    }`}
            >
                {isOnline ? (
                    <>
                        <Wifi className="w-5 h-5" />
                        <span className="font-medium">Back online</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-5 h-5" />
                        <span className="font-medium">You&apos;re offline</span>
                    </>
                )}
            </div>
        </div>
    );
}
