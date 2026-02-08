# Supabase Migrations

Run these SQL scripts in order in the Supabase SQL Editor.

## Order of Execution

1. **Initial schema** (already done ✅)
   - You already ran this: created users, games, buyins, game_results tables

2. **`01_migrate_to_supabase_auth.sql`** ⚠️ RUN THIS NEXT
   - Adds `auth_id` column to link with Supabase Auth
   - Removes `passwordHash` column
   - Creates trigger to auto-create user profiles on signup

3. **`02_enable_rls.sql`**
   - Enables Row Level Security on all tables
   - IMPORTANT: After running this, users won't be able to access data until policies are created

4. **`03_rls_policies.sql`** ⚠️ MUST RUN IMMEDIATELY AFTER #2
   - Creates all RLS policies for authorization
   - Defines who can read/write which data

5. **`04_helper_functions.sql`**
   - Creates helper functions for complex queries
   - Creates leaderboard view
   - Creates utility functions

## How to Run

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste each SQL file's contents
5. Click **Run** (or Cmd/Ctrl + Enter)
6. Check for errors in the output

## Verification

After running all migrations, verify:

### Check tables exist
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

### Check RLS is enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### Check policies exist
```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Check functions exist
```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION';
```

## Important Notes

- **Run migrations in order** - they depend on each other
- **After enabling RLS (step 2), immediately run policies (step 3)** or your app will break
- You can re-run scripts if needed (they use `CREATE OR REPLACE` where applicable)
- Keep these files in version control for reference

## Next Steps After Migrations

1. Enable Email Auth in Supabase:
   - Go to Authentication → Providers
   - Enable Email provider
   - Configure email templates (optional)

2. Create your admin user:
   - Go to Authentication → Users
   - Click "Add User"
   - Enter your email and password
   - After creation, go to SQL Editor and run:
     ```sql
     UPDATE users SET "isAdmin" = true WHERE email = 'your-email@example.com';
     ```

3. Test authentication in your app:
   - Sign up a test user
   - Verify user appears in both `auth.users` and `public.users`
   - Test RLS policies by trying to create/edit data
