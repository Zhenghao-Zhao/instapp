-- name: CreateCommentLike :one
INSERT INTO comment_likes (user_id, comment_id)
    VALUES (@user_id, @comment_id)
RETURNING
    *;

-- name: DropCommentLike :exec
DELETE FROM comment_likes cl
WHERE comment_id = @comment_id
    AND cl.user_id = @user_id;

-- name: CreatePostLike :one
INSERT INTO post_likes (user_id, post_id)
    VALUES (@user_id, @post_id)
RETURNING
    *;

-- name: DropPostLike :exec
DELETE FROM post_likes pl
WHERE post_id = @post_id
    AND pl.user_id = @user_id;


