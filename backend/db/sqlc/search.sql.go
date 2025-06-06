// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.28.0
// source: search.sql

package sqlc

import (
	"context"

	"github.com/google/uuid"
)

const userSearch = `-- name: UserSearch :many
SELECT
    u.user_id,
    u.username,
    u.name,
    u.profile_image
FROM
    user_profile_search u
WHERE
    CASE WHEN $1 = '' THEN
        TRUE
    ELSE
        search_param @@ to_tsquery($1 || ':*')
    END OFFSET $2
LIMIT $3
`

type UserSearchParams struct {
	SearchQuery interface{} `json:"search_query"`
	Offset      int32       `json:"offset"`
	Limit       int32       `json:"limit"`
}

type UserSearchRow struct {
	UserID       int64     `json:"user_id"`
	Username     string    `json:"username"`
	Name         *string   `json:"name"`
	ProfileImage uuid.UUID `json:"profile_image"`
}

func (q *Queries) UserSearch(ctx context.Context, arg UserSearchParams) ([]*UserSearchRow, error) {
	rows, err := q.db.Query(ctx, userSearch, arg.SearchQuery, arg.Offset, arg.Limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []*UserSearchRow
	for rows.Next() {
		var i UserSearchRow
		if err := rows.Scan(
			&i.UserID,
			&i.Username,
			&i.Name,
			&i.ProfileImage,
		); err != nil {
			return nil, err
		}
		items = append(items, &i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
