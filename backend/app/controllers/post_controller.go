package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/zhenghao-zhao/instapp/app/api"
	"github.com/zhenghao-zhao/instapp/app/auth"
	db "github.com/zhenghao-zhao/instapp/db/sqlc"
	"golang.org/x/sync/errgroup"
)

const (
	PostPageLimit = 9
	FeedPageLimit = 9
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

		// create post
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

		// create image
		imageParams := make([]db.CreateImagesParams, len(uploadedCloudFiles))
		for i, filename := range uploadedCloudFiles {
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
		cursor, err := GetCursorParam(r)
		if err != nil {
			log.Printf("failed to parse curosr value: %v", err.Error())
			api.JSONResponse(w, api.InvalidQueryParamsResp)
			return
		}
		myUserID, err := auth.GetSessionUserId(r)
		if err != nil {
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}
		username, err := GetRouteSegment(r, "username")
		if err != nil {
			log.Printf("failed to parse username: %v", err.Error())
			api.JSONResponse(w, api.InvalidRouteResp)
			return
		}
		getPostsParams := db.GetPaginatedPostsByUsernameParams{
			MyUserID:   myUserID,
			Username:   username,
			LastPostID: cursor,
			Limit:      PostPageLimit + 1,
		}

		postRows, err := s.GetPaginatedPostsByUsername(r.Context(), getPostsParams)
		if err != nil {
			log.Printf("failed to get posts:%v", err.Error())
			api.JSONResponse(w, GenDBResponse(err))
			return
		}

		var imageUids []uuid.UUID

		listLength := min(PostPageLimit, len(postRows))
		posts := make([]PostDTO, listLength)

		for i := range listLength {
			row := postRows[i]
			err := json.Unmarshal(row.ImageUids, &imageUids)
			if err != nil {
				log.Printf("failed to unmarshal images: %v", err.Error())
				api.JSONResponse(w, api.GenericErrorResp)
				return
			}
			owner := OwnerProfileDTO{
				UserId:          strconv.FormatInt(row.OwnerID, 10),
				Username:        row.OwnerUsername,
				Name:            row.OwnerName,
				ProfileImageUrl: s.GetImageUrl(row.OwnerProfileImage.String()),
				IsFollowing:     row.OwnerIsFollowing,
			}
			posts[i] = PostDTO{
				CreatedAt:    ConvertTime(row.CreatedAt),
				PostId:       strconv.FormatInt(row.PostID, 10),
				Content:      *row.Content,
				ImageUrls:    s.GetPostImageUrls(imageUids),
				LikeCount:    row.LikeCount,
				CommentCount: row.CommentCount,
				HasLiked:     row.HasLiked,
				Owner:        owner,
				IsOwner:      row.OwnerID == myUserID,
			}
		}

		var nextCursor *string
		if len(postRows) == PostPageLimit+1 {
			nextCursor = &posts[len(posts)-1].PostId
		}
		data := NewPageDTO[PostDTO]{
			Data:       posts,
			NextCursor: nextCursor,
		}
		resp := api.ApiResponse{
			Data: data,
			Code: http.StatusOK,
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

		postId, err := GetIdFromRoute(r, "postId")
		if err != nil {
			log.Printf("failed to scan post id from route:%v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		postParams := db.GetPostByPostIDParams{
			MyUserID: myUserId,
			PostID:   postId,
		}

		postRow, err := s.GetPostByPostID(r.Context(), postParams)
		if err != nil {
			log.Printf("failed to get posts:%v", err.Error())
			api.JSONResponse(w, GenDBResponse(err))
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
			PostId:       strconv.FormatInt(postRow.PostID, 10),
			CreatedAt:    ConvertTime(postRow.CreatedAt),
			Content:      *postRow.Content,
			ImageUrls:    s.GetPostImageUrls(imageUids),
			LikeCount:    postRow.LikeCount,
			CommentCount: postRow.CommentCount,
			HasLiked:     postRow.HasLiked,
			IsOwner:      postRow.OwnerID == myUserId,
		}

		post.Owner = OwnerProfileDTO{
			UserId:          strconv.FormatInt(postRow.PostID, 10),
			Username:        postRow.OwnerUsername,
			Name:            postRow.OwnerName,
			ProfileImageUrl: s.GetImageUrl(postRow.OwnerProfileImage.String()),
			IsFollowing:     postRow.OwnerIsFollowing,
		}
		resp := api.ApiResponse{
			Data: post,
			Code: http.StatusOK,
		}
		api.JSONResponse(w, resp)
	}
}

func (s *Server) DeletePostHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		postId, err := GetIdFromRoute(r, "postId")
		if err != nil {
			log.Printf("failed to scan postUid from route: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		err = s.DeletePostByPostID(r.Context(), postId)
		if err != nil {
			log.Printf("failed to delete post from db: %v", err.Error())
			api.JSONResponse(w, api.GenericErrorResp)
			return
		}

		api.OKResponse(w)
	}
}

func (s *Server) FeedHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cursor, err := GetCursorParam(r)
		if err != nil {
			log.Printf("failed to parse curosr value: %v", err.Error())
			api.JSONResponse(w, api.InvalidQueryParamsResp)
			return
		}

		myUserID, err := auth.GetSessionUserId(r)
		if err != nil {
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}

		params := db.GetFeedPostsParams{
			MyUserID:   myUserID,
			LastPostID: cursor,
			Limit:      FeedPageLimit + 1,
		}
		postRows, err := s.GetFeedPosts(r.Context(), params)
		if err != nil {
			log.Printf("failed to get feed posts from db: %v", err.Error())
			api.JSONResponse(w, GenDBResponse(err))
			return
		}

		var imageUids []uuid.UUID

		listLength := min(PostPageLimit, len(postRows))
		posts := make([]PostDTO, listLength)

		for i := range listLength {
			row := postRows[i]
			err := json.Unmarshal(row.ImageUids, &imageUids)
			if err != nil {
				log.Printf("failed to unmarshal images: %v", err.Error())
				api.JSONResponse(w, api.GenericErrorResp)
				return
			}
			owner := OwnerProfileDTO{
				UserId:          strconv.FormatInt(row.OwnerID, 10),
				Username:        row.OwnerUsername,
				Name:            row.OwnerName,
				ProfileImageUrl: s.GetImageUrl(row.OwnerProfileImage.String()),
				IsFollowing:     true,
			}
			posts[i] = PostDTO{
				CreatedAt:    ConvertTime(row.CreatedAt),
				PostId:       strconv.FormatInt(row.PostID, 10),
				Content:      *row.Content,
				ImageUrls:    s.GetPostImageUrls(imageUids),
				LikeCount:    row.LikeCount,
				CommentCount: row.CommentCount,
				HasLiked:     row.HasLiked,
				Owner:        owner,
				IsOwner:      row.OwnerID == myUserID,
			}
		}

		var nextCursor *string

		if len(postRows) == FeedPageLimit+1 {
			nextCursor = &posts[len(posts)-1].PostId
		}
		data := NewPageDTO[PostDTO]{
			Data:       posts,
			NextCursor: nextCursor,
		}

		resp := api.ApiResponse{
			Data: data,
			Code: http.StatusOK,
		}
		api.JSONResponse(w, resp)
	}
}
