import { Client, Databases, Account, Storage } from 'appwrite';
import { appwriteConfig } from './config';

// Client-side Appwrite client (for browser)
export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

// Service instances
export const databases = new Databases(client);
export const account = new Account(client);
export const storage = new Storage(client);

// Export database ID for convenience
export const DATABASE_ID = appwriteConfig.databaseId;
