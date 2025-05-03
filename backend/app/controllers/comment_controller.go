package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/zhenghao-zhao/instapp/app/api"
	"github.com/zhenghao-zhao/instapp/app/auth"
	db "github.com/zhenghao-zhao/instapp/db/sqlc"
)

const CommentPageLimit = 10

func (s *Server) GetCommentsHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Getting post comments")
		postId, err := GetIdFromRoute(r, "postId")
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

		params := db.GetPaginatedCommentsByPostIDParams{
			MyUserID: myUserId,
			PostID:   postId,
			Offset:   int32(pageNum * CommentPageLimit),
			Limit:    CommentPageLimit,
		}

		data, err := s.GetPaginatedCommentsByPostID(r.Context(), params)
		if err != nil {
			log.Printf("failed to get paginated comments:%v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		comments := make([]CommentDTO, len(data))

		for i, row := range data {

			owner := UserProfileDTO{
				UserId:          strconv.FormatInt(*row.OwnerID, 10),
				Username:        *row.OwnerUsername,
				Name:            *row.OwnerName,
				ProfileImageUrl: s.GetImageUrl(row.OwnerProfileImage.String()),
			}
			comments[i] = CommentDTO{
				CreatedAt: ConvertTime(row.CreatedAt),
				CommentId: strconv.FormatInt(row.CommentID, 10),
				Content:   row.Content,
				LikeCount: row.LikesCount,
				HasLiked:  row.HasLiked,
				Owner:     owner,
			}
		}

		var nextCursor *int
		if len(comments) == CommentPageLimit {
			nextPage := pageNum + 1
			nextCursor = &nextPage
		}
		resp := api.ApiResponse{
			Data: PageDTO[CommentDTO]{
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
		commentId, err := GetIdFromRoute(r, "commentId")
		if err != nil {
			log.Printf("failed to scan postUID from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		if myUserID, err := auth.GetSessionUserId(r); err == nil {
			params := db.CreateCommentLikeParams{
				UserID:    myUserID,
				CommentID: commentId,
			}

			data, err := s.CreateCommentLike(r.Context(), params)
			if err != nil {
				log.Printf("failed to get like comments:%v", err.Error())
				api.JSONResponse(w, api.GenericErrorResp)
				return
			}

			resp := api.ApiResponse{
				Data: data,
				Code: http.StatusOK,
			}

			api.JSONResponse(w, resp)
			return
		}

		api.JSONResponse(w, api.AuthErrorResp)
	}
}

func (s *Server) UnlikeCommentHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		commentId, err := GetIdFromRoute(r, "commentId")
		if err != nil {
			log.Printf("failed to scan commentUid from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		if myUserID, err := auth.GetSessionUserId(r); err == nil {
			params := db.DropCommentLikeParams{
				UserID:    myUserID,
				CommentID: commentId,
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
	Content string `json:"content"`
}

func (s *Server) CreateCommentHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var commentParams CommentParams
		err := json.NewDecoder(r.Body).Decode(&commentParams)
		if err != nil {
			log.Printf("failed to parse comment params from route: %v", err.Error())
			api.JSONResponse(w, api.InvalidRequestPayloadResp)
			return
		}
		userId, err := auth.GetSessionUserId(r)
		if err != nil {
			log.Printf("failed to convert uuid string to uuid: %v", err.Error())
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}
		postId, err := GetIdFromRoute(r, "postId")
		if err != nil {
			log.Printf("failed to parse post id from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
		}
		params := db.CreateCommentParams{
			Content: commentParams.Content,
			UserID:  userId,
			PostID:  postId,
		}
		comment, err := s.CreateComment(r.Context(), params)
		if err != nil {
			log.Printf("failed to create comment in db: %v", err.Error())
			api.JSONResponse(w, GenDBResponse(err))
			return
		}
		userInfo, err := auth.GetUserSessionInfo(r)
		if err != nil {
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}
		owner := UserProfileDTO{
			Username:        userInfo.Username,
			UserId:          strconv.FormatInt(userInfo.UserId, 10),
			Name:            userInfo.Name,
			ProfileImageUrl: userInfo.ProfileImageUrl,
		}
		commentDto := CommentDTO{
			CreatedAt: ConvertTime(comment.CreatedAt),
			CommentId: strconv.FormatInt(comment.ID, 10),
			Content:   comment.Content,
			LikeCount: 0,
			HasLiked:  false,
			Owner:     owner,
		}

		resp := api.ApiResponse{
			Data: commentDto,
			Code: http.StatusOK,
		}
		api.JSONResponse(w, resp)
	}
}
