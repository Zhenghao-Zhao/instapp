DROP MATERIALIZED VIEW IF EXISTS user_profile_search;
DROP INDEX IF EXISTS idx_user_profile_search;
DROP TRIGGER IF EXISTS user_search_update ON users;
DROP TRIGGER IF EXISTS profile_search_update ON profiles;
DROP FUNCTION IF EXISTS refresh_user_profile_view();