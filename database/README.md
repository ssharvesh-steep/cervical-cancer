# Database Setup Instructions

Run these SQL files in your Supabase SQL Editor in the following order:

## Step 1: Create Tables
Run `01_create_tables.sql`
- Creates all database tables (users, patients, symptoms, appointments, etc.)
- Creates indexes for performance
- **Time**: ~30 seconds

## Step 2: Enable Row Level Security
Run `02_enable_rls.sql`
- Enables RLS on all tables
- Creates security policies for data access control
- **Time**: ~20 seconds

## Step 3: Create Triggers
Run `03_create_triggers.sql`
- Creates function to auto-create user profiles on registration
- Sets up trigger on auth.users table
- **Time**: ~10 seconds

## Step 4: Storage Policies (Optional - Run after creating buckets)
First, create storage buckets in Supabase dashboard:
1. Go to Storage → Create bucket
2. Create `medical-documents` bucket (Private)
3. Create `avatars` bucket (Public)

Then run `04_storage_policies.sql`
- Creates security policies for file uploads/downloads
- **Time**: ~10 seconds

## Step 5: Sample Data (Optional)
Run `05_sample_data.sql`
- Adds educational content to the database
- **Time**: ~5 seconds

## How to Run SQL Files

### Option 1: Copy and Paste (Recommended)
1. Open the SQL file in your code editor
2. Copy all the content
3. Go to Supabase Dashboard → SQL Editor
4. Paste the content
5. Click "Run"

### Option 2: Upload File
1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy the content from the SQL file
4. Paste and run

## Verification

After running all scripts, verify the setup:

```sql
-- Check tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Check trigger exists
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## Troubleshooting

### Error: "relation already exists"
- This is normal if you're re-running scripts
- The `IF NOT EXISTS` clauses will skip existing objects

### Error: "policy already exists"
- Drop the existing policy first:
  ```sql
  DROP POLICY "policy_name" ON table_name;
  ```
- Then re-run the script

### Error: "permission denied"
- Make sure you're running the scripts as a superuser
- Check you're in the correct Supabase project

## Next Steps

After database setup:
1. Configure authentication settings (disable email confirmation for testing)
2. Test user registration
3. Run the application: `npm run dev`
