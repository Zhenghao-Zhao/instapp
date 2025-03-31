CREATE MATERIALIZED VIEW user_profile_search AS
SELECT u.id AS user_id, u.uid AS user_uid, u.username AS username, p.name AS name, p.profile_image AS profile_image, (username || ' ' || name) AS search_param
FROM users u
         LEFT JOIN profiles p ON u.id = p.user_id;
CREATE INDEX idx_user_profile_search ON user_profile_search USING GIN (to_tsvector('english', search_param));

CREATE OR REPLACE FUNCTION refresh_user_profile_view()
    RETURNS TRIGGER AS
$$
BEGIN
    REFRESH MATERIALIZED VIEW user_profile_search;
    RETURN NULL;
END;
$$
    LANGUAGE PLPGSQL;

CREATE TRIGGER user_search_update
    AFTER INSERT OR UPDATE OR DELETE
    ON users
    FOR EACH STATEMENT
EXECUTE FUNCTION refresh_user_profile_view();

CREATE TRIGGER profile_search_update
    AFTER INSERT OR UPDATE OR DELETE
    ON profiles
    FOR EACH STATEMENT
EXECUTE FUNCTION refresh_user_profile_view();