# Appwrite Configuration

Add these environment variables to your `.env.local` file:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://sfo.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=694e144e003baee5a5ff
NEXT_PUBLIC_APPWRITE_DATABASE_ID=standard_5f913fcd87d3371c5e41a5706152b4648d76afea7f456bc7ea2a794abe50e7bf8d19a5f4554dd05c9aaff01d6a507d6ac01bd96508a5a2e3b0a6137665593d838145a7154a9c7075957eaaad372e49934deafe0734290e6741a15459761d2f45423bbbaf210cdfb1f9e8a1128cff5b7fcf3fc7f2bf3dc6956fc6baddbc25429c

# Optional: For server-side admin operations
# APPWRITE_API_KEY=your_api_key_here
```

## Quick Start

1. Copy the environment variables above to your `.env.local` file
2. Import Appwrite services in your components:

```typescript
// For client-side operations
import { databases, account, DatabaseService, Query } from '@/lib/appwrite';

// For server-side operations
import { createAdminClient } from '@/lib/appwrite/server';
```

## Usage Examples

### Client-side CRUD Operations

```typescript
import { DatabaseService, Query } from '@/lib/appwrite';

// Create a document
const result = await DatabaseService.createDocument('collection_id', {
  name: 'John Doe',
  email: 'john@example.com'
});

// List documents with queries
const users = await DatabaseService.listDocuments('collection_id', [
  Query.equal('status', 'active'),
  Query.limit(10)
]);

// Update a document
await DatabaseService.updateDocument('collection_id', 'document_id', {
  name: 'Jane Doe'
});

// Delete a document
await DatabaseService.deleteDocument('collection_id', 'document_id');
```

### Server-side Operations

```typescript
import { createAdminClient } from '@/lib/appwrite/server';

const { databases } = createAdminClient();

const documents = await databases.listDocuments(
  DATABASE_ID,
  'collection_id'
);
```

## Next Steps

1. **Add your collection IDs** to `src/lib/appwrite/config.ts`
2. **Test the connection** using the test page at `/appwrite-test`
3. **Replace Supabase queries** with Appwrite queries as needed
