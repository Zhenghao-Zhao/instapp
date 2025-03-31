-- name: CreatePost :one
INSERT INTO posts (content, user_id)
    VALUES (@content, @user_id)
RETURNING
    *;

-- name: DeletePostByPostUid :exec
DELETE FROM posts p
WHERE p.uid = @post_uid;

-- name: GetPaginatedPostsByUserUid :many
WITH images AS (
    SELECT
        p.id AS post_id,
        json_agg(i.uid) AS image_uids
    FROM
        posts p
        LEFT JOIN public.post_images i ON p.id = i.post_id
    GROUP BY
        p.id
)
SELECT
    p.id AS post_id,
    p.uid AS post_uid,
    p.user_id AS owner_id,
    p.created_at AS created_at,
    p.content AS content,
    COALESCE(t1.like_count, 0) AS like_count,
    COALESCE(t2.comment_count, 0) AS comment_count,
    (l.id IS NOT NULL)::bool AS has_liked,
    i.image_uids AS image_uids,
    u.uid AS owner_uid,
    u.username AS owner_username,
    profiles.name AS owner_name,
    profiles.profile_image AS owner_profile_image,
    (f.id IS NOT NULL)::bool AS owner_is_following
FROM
    posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN profiles ON u.id = profiles.user_id
    LEFT JOIN (
        SELECT
            post_id,
            COUNT(*) AS like_count
        FROM
            post_likes
        GROUP BY
            post_id) t1 ON p.id = t1.post_id
    LEFT JOIN (
        SELECT
            post_id,
            COUNT(*) AS comment_count
        FROM
            comments
        GROUP BY
            post_id) t2 ON p.id = t2.post_id
    LEFT JOIN post_likes l ON l.post_id = p.id
        AND l.user_id = @my_user_id
    LEFT JOIN images i ON i.post_id = p.id
    LEFT JOIN followers f ON f.followee_id = p.user_id
        AND f.follower_id = @my_user_id
WHERE
    u.uid = @user_uid
ORDER BY
    p.created_at DESC OFFSET sqlc.arg ('offset')
LIMIT sqlc.arg ('limit');

-- name: GetPaginatedPostsByUsername :many
WITH images AS (
    SELECT
        p.id AS post_id,
        json_agg(i.uid) AS image_uids
    FROM
        posts p
        LEFT JOIN public.post_images i ON p.id = i.post_id
    GROUP BY
        p.id
)
SELECT
    p.id AS post_id,
    p.uid AS post_uid,
    p.user_id AS owner_id,
    p.created_at AS created_at,
    p.content AS content,
    COALESCE(t1.like_count, 0) AS like_count,
    COALESCE(t2.comment_count, 0) AS comment_count,
    (l.id IS NOT NULL)::bool AS has_liked,
    i.image_uids AS image_uids,
    u.uid AS owner_uid,
    u.username AS owner_username,
    profiles.name AS owner_name,
    profiles.profile_image AS owner_profile_image,
    (f.id IS NOT NULL)::bool AS owner_is_following
FROM
    posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN profiles ON u.id = profiles.user_id
    LEFT JOIN (
        SELECT
            post_id,
            COUNT(*) AS like_count
        FROM
            post_likes
        GROUP BY
            post_id) t1 ON p.id = t1.post_id
    LEFT JOIN (
        SELECT
            post_id,
            COUNT(*) AS comment_count
        FROM
            comments
        GROUP BY
            post_id) t2 ON p.id = t2.post_id
    LEFT JOIN post_likes l ON l.post_id = p.id
        AND l.user_id = @my_user_id
    LEFT JOIN images i ON i.post_id = p.id
    LEFT JOIN followers f ON f.followee_id = p.user_id
        AND f.follower_id = @my_user_id
WHERE
    u.username = @my_username
ORDER BY
    p.created_at DESC OFFSET sqlc.arg ('offset')
LIMIT sqlc.arg ('limit');

-- name: GetPostByPostUID :one
WITH images AS (
    SELECT
        p.id AS post_id,
        json_agg(i.uid) AS image_uids
    FROM
        posts p
        LEFT JOIN public.post_images i ON p.id = i.post_id
    GROUP BY
        p.id
)
SELECT
    p.id AS post_id,
    p.uid AS post_uid,
    p.user_id AS owner_id,
    p.created_at AS created_at,
    p.content AS content,
    COALESCE(t1.like_count, 0) AS like_count,
    COALESCE(t2.comment_count, 0) AS comment_count,
    (l.id IS NOT NULL)::bool AS has_liked,
    i.image_uids AS image_uids,
    u.uid AS owner_uid,
    u.username AS owner_username,
    profiles.name AS owner_name,
    profiles.profile_image AS owner_profile_image,
    (f.id IS NOT NULL)::bool AS owner_is_following
FROM
    posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN profiles ON u.id = profiles.user_id
    LEFT JOIN (
        SELECT
            post_id,
            COUNT(*) AS like_count
        FROM
            post_likes
        GROUP BY
            post_id) t1 ON p.id = t1.post_id
    LEFT JOIN (
        SELECT
            post_id,
            COUNT(*) AS comment_count
        FROM
            comments
        GROUP BY
            post_id) t2 ON p.id = t2.post_id
    LEFT JOIN post_likes l ON l.post_id = p.id
    LEFT JOIN images i ON i.post_id = p.id
        AND l.user_id = @my_user_id
    LEFT JOIN followers f ON f.followee_id = p.user_id
        AND f.follower_id = @my_user_id
WHERE
    p.uid = @post_uid;

