-- Function to automatically update reply count on posts
-- This ensures reply_count stays accurate regardless of who replies

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_post_reply_count_on_insert ON replies;
DROP TRIGGER IF EXISTS update_post_reply_count_on_delete ON replies;
DROP FUNCTION IF EXISTS update_post_reply_count();

-- Create function to update reply count
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    -- Increment reply count and update last reply info
    UPDATE posts 
    SET 
      reply_count = reply_count + 1,
      last_reply_at = NEW.created_at,
      last_reply_user_id = NEW.user_id
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    -- Decrement reply count
    UPDATE posts 
    SET reply_count = GREATEST(0, reply_count - 1)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER update_post_reply_count_on_insert
  AFTER INSERT ON replies
  FOR EACH ROW
  EXECUTE FUNCTION update_post_reply_count();

CREATE TRIGGER update_post_reply_count_on_delete
  AFTER DELETE ON replies
  FOR EACH ROW
  EXECUTE FUNCTION update_post_reply_count();
