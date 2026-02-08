# Railway PostgreSQL Setup Instructions

## Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended) or email
3. Verify your account

## Step 2: Create a New Project
1. Click "New Project" on Railway dashboard
2. Select "Provision PostgreSQL"
3. Wait for the database to provision (~30 seconds)

## Step 3: Get Database Connection String
1. Click on your PostgreSQL database in the Railway dashboard
2. Go to the "Connect" tab
3. Copy the "Postgres Connection URL"
   - It will look like: `postgresql://postgres:PASSWORD@HOST:PORT/railway`

## Step 4: Update Local .env File
1. Open `.env` in your project root
2. Replace the `DATABASE_URL` with your Railway connection string
3. Make sure to add `?sslmode=require` at the end:
   ```
   DATABASE_URL="postgresql://postgres:PASSWORD@HOST:PORT/railway?sslmode=require"
   ```

## Step 5: Test Connection
Run this command to test your connection:
```bash
npx prisma db pull
```

If successful, you should see: "Introspecting based on datasource..."

## Step 6: Run Migration
Once connection is confirmed, run:
```bash
npx prisma migrate dev --name init
```

This will create all your database tables.

## Troubleshooting

### Connection Error
- Make sure `?sslmode=require` is at the end of your connection string
- Check that your Railway database is running (green status in dashboard)
- Verify you copied the entire connection string including password

### Migration Issues
- Ensure DATABASE_URL in .env is correct
- Try running `npx prisma generate` first
- Check Railway logs for any database errors

## Railway Free Tier Limits
- 500 MB storage
- Shared CPU
- $5 monthly credit (more than enough for this project)
- Database will sleep after 5 minutes of inactivity (auto-wakes on next request)

## Production Notes
- Railway automatically provides SSL certificates
- Connection strings include SSL by default
- No need to manually configure SSL certificates
- Database backups available in paid plans
