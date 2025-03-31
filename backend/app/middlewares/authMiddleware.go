package middlewares

import (
	"net/http"

	"github.com/zhenghao-zhao/instapp/app/utils/api"
	"github.com/zhenghao-zhao/instapp/app/utils/auth"
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
