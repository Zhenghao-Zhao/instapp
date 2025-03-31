-- name: CreateFollower :one
INSERT INTO followers (follower_id, followee_id)
    VALUES ((
            SELECT
                id
            FROM
                users u
            WHERE
                u.uid = @follower_uid), (
                SELECT
                    id
                FROM
                    users u
                WHERE
                    u.uid = @followee_uid))
    RETURNING
        *;

-- name: DropFollow :exec
DELETE FROM followers
WHERE follower_id = (
        SELECT
            id
        FROM
            users u
        WHERE
            u.uid = @follower_uid)
    AND followee_id = (
        SELECT
            id
        FROM
            users u
        WHERE
            u.uid = @followee_uid);

-- name: GetPaginatedFollowersByUserUID :many
SELECT
    follower_id
FROM
    followers
WHERE
    followee_id IN (
        SELECT
            id
        FROM
            users u
        WHERE
            u.uid = @user_uid) OFFSET sqlc.arg ('offset')
LIMIT sqlc.arg ('limit');

-- name: GetPaginatedFolloweesByUserUID :many
SELECT
    followee_id
FROM
    followers
WHERE
    follower_id IN (
        SELECT
            id
        FROM
            users u
        WHERE
            u.uid = @user_uid) OFFSET sqlc.arg ('offset')
LIMIT sqlc.arg ('limit');

-- name: SearchPaginatedFollowers :many
SELECT
    u.user_uid,
    u.username,
    u.name,
    u.profile_image
FROM
    user_profile_search u
    RIGHT JOIN followers f ON u.user_id = f.follower_id
        AND f.followee_id = @followee_id
WHERE
    search_param @@ to_tsquery(@search_query || ':*') OFFSET sqlc.arg ('offset')
LIMIT sqlc.arg ('limit');

-- name: SearchPaginatedFollowees :many
SELECT
    u.user_uid,
    u.username,
    u.name,
    u.profile_image
FROM
    user_profile_search u
    RIGHT JOIN followers f ON u.user_id = f.followee_id
        AND f.follower_id = @follower_id
WHERE
    search_param @@ to_tsquery(@search_query || ':*') OFFSET sqlc.arg ('offset')
LIMIT sqlc.arg ('limit');


