-- name: CreateProfile :one
INSERT INTO profiles (name, user_id)
    VALUES (@name, @user_id)
RETURNING
    *;

-- name: GetProfileByUsernameOrID :one
SELECT
    u.id AS user_id,
    u.username AS username,
    p.name AS name,
    p.profile_image AS profile_image,
    (
        SELECT
            count(*)
        FROM
            followers
        WHERE
            followee_id = p.user_id) AS follower_count,
    (
        SELECT
            count(*)
        FROM
            followers
        WHERE
            follower_id = p.user_id) AS followee_count,
    (
        SELECT
            count(*)
        FROM
            posts
        WHERE
            posts.user_id = p.user_id) AS post_count,
    (f.follower_id IS NOT NULL)::bool AS is_following
FROM
    profiles p
    LEFT JOIN followers f ON f.followee_id = p.user_id
        AND f.follower_id = @my_user_id
    LEFT JOIN users u ON p.user_id = u.id
WHERE
    u.id = @target_user_id
    OR u.username = @target_username;

-- name: UploadProfileImage :one
UPDATE
    profiles
SET
    profile_image = @image_uid
WHERE
    user_id = @my_user_id
RETURNING
    profile_image;

