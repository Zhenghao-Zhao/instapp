-- name: CreateFollower :exec
INSERT INTO followers (follower_id, followee_id)
    VALUES (@follower_id, @followee_id);

-- name: DropFollow :exec
DELETE FROM followers
WHERE follower_id = @follower_id
    AND followee_id = @followee_id;

-- name: SearchPaginatedFollowers :many
SELECT
    u.user_id,
    u.username,
    u.name,
    u.profile_image,
    f.id AS follow_id
FROM
    user_profile_search u
    INNER JOIN followers f ON u.user_id = f.follower_id
        AND f.followee_id = @followee_id
WHERE
    CASE WHEN @search_query = '' THEN
        TRUE
    ELSE
        search_param @@ to_tsquery(@search_query || ':*')
    END
    AND (@last_follow_id::bigint = 0
        OR f.id < @last_follow_id::bigint)
ORDER BY
    f.id DESC
LIMIT sqlc.arg ('limit');

-- name: SearchPaginatedFollowees :many
SELECT
    u.user_id,
    u.username,
    u.name,
    u.profile_image,
    f.id AS follow_id
FROM
    user_profile_search u
    INNER JOIN followers f ON u.user_id = f.followee_id
        AND f.follower_id = @follower_id
WHERE
    CASE WHEN @search_query = '' THEN
        TRUE
    ELSE
        search_param @@ to_tsquery(@search_query || ':*')
    END
    AND (@last_follow_id::bigint = 0
        OR f.id < @last_follow_id::bigint)
ORDER BY
    f.id DESC
LIMIT sqlc.arg ('limit');

-- name: GetFolloweeIds :many
SELECT
    followee_id
FROM
    followers
WHERE
    followee_id = ANY (@followee_ids::bigint[])
    AND follower_id = @my_user_id;

