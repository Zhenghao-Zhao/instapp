package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/zhenghao-zhao/instapp/app/utils/api"
	"github.com/zhenghao-zhao/instapp/app/utils/auth"
	db "github.com/zhenghao-zhao/instapp/db/sqlc"
	"golang.org/x/sync/errgroup"
)

func (s *Server) CreatePostHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		myUserID, err := auth.GetSessionUserId(r)
		if err != nil {
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}

		err = r.ParseMultipartForm(10 << 20)
		if err != nil {
			log.Printf("Unable to parse multipart form: %v", err.Error())
			api.JSONResponse(w, api.FileSizeExceeded)
			return
		}

		files := r.MultipartForm.File["files"]
		content := r.FormValue("content")

		uploadedCloudFiles := make([]uuid.UUID, 0, len(files))

		g, ctx := errgroup.WithContext(r.Context())

		params := db.CreatePostParams{
			Content: &content,
			UserID:  myUserID,
		}
		post, err := s.CreatePost(r.Context(), params)
		if err != nil {
			log.Printf("failed to create post: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		for _, file := range files {
			g.Go(func() error {
				// upload images to cloud
				f, err := file.Open()
				if err != nil {
					log.Printf("failed to open image file: %v", err.Error())
					return err
				}
				defer f.Close()
				uid, err := uuid.NewRandom()
				if err != nil {
					log.Printf("failed to generate uuid for images: %v", err.Error())
					return err
				}
				req, err := s.NewBucketRequest("PUT", uid.String(), f)
				if err != nil {
					log.Printf("failed to create new bucket request: %v", err.Error())
					return err
				}
				req = req.WithContext(ctx)
				resp, err := s.client.Do(req)
				if resp != nil {
					resp.Body.Close()
				}
				if err != nil {
					log.Printf("failed to make cloud upload request: %v", err.Error())
					return err
				}
				uploadedCloudFiles = append(uploadedCloudFiles, uid)
				return nil
			})
		}

		err = g.Wait()
		if err != nil {
			// -- TODO: clean up extra images in the cloud
			log.Printf("request to upload image to cloud failed: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		imageParams := make([]db.CreateImagesParams, len(uploadedCloudFiles))

		for i, filename := range uploadedCloudFiles {
			fmt.Println("image param post id:", post.ID)
			imageParams[i] = db.CreateImagesParams{
				Uid:    filename,
				PostID: post.ID,
			}
		}

		_, err = s.CreateImages(r.Context(), imageParams)
		if err != nil {
			log.Printf("failed to insert images into db: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		api.OKResponse(w)
	}
}

func (s *Server) GetPaginatedPostsHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		myUserID, err := auth.GetSessionUserId(r)
		if err != nil {
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}
		username, err := GetRouteSegment(r, "username")
		if err != nil {
			log.Printf("failed to parse username: %v", err.Error())
			api.JSONResponse(w, api.InvalidUrlResp)
			return
		}
		pageNum, err := strconv.Atoi(GetQueryParam(r, "page"))
		if err != nil {
			log.Printf("failed to parse query param page: %v", err.Error())
			api.JSONResponse(w, api.InvalidQueryParamsResp)
			return
		}

		offset := int32(pageNum * PostPageLimit)
		getPostsParams := db.GetPaginatedPostsByUsernameParams{
			MyUserID:   myUserID,
			MyUsername: username,
			Offset:     offset,
			Limit:      PostPageLimit,
		}

		postRows, err := s.GetPaginatedPostsByUsername(r.Context(), getPostsParams)
		if err != nil {
			log.Printf("failed to get posts:%v", err.Error())
			api.JSONResponse(w, handleDBError(err))
			return
		}

		posts := make([]PostDTO, len(postRows))

		var imageUids []uuid.UUID

		for i, row := range postRows {
			err := json.Unmarshal(row.ImageUids, &imageUids)
			if err != nil {
				log.Printf("failed to unmarshal images: %v", err.Error())
				api.JSONResponse(w, api.GenericErrorResp)
				return
			}
			owner := OwnerProfileDTO{
				UserUid:         row.OwnerUid.String(),
				Username:        *row.OwnerUsername,
				Name:            *row.OwnerName,
				ProfileImageUrl: s.GetImageUrl(row.OwnerProfileImage.String()),
				IsFollowing:     row.OwnerIsFollowing,
			}
			posts[i] = PostDTO{
				CreatedAt:    ConvertTime(row.CreatedAt),
				PostUid:      row.PostUid.String(),
				Content:      *row.Content,
				ImageUrls:    s.GetPostImageUrls(imageUids),
				LikeCount:    row.LikeCount,
				CommentCount: row.CommentCount,
				HasLiked:     row.HasLiked,
				Owner:        owner,
				IsOwner:      row.OwnerID == myUserID,
			}
		}
		var nextCursor *int

		if len(posts) == PostPageLimit {
			nextPage := pageNum + 1
			nextCursor = &nextPage
		}

		data := PageDTO[PostDTO]{
			Data:       posts,
			NextCursor: nextCursor,
		}

		resp := api.ApiResponse{
			Payload: data,
			Code:    http.StatusOK,
		}
		api.JSONResponse(w, resp)
	}
}

func (s *Server) GetPostHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		myUserId, err := auth.GetSessionUserId(r)
		if err != nil {
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}

		vars := mux.Vars(r)
		val := vars["postUid"]

		var postUid uuid.UUID

		err = postUid.Scan(val)
		if err != nil {
			log.Printf("failed to scan post uid from route:%v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		postParams := db.GetPostByPostUIDParams{
			MyUserID: myUserId,
			PostUid:  postUid,
		}

		postRow, err := s.GetPostByPostUID(r.Context(), postParams)
		if err != nil {
			log.Printf("failed to get posts:%v", err.Error())
			api.JSONResponse(w, handleDBError(err))
			return
		}

		var imageUids []uuid.UUID
		err = json.Unmarshal(postRow.ImageUids, &imageUids)
		if err != nil {
			log.Printf("failed to unmashal image uids:%v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}
		post := PostDTO{
			CreatedAt:    ConvertTime(postRow.CreatedAt),
			Content:      *postRow.Content,
			ImageUrls:    s.GetPostImageUrls(imageUids),
			LikeCount:    postRow.LikeCount,
			CommentCount: postRow.CommentCount,
			HasLiked:     postRow.HasLiked,
			IsOwner:      postRow.OwnerID == myUserId,
		}

		post.Owner = OwnerProfileDTO{
			UserUid:         postRow.OwnerUid.String(),
			Username:        *postRow.OwnerUsername,
			Name:            *postRow.OwnerName,
			ProfileImageUrl: s.GetImageUrl(postRow.OwnerProfileImage.String()),
			IsFollowing:     postRow.OwnerIsFollowing,
		}
		resp := api.ApiResponse{
			Payload: post,
			Code:    http.StatusOK,
		}
		api.JSONResponse(w, resp)
	}
}

func (s *Server) DeletePostHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		postUid, err := GetUidFromRoute(r, "postUid")
		if err != nil {
			log.Printf("failed to scan postUid from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		err = s.DeletePostByPostUid(r.Context(), postUid)
		if err != nil {
			log.Printf("failed to delete post from db: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		api.OKResponse(w)
	}
}
