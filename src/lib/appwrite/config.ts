// Appwrite configuration
export const appwriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1',
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '694e144e003baee5a5ff',
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'standard_5f913fcd87d3371c5e41a5706152b4648d76afea7f456bc7ea2a794abe50e7bf8d19a5f4554dd05c9aaff01d6a507d6ac01bd96508a5a2e3b0a6137665593d838145a7154a9c7075957eaaad372e49934deafe0734290e6741a15459761d2f45423bbbaf210cdfb1f9e8a1128cff5b7fcf3fc7f2bf3dc6956fc6baddbc25429c',
    // Collection IDs - update these based on your Appwrite database structure
    collections: {
        users: 'users',
        patients: 'patients',
        doctors: 'doctors',
        appointments: 'appointments',
        symptoms_log: 'symptoms_log',
        messages: 'messages',
        conversations: 'conversations',
        medical_history: 'medical_history',
        treatments: 'treatments',
        screening_records: 'screening_records',
        diagnoses: 'diagnoses',
        medications: 'medications',
        treatment_sessions: 'treatment_sessions',
        notifications: 'notifications',
        educational_content: 'educational_content',
    }
};
