-- name: CreateUser :one
INSERT INTO users (username, email, PASSWORD)
    VALUES (@username, @email, @password)
RETURNING
    *;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = @id;

-- name: CheckUserExistsByEmail :one
SELECT
    EXISTS (
        SELECT
            1
        FROM
            users
        WHERE
            email = @email) AS exists;

-- name: GetUserByEmail :one
SELECT
    u.username,
    u.id,
    p.name,
    u.uid,
    p.profile_image,
    u.email,
    u.password
FROM
    users u
    LEFT JOIN profiles p ON u.id = p.user_id
WHERE
    email = @email;

-- name: SearchPaginatedUsers :many
SELECT
    user_uid,
    username,
    name,
    profile_image
FROM
    user_profile_search
WHERE
    search_param @@ to_tsquery(@search_query || ':*') OFFSET sqlc.arg ('offset')
LIMIT sqlc.arg ('limit');

-- name: GetAuthProfile :one
SELECT
    u.username,
    p.name,
    u.uid,
    p.profile_image AS profile_image
FROM
    users u
    LEFT JOIN profiles p ON u.id = p.user_id
WHERE
    u.id = @my_user_id;


