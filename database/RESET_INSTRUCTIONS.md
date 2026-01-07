# Database Reset Instructions

## ⚠️ WARNING
This will **DELETE ALL DATA** from your database. Only use this if you want to start completely fresh.

## How to Reset the Database

### Step 1: Reset Database Tables
Run `00_reset_database.sql` in your Supabase SQL Editor to delete all data from tables.

### Step 2: Delete Auth Users (Optional)
In Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Select all users
3. Click **Delete users**

Or run this SQL:
```sql
DELETE FROM auth.users;
```

### Step 3: Re-populate Sample Data (Optional)
If you want to add educational content back, run:
```sql
-- From 05_sample_data.sql
INSERT INTO educational_content (title, content, category, author) VALUES
('Understanding Cervical Cancer', 'Cervical cancer is a type of cancer that occurs in the cells of the cervix...', 'General', 'Medical Team'),
-- ... rest of the content
```

## What Gets Deleted

- ✅ All user profiles
- ✅ All patient records
- ✅ All messages (no unwanted messages will remain)
- ✅ All appointments
- ✅ All symptoms logs
- ✅ All medications
- ✅ All notifications
- ✅ All educational content
- ✅ All audit logs

## What Stays

- ✅ Database tables and structure
- ✅ RLS policies
- ✅ Triggers
- ✅ Indexes

## After Reset

1. The database will be completely empty
2. You can register new users
3. Messages will only come from the database (as they always have)
4. No unwanted data will exist

## Current Message System

The `MessageCenter` component already works correctly:
- ✅ Only reads messages from the database
- ✅ Only writes messages to the database
- ✅ Uses real-time subscriptions for live updates
- ✅ No hardcoded or unwanted messages

There are no unwanted messages being created in the code - all messages come from user interactions and are stored in the database.
