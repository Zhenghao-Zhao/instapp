-- name: CreateUser :one
INSERT INTO users (username, email, PASSWORD)
    VALUES (@username, @email, @password)
RETURNING
    *;

-- name: DeleteUser :exec
DELETE FROM users
WHERE id = @id;

-- name: CheckUserExistsByUsername :one
SELECT
    EXISTS (
        SELECT
            1
        FROM
            users
        WHERE
            username = @username) AS exists;

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
    u.user_id,
    u.username,
    u.name,
    u.profile_image
FROM
    user_profile_search u
WHERE
    CASE WHEN @search_query = '' THEN
        TRUE
    ELSE
        search_param @@ to_tsquery(@search_query || ':*')
    END
    AND (@last_username::text = '0'
        OR u.username > @last_username::text)
ORDER BY
    u.username
LIMIT sqlc.arg ('limit');

-- name: GetAuthProfile :one
SELECT
    u.username,
    p.name,
    u.id AS user_id,
    p.profile_image AS profile_image
FROM
    users u
    LEFT JOIN profiles p ON u.id = p.user_id
WHERE
    u.id = @my_user_id;

