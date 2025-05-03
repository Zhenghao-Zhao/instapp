package middlewares

import (
	"net/http"

	"github.com/zhenghao-zhao/instapp/app/api"
	"github.com/zhenghao-zhao/instapp/app/auth"
)

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !auth.IsLoggedIn(r) {
			api.JSONResponse(w, api.AuthErrorResp)
			return
		}
		next.ServeHTTP(w, r)
	}
}
