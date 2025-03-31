-- name: CreateProfile :one
INSERT INTO profiles (name, user_id)
    VALUES (@name, @user_id)
RETURNING
    *;

-- name: GetProfileByUsernameOrID :one
SELECT
    u.uid AS user_uid,
    u.username AS username,
    p.name AS name,
    p.profile_image AS profile_image,
    COALESCE(t1.follower_count, 0) AS follower_count,
    COALESCE(t2.followee_count, 0) AS followee_count,
    COALESCE(t3.post_count, 0) AS post_count,
    (f.id IS NOT NULL)::bool AS is_following
FROM
    profiles p
    LEFT JOIN (
        SELECT
            followee_id,
            count(*) AS follower_count
        FROM
            followers
        GROUP BY
            followee_id) t1 ON p.id = t1.followee_id
    LEFT JOIN (
        SELECT
            follower_id,
            count(*) AS followee_count
        FROM
            followers
        GROUP BY
            follower_id) t2 ON p.id = t2.follower_id
    LEFT JOIN (
        SELECT
            user_id,
            count(*) AS post_count
        FROM
            posts
        GROUP BY
            user_id) t3 ON p.user_id = t3.user_id
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

