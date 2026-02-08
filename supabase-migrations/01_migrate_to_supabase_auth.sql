-- Migration: Switch from custom password auth to Supabase Auth
-- Run this in Supabase SQL Editor after initial table creation

-- Step 1: Add auth_id column to link to Supabase Auth
ALTER TABLE users ADD COLUMN "auth_id" UUID REFERENCES auth.users(id);

-- Step 2: Create unique index on auth_id
CREATE UNIQUE INDEX users_auth_id_key ON users("auth_id");

-- Step 3: Remove passwordHash column (we'll use Supabase Auth instead)
ALTER TABLE users DROP COLUMN "passwordHash";

-- Step 4: Add email column for easier user lookup
ALTER TABLE users ADD COLUMN "email" TEXT;
CREATE UNIQUE INDEX users_email_key ON users("email");

-- Step 5: Create function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, auth_id, username, email, "displayName", "updatedAt")
  VALUES (
    gen_random_uuid()::TEXT,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 6: Create trigger to call function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Add comment for documentation
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a user profile in public.users when a new auth user signs up';
