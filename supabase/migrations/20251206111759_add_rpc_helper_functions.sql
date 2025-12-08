/*
  # Add RPC Helper Functions

  ## Overview
  Add PostgreSQL functions for incrementing and decrementing counters efficiently.

  ## Functions Created

  ### 1. increment_likes_count
  - Increments the likes_count for a post
  - Used when a user likes a post

  ### 2. decrement_likes_count
  - Decrements the likes_count for a post
  - Used when a user unlikes a post

  ### 3. increment_followers_count
  - Increments the followers_count for a user
  - Used when someone follows a user

  ### 4. decrement_followers_count
  - Decrements the followers_count for a user
  - Used when someone unfollows a user

  ### 5. increment_following_count
  - Increments the following_count for a user
  - Used when a user follows someone

  ### 6. decrement_following_count
  - Decrements the following_count for a user
  - Used when a user unfollows someone
*/

CREATE OR REPLACE FUNCTION increment_likes_count(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = likes_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_likes_count(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_followers_count(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET followers_count = followers_count + 1 WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_followers_count(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_following_count(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET following_count = following_count + 1 WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_following_count(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
