-- name: CreatePost :one
INSERT INTO posts (content, user_id)
    VALUES (@content, @user_id)
RETURNING
    *;

-- name: DeletePostByPostID :exec
DELETE FROM posts p
WHERE p.id = @post_id;

-- name: GetPaginatedPostsByUsername :many
WITH post_stats AS (
    SELECT
        p.id AS post_id,
        COUNT(DISTINCT pl.id) AS like_count,
        COUNT(DISTINCT c.id) AS comment_count,
        COALESCE(BOOL_OR(pl.user_id = @my_user_id), FALSE)::boolean AS has_liked,
        json_agg(DISTINCT pi.uid) FILTER (WHERE pi.uid IS NOT NULL) AS image_uids
    FROM
        posts p
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        LEFT JOIN post_images pi ON p.id = pi.post_id
    WHERE
        p.user_id = (
            SELECT
                id
            FROM
                users u
            WHERE
                u.username = @username)
            AND (@last_post_id::bigint = 0
                OR p.id < @last_post_id::bigint)
        GROUP BY
            p.id
)
SELECT
    p.id AS post_id,
    p.user_id AS owner_id,
    p.created_at AS created_at,
    p.content AS content,
    ps.like_count,
    ps.comment_count,
    ps.has_liked,
    ps.image_uids,
    u.username AS owner_username,
    pr.name AS owner_name,
    pr.profile_image AS owner_profile_image,
    EXISTS (
        SELECT
            1
        FROM
            followers
        WHERE
            followee_id = p.user_id
            AND follower_id = @my_user_id) AS owner_is_following
FROM
    posts p
    JOIN users u ON p.user_id = u.id
    JOIN profiles pr ON u.id = pr.user_id
    JOIN post_stats ps ON p.id = ps.post_id
ORDER BY
    p.id DESC
LIMIT sqlc.arg ('limit');

-- name: GetPostByPostID :one
WITH post_stats AS (
    SELECT
        p.id AS post_id,
        COUNT(DISTINCT pl.id) AS like_count,
        COUNT(DISTINCT c.id) AS comment_count,
        COALESCE(BOOL_OR(pl.user_id = @my_user_id), FALSE)::boolean AS has_liked,
        json_agg(DISTINCT pi.uid) FILTER (WHERE pi.uid IS NOT NULL) AS image_uids
    FROM
        posts p
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        LEFT JOIN post_images pi ON p.id = pi.post_id
    WHERE
        p.id = @post_id
    GROUP BY
        p.id
)
SELECT
    p.id AS post_id,
    p.user_id AS owner_id,
    p.created_at AS created_at,
    p.content AS content,
    ps.like_count,
    ps.comment_count,
    ps.has_liked,
    ps.image_uids,
    u.username AS owner_username,
    pr.name AS owner_name,
    pr.profile_image AS owner_profile_image,
    EXISTS (
        SELECT
            1
        FROM
            followers
        WHERE
            followee_id = p.user_id
            AND follower_id = @my_user_id) AS owner_is_following
FROM
    posts p
    JOIN users u ON p.user_id = u.id
    JOIN profiles pr ON u.id = pr.user_id
    JOIN post_stats ps ON p.id = ps.post_id;

-- name: GetFeedPosts :many
WITH post_stats AS (
    SELECT
        p.id AS post_id,
        COUNT(DISTINCT pl.id) AS like_count,
        COUNT(DISTINCT c.id) AS comment_count,
        COALESCE(BOOL_OR(pl.user_id = @my_user_id), FALSE)::boolean AS has_liked,
        json_agg(DISTINCT pi.uid) FILTER (WHERE pi.uid IS NOT NULL) AS image_uids
    FROM
        posts p
        RIGHT JOIN followers f ON p.user_id = f.followee_id
            AND f.follower_id = @my_user_id
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        LEFT JOIN comments c ON p.id = c.post_id
        LEFT JOIN post_images pi ON p.id = pi.post_id
    WHERE (@last_post_id::bigint = 0
        OR p.id < @last_post_id::bigint)
GROUP BY
    p.id
)
SELECT
    p.id AS post_id,
    p.user_id AS owner_id,
    p.created_at AS created_at,
    p.content AS content,
    ps.like_count,
    ps.comment_count,
    ps.has_liked,
    ps.image_uids,
    u.username AS owner_username,
    pr.name AS owner_name,
    pr.profile_image AS owner_profile_image
FROM
    posts p
    JOIN users u ON p.user_id = u.id
    JOIN profiles pr ON u.id = pr.user_id
    JOIN post_stats ps ON p.id = ps.post_id
ORDER BY
    p.id DESC
LIMIT sqlc.arg ('limit');

