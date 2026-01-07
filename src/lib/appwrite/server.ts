import { Client, Databases, Account, Storage, Users } from 'node-appwrite';
import { appwriteConfig } from './config';

// Server-side Appwrite client (for API routes and server components)
export function createAdminClient() {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId);

    // Set API key if available (for admin operations)
    if (process.env.APPWRITE_API_KEY) {
        client.setKey(process.env.APPWRITE_API_KEY);
    }

    return {
        client,
        databases: new Databases(client),
        account: new Account(client),
        storage: new Storage(client),
        users: new Users(client),
    };
}

// Export database ID for convenience
export const DATABASE_ID = appwriteConfig.databaseId;
