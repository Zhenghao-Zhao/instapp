-- name: CreateCommentLike :one
INSERT INTO comment_likes (user_id, comment_id)
VALUES (@user_id, (SELECT id FROM comments c WHERE c.uid = @comment_uid))
RETURNING *;


-- name: DropCommentLike :exec
DELETE
FROM comment_likes cl
WHERE comment_id in (SELECT id FROM comments c WHERE c.uid = @comment_uid)
  and cl.user_id = @user_id;


-- name: CreatePostLike :one
INSERT INTO post_likes (user_id, post_id)
VALUES (@user_id, (SELECT id FROM posts p WHERE p.uid = @post_uid))
RETURNING *;


-- name: DropPostLike :exec
DELETE
FROM post_likes pl
WHERE post_id in (SELECT id From posts p WHERE p.uid = @post_uid)
  AND pl.user_id = @user_id;