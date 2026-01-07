'use client';

import { useState, useEffect } from 'react';
import { databases, account, DATABASE_ID } from '@/lib/appwrite';
import styles from './page.module.css';

export default function AppwriteTest() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [connectionInfo, setConnectionInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        testConnection();
    }, []);

    async function testConnection() {
        try {
            setStatus('loading');
            setError(null);

            // Test 1: Check account session (optional - may fail if not logged in)
            let accountInfo = null;
            try {
                accountInfo = await account.get();
            } catch (e) {
                console.log('No active session (this is okay for testing)');
            }

            // Test 2: List documents from 'doctors' collection to verify DB access
            let dbAccess = false;
            try {
                await databases.listDocuments(DATABASE_ID, 'doctors');
                dbAccess = true;
            } catch (e) {
                console.log('Database access check failed', e);
            }

            setConnectionInfo({
                databaseId: DATABASE_ID,
                account: accountInfo,
                databaseAccess: dbAccess ? 'Accessible' : 'Restricted/Error'
            });
            setStatus('success');
        } catch (err: any) {
            console.error('Connection error:', err);
            setError(err.message || 'Unknown error');
            setStatus('error');
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Appwrite Database Connection Test</h1>

            <div className={styles.statusCard}>
                <h2>Connection Status</h2>
                {status === 'loading' && <p className={styles.loading}>Testing connection...</p>}
                {status === 'success' && <p className={styles.success}>✓ Connected successfully!</p>}
                {status === 'error' && <p className={styles.error}>✗ Connection failed</p>}
            </div>

            {error && (
                <div className={styles.errorCard}>
                    <h3>Error Details</h3>
                    <pre>{error}</pre>
                </div>
            )}

            {connectionInfo && (
                <div className={styles.infoCard}>
                    <h3>Connection Information</h3>
                    <pre>{JSON.stringify(connectionInfo, null, 2)}</pre>
                </div>
            )}



            <button onClick={testConnection} className={styles.retryButton}>
                Retry Connection
            </button>
        </div>
    );
}
