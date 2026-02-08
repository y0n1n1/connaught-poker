# Supabase PostgreSQL Setup Instructions

## Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your account

## Step 2: Create a New Project
1. Click "New Project" on the Supabase dashboard
2. Fill in the project details:
   - **Name**: `connaught-poker` (or any name you prefer)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Free tier (perfect for this project)
3. Click "Create new project"
4. Wait 2-3 minutes for the project to initialize

## Step 3: Get Database Connection String
1. In your project dashboard, go to **Project Settings** (gear icon in sidebar)
2. Navigate to **Database** in the left menu
3. Scroll down to the "Connection string" section
4. Select **URI** tab (not the Pooler)
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the database password you set in Step 2

## Step 4: Update Local .env File
1. Open `.env` in your project root
2. Replace the `DATABASE_URL` with your Supabase connection string:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.xxx.supabase.co:5432/postgres"
   ```

## Step 5: Run Migration
Once the connection string is updated, run:
```bash
npx prisma migrate dev --name init
```

This will create all your database tables in Supabase.

## Step 6: Verify in Supabase Dashboard
1. Go back to your Supabase project
2. Click on "Table Editor" in the sidebar
3. You should see your tables: `users`, `games`, `buyins`, `game_results`

## Supabase Features We Get

### Free Tier Benefits
- 500 MB database storage
- Unlimited API requests
- 50,000 monthly active users
- Daily backups (7 days retention)
- No credit card required

### Additional Features (Available but Optional)
- **Auth**: Built-in authentication (we're building our own, but could migrate later)
- **Realtime**: WebSocket connections for live updates
- **Storage**: File uploads (for game photos later)
- **Row Level Security (RLS)**: Database-level security policies

### Database Management
- **Table Editor**: Visual interface to view/edit data
- **SQL Editor**: Run custom queries
- **API Auto-generation**: REST and GraphQL APIs (we're building our own REST API)

## Troubleshooting

### Connection Error
- Verify your password is correct (no extra spaces)
- Make sure you're using the URI connection string (not the Pooler)
- Check that your Supabase project is active (green status)

### Migration Issues
- Ensure DATABASE_URL in .env is correct
- Try running `npx prisma generate` first
- Check Supabase logs in the dashboard under "Logs" section

### Can't Find Connection String
- Go to Project Settings → Database
- Scroll to "Connection string" section
- Make sure you're on the "URI" tab

## Production Deployment

When deploying to Vercel:
1. Go to Vercel project settings → Environment Variables
2. Add `DATABASE_URL` with your Supabase connection string
3. Supabase provides SSL by default (no need for `?sslmode=require`)
4. Connection pooling is available via the "Pooler" connection string if needed

## Security Notes
- Never commit `.env` file to git (it's in .gitignore)
- Use environment variables in Vercel for production
- Consider using Supabase's connection pooler for production (Session mode)
- Enable Row Level Security (RLS) in Supabase for additional security layer (optional)

## Useful Supabase Dashboard Links
- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom SQL queries
- **Logs**: View database logs and errors
- **API Docs**: Auto-generated API documentation
- **Settings → Database**: Connection strings and settings
