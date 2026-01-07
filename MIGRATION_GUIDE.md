# Remaining Supabase to Appwrite Migration

This document lists all remaining files that still reference Supabase and need to be migrated to Appwrite.

## Files Requiring Migration

The following files still contain Supabase imports and need to be updated:

### Components

1. **`/src/components/shared/MessageCenter.tsx`**
   - Replace `createClient` from Supabase with Appwrite
   - Replace `supabase.from('messages')` with `DatabaseService.listDocuments`
   - Replace real-time subscriptions with Appwrite Realtime

### Pages

2. **`/src/app/debug/page.tsx`**
3. **`/src/app/patient/profile/page.tsx`**
4. **`/src/app/doctor/profile/page.tsx`**
5. **`/src/app/patient/dashboard/page.tsx`**
6. **`/src/app/doctor/dashboard/page.tsx`**
7. And 50+ other page files

## Migration Pattern

For each file, follow this pattern:

### 1. Replace Imports

**Before:**
```typescript
import { createClient } from '@/lib/supabase/client'
```

**After:**
```typescript
import { DatabaseService, Query } from '@/lib/appwrite/database'
import { appwriteConfig } from '@/lib/appwrite/config'
import { account } from '@/lib/appwrite/client'
```

### 2. Replace Database Queries

**Before (Supabase):**
```typescript
const supabase = createClient()
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value')
```

**After (Appwrite):**
```typescript
const result = await DatabaseService.listDocuments(
  appwriteConfig.collections.table_name,
  [Query.equal('column', 'value')]
)

if (result.success) {
  const data = result.data
}
```

### 3. Replace Authentication

**Before (Supabase):**
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

**After (Appwrite):**
```typescript
import { getCurrentUser } from '@/lib/auth'
const user = await getCurrentUser()
```

## Quick Reference

### Common Supabase → Appwrite Conversions

| Supabase | Appwrite |
|----------|----------|
| `supabase.from('table').select()` | `DatabaseService.listDocuments('collection')` |
| `supabase.from('table').insert(data)` | `DatabaseService.createDocument('collection', data)` |
| `supabase.from('table').update(data)` | `DatabaseService.updateDocument('collection', id, data)` |
| `supabase.from('table').delete()` | `DatabaseService.deleteDocument('collection', id)` |
| `.eq('col', 'val')` | `Query.equal('col', 'val')` |
| `.order('col')` | `Query.orderAsc('col')` or `Query.orderDesc('col')` |
| `.limit(10)` | `Query.limit(10)` |

## Next Steps

1. Review each file in the list above
2. Apply the migration pattern
3. Test each migrated component
4. Remove any remaining Supabase references

## Note

Some files may require custom logic beyond simple query replacement, especially:
- Real-time subscriptions
- File uploads (use Appwrite Storage)
- Complex joins (may need multiple queries)
