package controllers

import (
	"log"
	"net/http"

	"github.com/zhenghao-zhao/instapp/app/utils/api"
	"github.com/zhenghao-zhao/instapp/app/utils/auth"
	db "github.com/zhenghao-zhao/instapp/db/sqlc"
)

func (s *Server) AddFollowHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		followeeUID, err := GetUidFromRoute(r, "userUID")
		if err != nil {
			log.Printf("failed to scan postUID from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		if myUserUID, err := auth.GetSessionUserUid(r); err == nil {
			params := db.CreateFollowerParams{
				FollowerUid: myUserUID,
				FolloweeUid: followeeUID,
			}

			data, err := s.CreateFollower(r.Context(), params)
			if err != nil {
				log.Printf("failed to add follow :%v", err.Error())
				api.JSONResponse(w, api.GenericErrorResp)
				return
			}

			resp := api.ApiResponse{
				Payload: data,
				Code:    http.StatusCreated,
			}

			api.JSONResponse(w, resp)
			return
		}

		api.JSONResponse(w, api.AuthErrorResp)
	}
}

func (s *Server) RemoveFollowHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		followeeUid, err := GetUidFromRoute(r, "userUID")
		if err != nil {
			log.Printf("failed to scan postUID from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		if myUserUid, err := auth.GetSessionUserUid(r); err == nil {
			params := db.DropFollowParams{
				FollowerUid: myUserUid,
				FolloweeUid: followeeUid,
			}

			err := s.DropFollow(r.Context(), params)
			if err != nil {
				log.Printf("failed to remove follow :%v", err.Error())
				api.JSONResponse(w, api.GenericErrorResp)
				return
			}

			api.OKResponse(w)
			return
		}

		api.JSONResponse(w, api.AuthErrorResp)
	}
}

func (s *Server) SearchFollowerHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		myUserId, err := auth.GetSessionUserId(r)
		if err != nil {
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}
		query := GetQueryParam(r, "query")
		pageNum, err := GetPageNumParam(r)
		if err != nil {
			api.JSONResponse(w, api.InvalidQueryParamsResp)
			return
		}
		params := db.SearchPaginatedFollowersParams{
			FolloweeID:  myUserId,
			SearchQuery: &query,
			Offset:      int32(pageNum * FollowerPageLimit),
			Limit:       FollowerPageLimit,
		}
		result, err := s.SearchPaginatedFollowers(r.Context(), params)
		if err != nil {
			log.Printf("failed to search paginated followers: %v", err.Error())
			api.JSONResponse(w, handleDBError(err))
			return
		}

		var resp []AuthProfileDTO

		for _, row := range result {
			resp = append(resp, AuthProfileDTO{
				Username:        *row.Username,
				UserUid:         row.UserUid.String(),
				Name:            *row.Name,
				ProfileImageUrl: s.GetImageUrl(row.ProfileImage.String()),
			})
		}

		api.JSONResponse(w, api.ApiResponse{
			Payload: resp,
			Code:    http.StatusOK,
		})
	}
}

func (s *Server) SearchFolloweeHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		myUserId, err := auth.GetSessionUserId(r)
		if err != nil {
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}
		query := GetQueryParam(r, "query")
		pageNum, err := GetPageNumParam(r)
		if err != nil {
			api.JSONResponse(w, api.InvalidQueryParamsResp)
			return
		}
		params := db.SearchPaginatedFolloweesParams{
			FollowerID:  myUserId,
			SearchQuery: &query,
			Offset:      int32(pageNum * FollowerPageLimit),
			Limit:       FollowerPageLimit,
		}
		result, err := s.SearchPaginatedFollowees(r.Context(), params)
		if err != nil {
			log.Printf("failed to search paginated followers: %v", err.Error())
			api.JSONResponse(w, handleDBError(err))
			return
		}

		var resp []AuthProfileDTO

		for _, row := range result {
			resp = append(resp, AuthProfileDTO{
				Username:        *row.Username,
				UserUid:         row.UserUid.String(),
				Name:            *row.Name,
				ProfileImageUrl: s.GetImageUrl(row.ProfileImage.String()),
			})
		}

		api.JSONResponse(w, api.ApiResponse{
			Payload: resp,
			Code:    http.StatusOK,
		})
	}
}
