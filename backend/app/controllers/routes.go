package controllers

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/zhenghao-zhao/instapp/app/api"
	"github.com/zhenghao-zhao/instapp/app/middlewares"
)

func (s *Server) initRoutes() {
	s.Router = mux.NewRouter()

	s.HandleFunc("/health", s.Health()).Methods("GET")

	s.HandleFunc("/signin", s.DoLogin()).Methods("POST")

	s.HandleFunc("/registration", s.DoRegister()).Methods("POST")

	s.HandleFunc("/account/auth-profile", middlewares.AuthMiddleware(s.GetAuthProfileHandler())).Methods("GET")

	s.HandleFunc("/account/change-profile-image", middlewares.AuthMiddleware(s.ChangeProfileImageHandler())).Methods("POST")

	s.HandleFunc("/signout", middlewares.AuthMiddleware(s.DoLogout())).Methods("POST")

	s.HandleFunc("/{username}/profile", middlewares.AuthMiddleware(s.GetUserProfileHandler())).Methods("GET")

	s.HandleFunc("/{username}/posts", middlewares.AuthMiddleware(s.GetPaginatedPostsHandler())).Methods("GET")

	s.HandleFunc("/post/create", middlewares.AuthMiddleware(s.CreatePostHandler())).Methods("POST")

	s.HandleFunc("/post/{postId}", middlewares.AuthMiddleware(s.GetPostHandler())).Methods("GET")

	s.HandleFunc("/post/{postId}", middlewares.AuthMiddleware(s.DeletePostHandler())).Methods("DELETE")

	s.HandleFunc("/post/{postId}/comment", middlewares.AuthMiddleware(s.GetCommentsHandler())).Methods("GET")

	s.HandleFunc("/post/{postId}/comment", middlewares.AuthMiddleware(s.CreateCommentHandler())).Methods("POST")

	s.HandleFunc("/post/{postId}/like", middlewares.AuthMiddleware(s.LikePostHandler())).Methods("POST")

	s.HandleFunc("/post/{postId}/unlike", middlewares.AuthMiddleware(s.UnlikePostHandler())).Methods("POST")

	s.HandleFunc("/comment/{commentId}/like", middlewares.AuthMiddleware(s.LikeCommentHandler())).Methods("POST")

	s.HandleFunc("/comment/{commentId}/unlike", middlewares.AuthMiddleware(s.UnlikeCommentHandler())).Methods("POST")

	s.HandleFunc("/friend/{userId}/add", middlewares.AuthMiddleware(s.AddFollowHandler())).Methods("POST")

	s.HandleFunc("/friend/{userId}/remove", middlewares.AuthMiddleware(s.RemoveFollowHandler())).Methods("POST")

	s.HandleFunc("/follower/{userId}/search", middlewares.AuthMiddleware(s.SearchFollowerHandler())).Methods("GET")

	s.HandleFunc("/followee/{userId}/search", middlewares.AuthMiddleware(s.SearchFolloweeHandler())).Methods("GET")

	s.HandleFunc("/friendships", middlewares.AuthMiddleware(s.GetFriendshipsHandler())).Methods("POST")

	s.HandleFunc("/search", middlewares.AuthMiddleware(s.SearchHandler())).Methods("GET")

	s.HandleFunc("/feed", middlewares.AuthMiddleware(s.FeedHandler())).Methods("GET")
}

func (s *Server) Health() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		api.OKResponse(w)
	}
}
