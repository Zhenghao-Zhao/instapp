package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/zhenghao-zhao/instapp/app/utils/api"
	"github.com/zhenghao-zhao/instapp/app/utils/auth"
	db "github.com/zhenghao-zhao/instapp/db/sqlc"
)

func (s *Server) GetCommentsHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Getting post comments")
		postUid, err := GetUidFromRoute(r, "postUid")
		if err != nil {
			log.Printf("failed to scan postUID from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		pageNum, err := strconv.Atoi(GetQueryParam(r, "page"))
		if err != nil {
			log.Printf("failed to parse query param page:%v", err.Error())
			api.JSONResponse(w, api.InvalidQueryParamsResp)
			return
		}

		myUserId, err := auth.GetSessionUserId(r)
		if err != nil {
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		params := db.GetPaginatedCommentsByPostUIDParams{
			MyUserID: myUserId,
			PostUid:  postUid,
			Offset:   int32(pageNum * CommentPageLimit),
			Limit:    CommentPageLimit,
		}

		data, err := s.GetPaginatedCommentsByPostUID(r.Context(), params)
		if err != nil {
			log.Printf("failed to get paginated comments:%v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		comments := make([]CommentDTO, len(data))

		for i, row := range data {

			owner := AuthProfileDTO{
				UserUid:         row.OwnerUid.String(),
				Username:        *row.OwnerUsername,
				Name:            *row.OwnerName,
				ProfileImageUrl: s.GetImageUrl(row.OwnerProfileImage.String()),
			}
			comments[i] = CommentDTO{
				CreatedAt:  ConvertTime(row.CreatedAt),
				CommentUid: row.CommentUid.String(),
				Content:    row.Content,
				LikeCount:  row.LikesCount,
				HasLiked:   row.HasLiked,
				Owner:      owner,
			}
		}

		var nextCursor *int
		if len(comments) == CommentPageLimit {
			nextPage := pageNum + 1
			nextCursor = &nextPage
		}
		resp := api.ApiResponse{
			Payload: PageDTO[CommentDTO]{
				Data:       comments,
				NextCursor: nextCursor,
			},
			Code: http.StatusOK,
		}
		api.JSONResponse(w, resp)
	}
}

func (s *Server) LikeCommentHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		commentUid, err := GetUidFromRoute(r, "commentUid")
		if err != nil {
			log.Printf("failed to scan postUID from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		if myUserID, err := auth.GetSessionUserId(r); err == nil {
			params := db.CreateCommentLikeParams{
				UserID:     myUserID,
				CommentUid: commentUid,
			}

			data, err := s.CreateCommentLike(r.Context(), params)
			if err != nil {
				log.Printf("failed to get like comments:%v", err.Error())
				api.JSONResponse(w, api.GenericErrorResp)
				return
			}

			resp := api.ApiResponse{
				Payload: data,
				Code:    http.StatusOK,
			}

			api.JSONResponse(w, resp)
			return
		}

		api.JSONResponse(w, api.AuthErrorResp)
	}
}

func (s *Server) UnlikeCommentHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		commentUid, err := GetUidFromRoute(r, "commentUid")
		if err != nil {
			log.Printf("failed to scan commentUid from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		if myUserID, err := auth.GetSessionUserId(r); err == nil {
			params := db.DropCommentLikeParams{
				UserID:     myUserID,
				CommentUid: commentUid,
			}

			err := s.DropCommentLike(r.Context(), params)
			if err != nil {
				log.Printf("failed to get like comments:%v", err.Error())
				api.JSONResponse(w, api.GenericErrorResp)
				return
			}

			api.OKResponse(w)
			return
		}

		api.JSONResponse(w, api.AuthErrorResp)
	}
}

type CommentParams struct {
	PostUid string `json:"postUid"`
	Content string `json:"content"`
}

func (s *Server) CreateCommentHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var commentParams CommentParams
		err := json.NewDecoder(r.Body).Decode(&commentParams)
		if err != nil {
			log.Printf("failed to parse comment params from route: %v", err.Error())
			api.JSONResponse(w, api.IncompleteRequestPayloadResp)
			return
		}
		postUid, err := ParseUidString(commentParams.PostUid)
		if err != nil {
			log.Printf("failed to convert uuid string to uuid: %v", err.Error())
			api.JSONResponse(w, api.IncompleteRequestPayloadResp)
			return
		}
		userId, err := auth.GetSessionUserId(r)
		if err != nil {
			log.Printf("failed to convert uuid string to uuid: %v", err.Error())
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}
		params := db.CreateCommentParams{
			Content: commentParams.Content,
			UserID:  userId,
			PostUid: postUid,
		}
		comment, err := s.CreateComment(r.Context(), params)
		if err != nil {
			log.Printf("failed to create comment in db: %v", err.Error())
			api.JSONResponse(w, handleDBError(err))
			return
		}
		userInfo, err := auth.GetUserSessionInfo(r)
		if err != nil {
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}
		owner := AuthProfileDTO{
			Username:        userInfo.Username,
			UserUid:         userInfo.UserUid.String(),
			Name:            userInfo.Name,
			ProfileImageUrl: userInfo.ProfileImageUrl,
		}
		commentDto := CommentDTO{
			CreatedAt:  ConvertTime(comment.CreatedAt),
			CommentUid: comment.Uid.String(),
			Content:    comment.Content,
			LikeCount:  0,
			HasLiked:   false,
			Owner:      owner,
		}

		resp := api.ApiResponse{
			Payload: commentDto,
			Code:    http.StatusOK,
		}
		api.JSONResponse(w, resp)
	}
}
