# Supabase Architecture

## Overview
We're using **Supabase as a complete backend solution**, leveraging their auto-generated APIs instead of building custom Next.js API routes.

## Tech Stack Changes

### What We're Using
- **Database**: Supabase PostgreSQL
- **API**: Supabase auto-generated REST API
- **Auth**: Supabase Auth (with custom password hash migration)
- **Client**: `@supabase/supabase-js` library
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
- **Authorization**: Row Level Security (RLS) policies in Supabase

### What We're NOT Building
- ❌ Custom JWT authentication
- ❌ Custom REST API endpoints (for most operations)
- ❌ Custom bcrypt password hashing
- ❌ Manual database connection management

## Architecture Flow

```
User Browser
    ↓
Next.js Frontend (React Components)
    ↓
Supabase Client (@supabase/supabase-js)
    ↓
Supabase API (Auto-generated REST)
    ↓
PostgreSQL Database (with RLS policies)
```

## Authentication Approach

Since we have `passwordHash` in our schema (for custom auth), we have two options:

### Option A: Migrate to Supabase Auth (Recommended)
1. Remove `passwordHash` column from users table
2. Use Supabase Auth's built-in user management
3. Store additional user data (displayName, privacy settings) in `users` table
4. Link Supabase auth users to our `users` table via `auth.uid()`

**Benefits:**
- Built-in password reset via email
- Secure password hashing handled by Supabase
- Admin can reset passwords via Supabase dashboard
- Sessions managed automatically

### Option B: Keep Custom Password System
1. Keep `passwordHash` column
2. Create custom authentication functions (Postgres functions or Edge Functions)
3. Manually manage sessions with Supabase storage

**We'll go with Option A** - it's simpler and more secure.

## Database Schema Adjustments

### Users Table (Revised)
```sql
-- Remove passwordHash, add auth_id to link to Supabase Auth
ALTER TABLE users DROP COLUMN "passwordHash";
ALTER TABLE users ADD COLUMN "auth_id" UUID REFERENCES auth.users(id);
CREATE UNIQUE INDEX users_auth_id_key ON users(auth_id);
```

### Auth Flow
1. User signs up via Supabase Auth → creates entry in `auth.users`
2. Trigger/function creates corresponding row in `users` table with `auth_id`
3. User data stored in `users` table (displayName, privacy settings, etc.)
4. Authentication credentials stored in Supabase Auth (email, password)

## Row Level Security (RLS) Policies

RLS policies enforce authorization rules at the database level.

### Users Table Policies
```sql
-- Users can read all profiles (respecting privacy in app layer)
CREATE POLICY "Users can view all profiles"
ON users FOR SELECT
USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = auth_id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND "isAdmin" = true
  )
);
```

### Games Table Policies
```sql
-- Anyone can view games
CREATE POLICY "Anyone can view games"
ON games FOR SELECT
USING (true);

-- Authenticated users can create games
CREATE POLICY "Authenticated users can create games"
ON games FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Game host can update their games
CREATE POLICY "Host can update own games"
ON games FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = hostId
  )
);
```

### Buyins Table Policies
```sql
-- Anyone can view buyins (public info)
CREATE POLICY "Anyone can view buyins"
ON buyins FOR SELECT
USING (true);

-- Game host or self can insert buyins
CREATE POLICY "Host or self can add buyins"
ON buyins FOR INSERT
WITH CHECK (
  -- Check if user is the game host
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g.hostId = u.id
    WHERE g.id = gameId AND u.auth_id = auth.uid()
  )
  OR
  -- Or user is adding their own buyin
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = userId
  )
);

-- Host can update payment status
CREATE POLICY "Host can update buyin payment status"
ON buyins FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g.hostId = u.id
    WHERE g.id = gameId AND u.auth_id = auth.uid()
  )
);
```

### Game Results Table Policies
```sql
-- Anyone can view results (respecting privacy in app)
CREATE POLICY "Anyone can view results"
ON game_results FOR SELECT
USING (true);

-- Host or self can insert results
CREATE POLICY "Host or self can add results"
ON game_results FOR INSERT
WITH CHECK (
  -- Check if user is the game host
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g.hostId = u.id
    WHERE g.id = gameId AND u.auth_id = auth.uid()
  )
  OR
  -- Or user is adding their own result
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = userId
  )
);

-- Host or self can update results
CREATE POLICY "Host or self can update results"
ON game_results FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g.hostId = u.id
    WHERE g.id = gameId AND u.auth_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = userId
  )
);
```

## Client-Side Usage Examples

### Authentication
```typescript
import { supabase } from '@/lib/supabase-browser'

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      display_name: 'John Doe',
    }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

### Database Queries
```typescript
import { supabase } from '@/lib/supabase-browser'

// Get all games
const { data: games, error } = await supabase
  .from('games')
  .select('*, host:users(displayName)')
  .order('gameDate', { ascending: false })

// Create a game
const { data, error } = await supabase
  .from('games')
  .insert({
    id: generateId(),
    gameDate: new Date().toISOString(),
    hostId: currentUser.id,
    status: 'UPCOMING',
  })

// Add a buyin
const { data, error } = await supabase
  .from('buyins')
  .insert({
    id: generateId(),
    gameId: 'game-id',
    userId: 'user-id',
    amount: 50,
    enteredBy: currentUser.id,
  })

// Update privacy settings
const { data, error } = await supabase
  .from('users')
  .update({ showTotalWinnings: false })
  .eq('auth_id', user.id)
```

## Custom Logic Requirements

Some business logic can't be handled by simple CRUD:

### 1. Calculate Net Winnings
When inserting a game result, we need to calculate `netWinnings` based on total buyins.

**Solution**: Use Postgres function or Edge Function
```sql
CREATE OR REPLACE FUNCTION calculate_net_winnings(
  p_game_id TEXT,
  p_user_id TEXT,
  p_final_amount FLOAT
) RETURNS FLOAT AS $$
DECLARE
  total_buyins FLOAT;
BEGIN
  SELECT COALESCE(SUM(amount), 0)
  INTO total_buyins
  FROM buyins
  WHERE "gameId" = p_game_id AND "userId" = p_user_id;

  RETURN p_final_amount - total_buyins;
END;
$$ LANGUAGE plpgsql;
```

### 2. Leaderboard Query
Complex aggregation for leaderboard.

**Solution**: Create a Postgres view or function
```sql
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  u.id,
  u."displayName",
  COALESCE(SUM(gr."netWinnings"), 0) as "totalWinnings",
  COUNT(DISTINCT gr."gameId") as "gamesPlayed"
FROM users u
LEFT JOIN game_results gr ON u.id = gr."userId"
WHERE u."showTotalWinnings" = true
GROUP BY u.id, u."displayName"
ORDER BY "totalWinnings" DESC;
```

## Edge Functions (Optional)

For complex business logic that can't be handled by Postgres functions:

```typescript
// supabase/functions/calculate-result/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { gameId, userId, finalAmount } = await req.json()

  // Complex calculation logic here
  const netWinnings = await calculateNetWinnings(gameId, userId, finalAmount)

  return new Response(
    JSON.stringify({ netWinnings }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

## Admin Password Reset

**Via Supabase Dashboard:**
1. Go to Authentication → Users
2. Find the user
3. Click "..." → Send Password Recovery Email
4. Or set a new password directly

**Via Code (for you as admin):**
```typescript
// Only works with service role key (keep secret!)
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Keep this secret!
)

// Reset password
await supabaseAdmin.auth.admin.updateUserById(userId, {
  password: 'new-password'
})
```

## Deployment

### Environment Variables (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://auaztdnvgeaesqzixxqu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_service_role_... (for admin functions only)
```

### Database Setup
1. Tables already created via SQL migration ✅
2. Apply RLS policies (SQL scripts)
3. Set up auth triggers for user creation
4. Create views/functions for complex queries

## Next Steps

1. Apply schema changes (remove passwordHash, add auth_id)
2. Enable RLS on all tables
3. Apply RLS policies
4. Set up auth triggers
5. Create helper functions for complex queries
6. Build frontend with Supabase client
