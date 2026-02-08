-- Helper functions and views for complex queries
-- Run this in Supabase SQL Editor

-- ============================================================================
-- FUNCTION: Calculate net winnings for a game result
-- ============================================================================
CREATE OR REPLACE FUNCTION calculate_net_winnings(
  p_game_id TEXT,
  p_user_id TEXT,
  p_final_amount DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
DECLARE
  total_buyins DOUBLE PRECISION;
BEGIN
  -- Sum up all buyins for this user in this game
  SELECT COALESCE(SUM(amount), 0)
  INTO total_buyins
  FROM buyins
  WHERE "gameId" = p_game_id AND "userId" = p_user_id;

  -- Return final amount minus total buyins
  RETURN p_final_amount - total_buyins;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION calculate_net_winnings IS 'Calculates net winnings by subtracting total buyins from final amount';

-- ============================================================================
-- VIEW: Leaderboard (respects privacy settings)
-- ============================================================================
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  u.id,
  u."displayName",
  u."username",
  COALESCE(SUM(gr."netWinnings"), 0) as "totalWinnings",
  COUNT(DISTINCT gr."gameId") as "gamesPlayed"
FROM users u
LEFT JOIN game_results gr ON u.id = gr."userId"
WHERE u."showTotalWinnings" = true
GROUP BY u.id, u."displayName", u."username"
ORDER BY "totalWinnings" DESC;

COMMENT ON VIEW leaderboard IS 'Leaderboard showing total winnings for users who have made their winnings public';

-- Grant access to leaderboard view
GRANT SELECT ON leaderboard TO authenticated, anon;

-- ============================================================================
-- FUNCTION: Get user statistics
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id TEXT)
RETURNS TABLE (
  "userId" TEXT,
  "totalWinnings" DOUBLE PRECISION,
  "gamesPlayed" BIGINT,
  "bestGame" DOUBLE PRECISION,
  "worstGame" DOUBLE PRECISION,
  "avgWinnings" DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p_user_id as "userId",
    COALESCE(SUM(gr."netWinnings"), 0) as "totalWinnings",
    COUNT(gr.id) as "gamesPlayed",
    COALESCE(MAX(gr."netWinnings"), 0) as "bestGame",
    COALESCE(MIN(gr."netWinnings"), 0) as "worstGame",
    COALESCE(AVG(gr."netWinnings"), 0) as "avgWinnings"
  FROM game_results gr
  WHERE gr."userId" = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_stats IS 'Returns comprehensive statistics for a specific user';

-- ============================================================================
-- FUNCTION: Get game summary with payment status
-- ============================================================================
CREATE OR REPLACE FUNCTION get_game_summary(p_game_id TEXT)
RETURNS TABLE (
  "gameId" TEXT,
  "totalPot" DOUBLE PRECISION,
  "playerCount" BIGINT,
  "unpaidBuyins" BIGINT,
  "paidBuyins" BIGINT,
  "pendingBuyins" BIGINT,
  "resultsEntered" BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p_game_id as "gameId",
    COALESCE(SUM(b.amount), 0) as "totalPot",
    COUNT(DISTINCT b."userId") as "playerCount",
    COUNT(*) FILTER (WHERE b."paidStatus" = 'UNPAID') as "unpaidBuyins",
    COUNT(*) FILTER (WHERE b."paidStatus" = 'PAID') as "paidBuyins",
    COUNT(*) FILTER (WHERE b."paidStatus" = 'PENDING') as "pendingBuyins",
    (SELECT COUNT(*) FROM game_results WHERE "gameId" = p_game_id) as "resultsEntered"
  FROM buyins b
  WHERE b."gameId" = p_game_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_game_summary IS 'Returns summary statistics for a specific game including payment status';

-- ============================================================================
-- FUNCTION: Get total buyins for a user in a game
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_total_buyins(
  p_game_id TEXT,
  p_user_id TEXT
) RETURNS DOUBLE PRECISION AS $$
DECLARE
  total DOUBLE PRECISION;
BEGIN
  SELECT COALESCE(SUM(amount), 0)
  INTO total
  FROM buyins
  WHERE "gameId" = p_game_id AND "userId" = p_user_id;

  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_total_buyins IS 'Returns total buyins for a specific user in a specific game';

-- ============================================================================
-- FUNCTION: Validate game balance (zero-sum check)
-- ============================================================================
CREATE OR REPLACE FUNCTION validate_game_balance(p_game_id TEXT)
RETURNS TABLE (
  "isBalanced" BOOLEAN,
  "totalBuyins" DOUBLE PRECISION,
  "totalPayouts" DOUBLE PRECISION,
  "difference" DOUBLE PRECISION
) AS $$
DECLARE
  v_total_buyins DOUBLE PRECISION;
  v_total_payouts DOUBLE PRECISION;
  v_difference DOUBLE PRECISION;
BEGIN
  -- Calculate total buyins
  SELECT COALESCE(SUM(amount), 0)
  INTO v_total_buyins
  FROM buyins
  WHERE "gameId" = p_game_id;

  -- Calculate total payouts (final amounts)
  SELECT COALESCE(SUM("finalAmount"), 0)
  INTO v_total_payouts
  FROM game_results
  WHERE "gameId" = p_game_id;

  -- Calculate difference
  v_difference := v_total_payouts - v_total_buyins;

  RETURN QUERY
  SELECT
    ABS(v_difference) < 0.01 as "isBalanced",
    v_total_buyins as "totalBuyins",
    v_total_payouts as "totalPayouts",
    v_difference as "difference";
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION validate_game_balance IS 'Checks if total buyins equal total payouts for a game (zero-sum validation)';

-- ============================================================================
-- Grant permissions to functions
-- ============================================================================
GRANT EXECUTE ON FUNCTION calculate_net_winnings TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_user_stats TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_game_summary TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_user_total_buyins TO authenticated, anon;
GRANT EXECUTE ON FUNCTION validate_game_balance TO authenticated, anon;
