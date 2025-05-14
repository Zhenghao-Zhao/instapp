package api

import (
	"log"
	"net/http"

	"github.com/zhenghao-zhao/instapp/app/auth"
	cu "github.com/zhenghao-zhao/instapp/app/utils/controllerUtil"
	db "github.com/zhenghao-zhao/instapp/db/sqlc"
)

func (s *Server) LikePostHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		myUserID, err := auth.GetSessionUserId(r)
		if err != nil {
			JSONResponse(w, AuthErrorResp)
			return
		}

		postId, err := cu.GetIdFromRoute(r, "postId")
		if err != nil {
			log.Printf("failed to scan postUid from route: %v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}
		params := db.CreatePostLikeParams{
			UserID: myUserID,
			PostID: postId,
		}
		data, err := s.CreatePostLike(r.Context(), params)
		if err != nil {
			log.Printf("failed to like a post:%v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}
		resp := ApiResponse{
			Data: data,
			Code: http.StatusOK,
		}
		JSONResponse(w, resp)
	}
}

func (s *Server) UnlikePostHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		myUserID, err := auth.GetSessionUserId(r)
		if err != nil {
			JSONResponse(w, AuthErrorResp)
			return
		}

		postId, err := cu.GetIdFromRoute(r, "postId")
		if err != nil {
			log.Printf("failed to scan postUid from route: %v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}
		params := db.DropPostLikeParams{
			UserID: myUserID,
			PostID: postId,
		}
		err = s.DropPostLike(r.Context(), params)
		if err != nil {
			log.Printf("failed to like a post:%v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}
		OKResponse(w)
	}
}
