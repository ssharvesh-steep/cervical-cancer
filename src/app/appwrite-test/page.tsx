'use client';

import { useState, useEffect } from 'react';
import { databases, account, DATABASE_ID } from '@/lib/appwrite';
import styles from './page.module.css';

export default function AppwriteTest() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [connectionInfo, setConnectionInfo] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [collections, setCollections] = useState<any[]>([]);

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

            // Test 2: List collections in the database
            const collectionsResponse = await databases.listCollections(DATABASE_ID);

            setCollections(collectionsResponse.collections);
            setConnectionInfo({
                databaseId: DATABASE_ID,
                totalCollections: collectionsResponse.total,
                account: accountInfo,
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
            <h1>Appwrite Database Connection Test</h1>

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

            {collections.length > 0 && (
                <div className={styles.collectionsCard}>
                    <h3>Available Collections ({collections.length})</h3>
                    <ul>
                        {collections.map((collection) => (
                            <li key={collection.$id}>
                                <strong>{collection.name}</strong>
                                <br />
                                <small>ID: {collection.$id}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={testConnection} className={styles.retryButton}>
                Retry Connection
            </button>
        </div>
    );
}
