package api

import (
	"log"
	"net/http"
	"strconv"

	cu "github.com/zhenghao-zhao/instapp/app/utils/controllerUtil"
	db "github.com/zhenghao-zhao/instapp/db/sqlc"
)

const UserSearchLimit = 10

func (s *Server) SearchHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cursor := cu.GetQueryParam(r, "cursor")
		query := cu.GetQueryParam(r, "query")

		params := db.SearchPaginatedUsersParams{
			SearchQuery:  &query,
			LastUsername: cursor,
			Limit:        UserSearchLimit,
		}

		userRows, err := s.SearchPaginatedUsers(r.Context(), params)
		if err != nil {
			log.Printf("failed to search users in db: %v", err.Error())
			JSONResponse(w, GenDBResponse(err))
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
		JSONResponse(w, ApiResponse{
			Data: NewPageDTO[UserProfileDTO]{
				Data:       users,
				NextCursor: nextCursor,
			},
			Code: http.StatusOK,
		})
	}
}
