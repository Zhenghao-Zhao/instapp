package api

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/zhenghao-zhao/instapp/app/auth"
	cu "github.com/zhenghao-zhao/instapp/app/utils/controllerUtil"
	db "github.com/zhenghao-zhao/instapp/db/sqlc"
)

const FollowerPageLimit = 20

func (s *Server) AddFollowHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		followeeId, err := cu.GetIdFromRoute(r, "userId")
		if err != nil {
			log.Printf("failed to scan postUID from route: %v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}
		myUserId, err := auth.GetSessionUserId(r)
		if err != nil {
			JSONResponse(w, AuthErrorResp)
			return
		}

		params := db.CreateFollowerParams{
			FollowerID: myUserId,
			FolloweeID: followeeId,
		}

		err = s.CreateFollower(r.Context(), params)
		if err != nil {
			log.Printf("failed to add follow :%v", err.Error())
			JSONResponse(w, GenDBResponse(err))
			return
		}

		JSONResponse(w, ApiResponse{
			Code: http.StatusCreated,
		})
	}
}

func (s *Server) RemoveFollowHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		followeeId, err := cu.GetIdFromRoute(r, "userId")
		if err != nil {
			log.Printf("failed to scan postUID from route: %v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}

		if myUserId, err := auth.GetSessionUserId(r); err == nil {
			params := db.DropFollowParams{
				FollowerID: myUserId,
				FolloweeID: followeeId,
			}

			err := s.DropFollow(r.Context(), params)
			if err != nil {
				log.Printf("failed to remove follow :%v", err.Error())
				JSONResponse(w, GenericErrorResp)
				return
			}

			OKResponse(w)
			return
		}

		JSONResponse(w, AuthErrorResp)
	}
}

func (s *Server) SearchFollowerHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cursor, err := cu.GetCursorParam(r)
		if err != nil {
			log.Printf("failed to parse curosr value: %v", err.Error())
			JSONResponse(w, InvalidQueryParamsResp)
			return
		}
		userId, err := cu.GetIdFromRoute(r, "userId")
		if err != nil {
			JSONResponse(w, InvalidRouteResp)
			return
		}
		query := cu.GetQueryParam(r, "query")
		params := db.SearchPaginatedFollowersParams{
			FolloweeID:   userId,
			SearchQuery:  &query,
			LastFollowID: cursor,
			Limit:        FollowerPageLimit + 1,
		}
		userRows, err := s.SearchPaginatedFollowers(r.Context(), params)
		if err != nil {
			log.Printf("failed to search paginated followers: %v", err.Error())
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
			followId := strconv.FormatInt(userRows[listLength-1].FollowID, 10)
			nextCursor = &followId
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

func (s *Server) SearchFolloweeHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cursor, err := cu.GetCursorParam(r)
		if err != nil {
			log.Printf("failed to parse curosr value: %v", err.Error())
			JSONResponse(w, InvalidQueryParamsResp)
			return
		}
		userId, err := cu.GetIdFromRoute(r, "userId")
		if err != nil {
			JSONResponse(w, InvalidRouteResp)
			return
		}
		query := cu.GetQueryParam(r, "query")
		params := db.SearchPaginatedFolloweesParams{
			FollowerID:   userId,
			SearchQuery:  &query,
			LastFollowID: cursor,
			Limit:        FollowerPageLimit,
		}
		userRows, err := s.SearchPaginatedFollowees(r.Context(), params)
		if err != nil {
			log.Printf("failed to search paginated followees: %v", err.Error())
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
			followId := strconv.FormatInt(userRows[listLength-1].FollowID, 10)
			nextCursor = &followId
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

type IdListPayload struct {
	UserIds []string `json:"userIds"`
}

func (s *Server) GetFriendshipsHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload IdListPayload
		err := json.NewDecoder(r.Body).Decode(&payload)
		if err != nil {
			log.Printf("failed to parse payload: %v", err.Error())
			JSONResponse(w, InvalidRequestPayloadResp)
			return
		}

		result := make(map[int64]RelationDTO)

		if len(payload.UserIds) == 0 {
			JSONResponse(w, ApiResponse{
				Data: result,
				Code: http.StatusOK,
			})
			return
		}

		ids, err := cu.ConvertIds(payload.UserIds)
		if err != nil {
			log.Printf("failed to convert string id to int64")
			JSONResponse(w, GenericErrorResp)
			return
		}

		myUserId, err := auth.GetSessionUserId(r)
		if err != nil {
			log.Printf("failed to obtain user id: %v", err.Error())
			JSONResponse(w, AuthErrorResp)
			return
		}
		params := db.GetFolloweeIdsParams{
			FolloweeIds: ids,
			MyUserID:    myUserId,
		}

		followeeIds, err := s.GetFolloweeIds(r.Context(), params)
		if err != nil {
			log.Printf("failed to get followee ids: %v", err.Error())
			JSONResponse(w, GenDBResponse(err))
			return
		}

		for _, id := range ids {
			result[id] = RelationDTO{
				IsFollowing: false,
			}
		}

		for _, id := range followeeIds {
			dto := result[id]
			dto.IsFollowing = true
			result[id] = dto
		}

		JSONResponse(w, ApiResponse{
			Data: result,
			Code: http.StatusOK,
		})
	}
}
