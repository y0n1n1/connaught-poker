-- Enable Row Level Security (RLS) on all tables
-- Run this in Supabase SQL Editor

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyins ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

-- Note: After enabling RLS, you MUST create policies or users won't be able to access data
-- Run 03_rls_policies.sql next
