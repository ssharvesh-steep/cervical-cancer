# Environment Variables Setup Guide

## Required Environment Variables

To use the seed API and admin functions, you need to set up your `.env.local` file with the following variables:

### 1. Get Your Supabase Service Role Key

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Under **Project API keys**, find the **`service_role`** key (⚠️ **Keep this secret!**)
5. Copy the service role key

### 2. Create/Update `.env.local` File

Create a `.env.local` file in the root directory of your project (same level as `package.json`):

```env
# Supabase Public Keys (Safe to expose in client-side code)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (⚠️ KEEP SECRET - Server-side only!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Example `.env.local` File

```env
# Replace these with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Important Security Notes

⚠️ **NEVER commit `.env.local` to git!**

- The `.env.local` file should already be in `.gitignore`
- The `SUPABASE_SERVICE_ROLE_KEY` has admin privileges - keep it secret!
- Only use the service role key in server-side code (API routes, server components)
- The anon key is safe for client-side use

### 5. Restart Your Development Server

After adding/updating environment variables:

```bash
# Stop the server (Ctrl+C)
# Then restart it
npm run dev
```

### 6. Verify the Setup

Once you've added the `SUPABASE_SERVICE_ROLE_KEY`, you can test the seed endpoint:

```bash
# Visit in browser or use curl
curl http://localhost:3000/api/seed
```

You should see a JSON response with the number of records created.

## Troubleshooting

### Error: "Admin client could not be initialized"

- ✅ Check that `.env.local` exists in the project root
- ✅ Verify `SUPABASE_SERVICE_ROLE_KEY` is set (no quotes needed)
- ✅ Make sure you copied the **service_role** key, not the anon key
- ✅ Restart your development server after adding the variable

### Error: "Missing Supabase environment variables"

- ✅ Check that both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- ✅ Verify there are no typos in variable names
- ✅ Make sure there are no spaces around the `=` sign

## Getting Your Supabase Credentials

If you don't have your Supabase credentials:

1. **Project URL**: Found in Settings → API → Project URL
2. **Anon Key**: Found in Settings → API → Project API keys → `anon` `public`
3. **Service Role Key**: Found in Settings → API → Project API keys → `service_role` `secret`

---

**Note**: The service role key bypasses Row Level Security (RLS) policies, so it should only be used in secure server-side contexts like API routes.
