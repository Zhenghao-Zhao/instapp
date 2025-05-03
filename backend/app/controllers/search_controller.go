package controllers

import (
	"log"
	"net/http"
	"strconv"

	"github.com/zhenghao-zhao/instapp/app/api"
	db "github.com/zhenghao-zhao/instapp/db/sqlc"
)

const UserSearchLimit = 10

func (s *Server) SearchHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cursor := GetQueryParam(r, "cursor")
		query := GetQueryParam(r, "query")

		params := db.SearchPaginatedUsersParams{
			SearchQuery:  &query,
			LastUsername: cursor,
			Limit:        UserSearchLimit,
		}

		userRows, err := s.SearchPaginatedUsers(r.Context(), params)
		if err != nil {
			log.Printf("failed to search users in db: %v", err.Error())
			api.JSONResponse(w, GenDBResponse(err))
			return
		}

		listLength := min(FollowerPageLimit, len(userRows))
		users := make([]UserProfileDTO, listLength)

		for i := range listLength {
			row := userRows[i]
			users[i] = UserProfileDTO{
				Username:        row.Username,
				UserId:          strconv.FormatInt(row.UserID, 10),
				Name:            *row.Name,
				ProfileImageUrl: s.GetImageUrl(row.ProfileImage.String()),
			}
		}

		var nextCursor *string
		if len(userRows) == FollowerPageLimit+1 {
			nextCursor = &userRows[listLength-1].Username
		}
		api.JSONResponse(w, api.ApiResponse{
			Data: NewPageDTO[UserProfileDTO]{
				Data:       users,
				NextCursor: nextCursor,
			},
			Code: http.StatusOK,
		})
	}
}
