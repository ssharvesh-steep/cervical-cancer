import { databases, DATABASE_ID } from './client';
import { Query, ID } from 'appwrite';

/**
 * Database service wrapper for common CRUD operations
 */
export class DatabaseService {
    /**
     * Create a new document in a collection
     */
    static async createDocument<T>(
        collectionId: string,
        data: Omit<T, '$id' | '$createdAt' | '$updatedAt'>,
        documentId: string = ID.unique()
    ) {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                collectionId,
                documentId,
                data
            );
            return { success: true, data: response as T };
        } catch (error) {
            console.error('Error creating document:', error);
            return { success: false, error };
        }
    }

    /**
     * Get a document by ID
     */
    static async getDocument<T>(collectionId: string, documentId: string) {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                collectionId,
                documentId
            );
            return { success: true, data: response as T };
        } catch (error) {
            console.error('Error getting document:', error);
            return { success: false, error };
        }
    }

    /**
     * List documents with optional queries
     */
    static async listDocuments<T>(
        collectionId: string,
        queries: string[] = []
    ) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                collectionId,
                queries
            );
            return { success: true, data: response.documents as T[] };
        } catch (error) {
            console.error('Error listing documents:', error);
            return { success: false, error };
        }
    }

    /**
     * Update a document
     */
    static async updateDocument<T>(
        collectionId: string,
        documentId: string,
        data: Partial<T>
    ) {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                collectionId,
                documentId,
                data
            );
            return { success: true, data: response as T };
        } catch (error) {
            console.error('Error updating document:', error);
            return { success: false, error };
        }
    }

    /**
     * Delete a document
     */
    static async deleteDocument(collectionId: string, documentId: string) {
        try {
            await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting document:', error);
            return { success: false, error };
        }
    }
}

// Export Query helpers for building queries
export { Query } from 'appwrite';
export { ID } from 'appwrite';
