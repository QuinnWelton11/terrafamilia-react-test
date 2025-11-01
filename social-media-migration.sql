-- Add social media fields to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_url TEXT,
ADD COLUMN IF NOT EXISTS tiktok_url TEXT,
ADD COLUMN IF NOT EXISTS substack_url TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT;

-- Add comment to document the columns
COMMENT ON COLUMN profiles.twitter_url IS 'User Twitter/X profile URL (optional)';
COMMENT ON COLUMN profiles.facebook_url IS 'User Facebook profile URL (optional)';
COMMENT ON COLUMN profiles.instagram_url IS 'User Instagram profile URL (optional)';
COMMENT ON COLUMN profiles.linkedin_url IS 'User LinkedIn profile URL (optional)';
COMMENT ON COLUMN profiles.youtube_url IS 'User YouTube channel URL (optional)';
COMMENT ON COLUMN profiles.tiktok_url IS 'User TikTok profile URL (optional)';
COMMENT ON COLUMN profiles.substack_url IS 'User Substack newsletter URL (optional)';
COMMENT ON COLUMN profiles.website_url IS 'User personal website URL (optional)';
