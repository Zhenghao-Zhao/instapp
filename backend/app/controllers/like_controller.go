package controllers

import (
	"log"
	"net/http"

	"github.com/zhenghao-zhao/instapp/app/utils/api"
	"github.com/zhenghao-zhao/instapp/app/utils/auth"
	db "github.com/zhenghao-zhao/instapp/db/sqlc"
)

func (s *Server) LikePostHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		myUserID, err := auth.GetSessionUserId(r)
		if err != nil {
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}

		postUid, err := GetUidFromRoute(r, "postUid")
		if err != nil {
			log.Printf("failed to scan postUid from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}
		params := db.CreatePostLikeParams{
			UserID:  myUserID,
			PostUid: postUid,
		}
		data, err := s.CreatePostLike(r.Context(), params)
		if err != nil {
			log.Printf("failed to like a post:%v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}
		resp := api.ApiResponse{
			Payload: data,
			Code:    http.StatusOK,
		}
		api.JSONResponse(w, resp)
	}
}

func (s *Server) UnlikePostHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		myUserID, err := auth.GetSessionUserId(r)
		if err != nil {
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}

		postUid, err := GetUidFromRoute(r, "postUid")
		if err != nil {
			log.Printf("failed to scan postUid from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}
		params := db.DropPostLikeParams{
			UserID:  myUserID,
			PostUid: postUid,
		}
		err = s.DropPostLike(r.Context(), params)
		if err != nil {
			log.Printf("failed to like a post:%v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}
		api.OKResponse(w)
	}
}
