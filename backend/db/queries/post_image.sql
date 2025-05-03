-- name: CreateImages :copyfrom
INSERT INTO post_images (uid, post_id)
    VALUES (@uid, @post_id);

-- name: GetImagesByPostIds :many
SELECT
    i.uid AS image_uid,
    i.post_id AS post_id
FROM
    post_images i
WHERE
    i.post_id = ANY (@post_ids::bigint[]);

