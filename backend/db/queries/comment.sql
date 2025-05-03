-- name: CreateComment :one
INSERT INTO comments (content, user_id, post_id)
    VALUES (@content, @user_id, @post_id)
RETURNING
    *;

-- name: DeleteComment :exec
DELETE FROM comments
WHERE id = @comment_id;

-- name: GetPaginatedCommentsByPostID :many
SELECT
    c.created_at AS created_at,
    c.id AS comment_id,
    c.content AS content,
    COALESCE(t.like_count, 0) AS likes_count,
    (l.id IS NOT NULL)::bool AS has_liked,
    u.username AS owner_username,
    u.id AS owner_id,
    pr.name AS owner_name,
    pr.profile_image AS owner_profile_image
FROM
    comments c
    LEFT JOIN posts po ON po.id = c.post_id
    LEFT JOIN (
        SELECT
            comment_id,
            COUNT(*) AS like_count
        FROM
            comment_likes
        GROUP BY
            comment_id) t ON c.id = t.comment_id
    LEFT JOIN comment_likes l ON l.comment_id = c.id
        AND l.user_id = @my_user_id
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN profiles pr ON u.id = pr.user_id
WHERE
    po.id = @post_id
ORDER BY
    c.created_at DESC OFFSET sqlc.arg ('offset')
LIMIT sqlc.arg ('limit');

