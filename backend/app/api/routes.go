package api

import (
	"net/http"

	"github.com/gorilla/mux"
)

func (s *Server) InitRoutes() {
	s.Router = mux.NewRouter()

	s.HandleFunc("/health", s.Health()).Methods("GET")

	s.HandleFunc("/signin", s.DoLogin()).Methods("POST")

	s.HandleFunc("/registration", s.DoRegister()).Methods("POST")

	s.HandleFunc("/account/auth-profile", AuthMiddleware(s.GetAuthProfileHandler())).Methods("GET")

	s.HandleFunc("/account/change-profile-image", AuthMiddleware(s.ChangeProfileImageHandler())).Methods("POST")

	s.HandleFunc("/signout", AuthMiddleware(s.DoLogout())).Methods("POST")

	s.HandleFunc("/{username}/profile", AuthMiddleware(s.GetUserProfileHandler())).Methods("GET")

	s.HandleFunc("/{username}/posts", AuthMiddleware(s.GetPaginatedPostsHandler())).Methods("GET")

	s.HandleFunc("/post/create", AuthMiddleware(s.CreatePostHandler())).Methods("POST")

	s.HandleFunc("/post/{postId}", AuthMiddleware(s.GetPostHandler())).Methods("GET")

	s.HandleFunc("/post/{postId}", AuthMiddleware(s.DeletePostHandler())).Methods("DELETE")

	s.HandleFunc("/post/{postId}/comment", AuthMiddleware(s.GetCommentsHandler())).Methods("GET")

	s.HandleFunc("/post/{postId}/comment", AuthMiddleware(s.CreateCommentHandler())).Methods("POST")

	s.HandleFunc("/post/{postId}/like", AuthMiddleware(s.LikePostHandler())).Methods("POST")

	s.HandleFunc("/post/{postId}/unlike", AuthMiddleware(s.UnlikePostHandler())).Methods("POST")

	s.HandleFunc("/comment/{commentId}/like", AuthMiddleware(s.LikeCommentHandler())).Methods("POST")

	s.HandleFunc("/comment/{commentId}/unlike", AuthMiddleware(s.UnlikeCommentHandler())).Methods("POST")

	s.HandleFunc("/friend/{userId}/add", AuthMiddleware(s.AddFollowHandler())).Methods("POST")

	s.HandleFunc("/friend/{userId}/remove", AuthMiddleware(s.RemoveFollowHandler())).Methods("POST")

	s.HandleFunc("/follower/{userId}/search", AuthMiddleware(s.SearchFollowerHandler())).Methods("GET")

	s.HandleFunc("/followee/{userId}/search", AuthMiddleware(s.SearchFolloweeHandler())).Methods("GET")

	s.HandleFunc("/friendships", AuthMiddleware(s.GetFriendshipsHandler())).Methods("POST")

	s.HandleFunc("/search", AuthMiddleware(s.SearchHandler())).Methods("GET")

	s.HandleFunc("/feed", AuthMiddleware(s.FeedHandler())).Methods("GET")
}

func (s *Server) Health() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		OKResponse(w)
	}
}
