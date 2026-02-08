-- Row Level Security Policies
-- Run this in Supabase SQL Editor AFTER enabling RLS

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Anyone can view all user profiles (privacy handled in app layer)
CREATE POLICY "Anyone can view user profiles"
ON users FOR SELECT
USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = auth_id)
WITH CHECK (auth.uid() = auth_id);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON users FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND "isAdmin" = true
  )
);

-- ============================================================================
-- GAMES TABLE POLICIES
-- ============================================================================

-- Anyone can view games
CREATE POLICY "Anyone can view games"
ON games FOR SELECT
USING (true);

-- Authenticated users can create games
CREATE POLICY "Authenticated users can create games"
ON games FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = "hostId"
  )
);

-- Game host can update their games
CREATE POLICY "Host can update own games"
ON games FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = "hostId"
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = "hostId"
  )
);

-- Game host can delete their games
CREATE POLICY "Host can delete own games"
ON games FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = "hostId"
  )
);

-- ============================================================================
-- BUYINS TABLE POLICIES
-- ============================================================================

-- Anyone can view buyins (public info as per requirements)
CREATE POLICY "Anyone can view buyins"
ON buyins FOR SELECT
USING (true);

-- Game host or the user themselves can add buyins
CREATE POLICY "Host or self can add buyins"
ON buyins FOR INSERT
TO authenticated
WITH CHECK (
  -- User is the game host
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g."hostId" = u.id
    WHERE g.id = "gameId" AND u.auth_id = auth.uid()
  )
  OR
  -- User is adding their own buyin
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = "userId"
  )
);

-- Game host can update buyins (e.g., payment status)
CREATE POLICY "Host can update buyins"
ON buyins FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g."hostId" = u.id
    WHERE g.id = "gameId" AND u.auth_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g."hostId" = u.id
    WHERE g.id = "gameId" AND u.auth_id = auth.uid()
  )
);

-- Game host can delete buyins
CREATE POLICY "Host can delete buyins"
ON buyins FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g."hostId" = u.id
    WHERE g.id = "gameId" AND u.auth_id = auth.uid()
  )
);

-- ============================================================================
-- GAME_RESULTS TABLE POLICIES
-- ============================================================================

-- Anyone can view results (privacy respected in app layer)
CREATE POLICY "Anyone can view results"
ON game_results FOR SELECT
USING (true);

-- Game host or the user themselves can add results
CREATE POLICY "Host or self can add results"
ON game_results FOR INSERT
TO authenticated
WITH CHECK (
  -- User is the game host
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g."hostId" = u.id
    WHERE g.id = "gameId" AND u.auth_id = auth.uid()
  )
  OR
  -- User is adding their own result
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = "userId"
  )
);

-- Game host or the user themselves can update results
CREATE POLICY "Host or self can update results"
ON game_results FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g."hostId" = u.id
    WHERE g.id = "gameId" AND u.auth_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = "userId"
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g."hostId" = u.id
    WHERE g.id = "gameId" AND u.auth_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM users
    WHERE auth_id = auth.uid() AND id = "userId"
  )
);

-- Game host can delete results
CREATE POLICY "Host can delete results"
ON game_results FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM games g
    JOIN users u ON g."hostId" = u.id
    WHERE g.id = "gameId" AND u.auth_id = auth.uid()
  )
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Run this to verify all policies are created:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
