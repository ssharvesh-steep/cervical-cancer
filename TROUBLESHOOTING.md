# Fixing "User Already Exists" Error

## Problem
You're getting a "User already exists" error when trying to create your first account with email `ssharvesh316@gmail.com`.

## Possible Causes

1. **Email already registered in Supabase Auth**
2. **Database trigger issue**
3. **Old Appwrite data conflict**

## Solutions

### Solution 1: Check Supabase Dashboard

1. Go to your Supabase Dashboard: https://moglmxolvmbcmdktrerl.supabase.co
2. Navigate to **Authentication** → **Users**
3. Check if `ssharvesh316@gmail.com` is already listed
4. If it exists, delete it and try registering again

### Solution 2: Check Database

Run this SQL in Supabase SQL Editor to check if the email exists:

```sql
-- Check if user exists in auth
SELECT email, created_at 
FROM auth.users 
WHERE email = 'ssharvesh316@gmail.com';

-- Check if user exists in public.users table
SELECT email, full_name, role, created_at 
FROM public.users 
WHERE email = 'ssharvesh316@gmail.com';
```

If the user exists, delete it:

```sql
-- Delete from public.users first (due to foreign key constraints)
DELETE FROM public.users WHERE email = 'ssharvesh316@gmail.com';

-- Delete from auth.users
DELETE FROM auth.users WHERE email = 'ssharvesh316@gmail.com';
```

### Solution 3: Use a Different Email

Try registering with a completely new email address that you haven't used before:
- Example: `test.patient@example.com`
- Or use a Gmail plus address: `ssharvesh316+test@gmail.com`

### Solution 4: Verify Database Setup

Make sure you've run these SQL scripts in order:

1. ✅ `01_create_tables.sql` - Creates tables
2. ✅ `02_enable_rls.sql` - Sets up security
3. ✅ `03_create_triggers.sql` - Auto-creates user profiles

Check if the trigger exists:

```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name = 'on_auth_user_created';
```

### Solution 5: Disable Email Confirmation (for testing)

In Supabase Dashboard:
1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. **Disable** "Enable email confirmations"
4. Click **Save**

This allows immediate login after registration without email verification.

## Quick Fix Steps

1. **Delete existing user** (if any) from Supabase Dashboard
2. **Disable email confirmation** in Supabase settings
3. **Try registering again** with the same or different email
4. If still failing, check browser console for detailed error messages

## Getting More Details

To see the exact error, open browser Developer Tools:
1. Press `F12` or right-click → Inspect
2. Go to **Console** tab
3. Try registering again
4. Look for red error messages
5. Share the error message for more specific help
