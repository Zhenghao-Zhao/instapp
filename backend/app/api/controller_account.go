package api

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/zhenghao-zhao/instapp/app/auth"
	db "github.com/zhenghao-zhao/instapp/db/sqlc"
)

func (s *Server) DoLogin() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if auth.IsLoggedIn(r) {
			fmt.Println("user already logged in")
			OKResponse(w)
			return
		}

		email := r.FormValue("email")
		password := r.FormValue("password")
		user, err := s.GetUserByEmail(r.Context(), email)

		var resp ApiResponse

		if err != nil || !auth.ComparePassword(password, user.Password) {
			resp = ApiResponse{Message: "Incorrect email or password", Code: http.StatusBadRequest}
			JSONResponse(w, resp)
			return
		}

		info := auth.UserSessionInfo{
			UserId:          user.ID,
			Username:        user.Username,
			Name:            *user.Name,
			ProfileImageUrl: s.GetImageUrl(user.ProfileImage.String()),
		}

		err = auth.CreateUserSession(w, r, info)
		if err != nil {
			JSONResponse(w, GenericErrorResp)
			return
		}
		OKResponse(w)
	}
}

func (s *Server) DoRegister() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		email := r.FormValue("email")
		password := r.FormValue("password")
		username := r.FormValue("username")
		name := r.FormValue("name")

		if email == "" || password == "" || username == "" || name == "" {
			resp := ApiResponse{
				Message: "Email, pasword, and name must not be empty",
				Code:    http.StatusBadRequest,
			}
			JSONResponse(w, resp)
			return
		}

		var hashedPassword string

		hashedPassword, err := auth.GeneratePassword(password)
		if err != nil {
			JSONResponse(w, GenericErrorResp)
			return
		}

		userParams := db.CreateUserParams{
			Username: username,
			Email:    email,
			Password: hashedPassword,
		}

		accountParams := db.CreateAccountTxParams{
			CreateUserParams: userParams,
			Name:             name,
		}

		userInfo, err := s.CreateAccountTx(r.Context(), accountParams)
		if err != nil {
			log.Printf("failed to create account in db: %v", err.Error())
			JSONResponse(w, GenDBResponse(err))
			return
		}

		sessionInfo := auth.UserSessionInfo{
			UserId:          userInfo.UserId,
			Username:        userInfo.Username,
			Name:            userInfo.Name,
			ProfileImageUrl: userInfo.ProfileImageUrl,
		}

		err = auth.CreateUserSession(w, r, sessionInfo)
		if err != nil {
			log.Printf("failed to create user session:%v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}

		OKResponse(w)
	}
}

func (s *Server) DoLogout() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := auth.RemoveUserSession(w, r)
		if err != nil {
			log.Printf("failed to logout: %v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}

		OKResponse(w)
	}
}

func (s *Server) GetAuthProfileHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		sessionInfo, err := auth.GetUserSessionInfo(r)
		if err != nil {
			log.Printf("failed to acquire session info: %v", err.Error())
			JSONResponse(w, AuthErrorResp)
			return
		}

		authProfile := UserProfileDTO{
			Username:        sessionInfo.Username,
			UserId:          strconv.FormatInt(sessionInfo.UserId, 10),
			Name:            sessionInfo.Name,
			ProfileImageUrl: sessionInfo.ProfileImageUrl,
		}

		resp := ApiResponse{
			Data: authProfile,
			Code: http.StatusOK,
		}

		JSONResponse(w, resp)
	}
}

func (s *Server) GetUserProfileHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		username := vars["username"]

		userId, err := auth.GetSessionUserId(r)
		if err != nil {
			JSONResponse(w, AuthErrorResp)
			return
		}

		params := db.GetProfileByUsernameOrIDParams{
			MyUserID:       userId,
			TargetUsername: username,
		}

		data, err := s.GetProfileByUsernameOrID(r.Context(), params)
		if err != nil {
			log.Printf("Error retrieving user profile:%v", err.Error())
			JSONResponse(w, NotFoundErrorResp)
			return
		}

		profile := ProfileDTO{
			UserId:          strconv.FormatInt(*data.UserID, 10),
			Username:        *data.Username,
			Name:            data.Name,
			ProfileImageUrl: s.GetImageUrl(data.ProfileImage.String()),
			FollowerCount:   data.FollowerCount,
			FolloweeCount:   data.FolloweeCount,
			PostCount:       data.PostCount,
			IsFollowing:     data.IsFollowing,
		}

		resp := ApiResponse{
			Data: profile,
			Code: http.StatusOK,
		}

		JSONResponse(w, resp)
	}
}

func (s *Server) ChangeProfileImageHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// check if file size is below max size 5MB
		err := r.ParseMultipartForm(5 << 20)
		if err != nil {
			JSONResponse(w, FileSizeExceeded)
			return
		}

		file, header, err := r.FormFile("profileImage")
		if err != nil {
			JSONResponse(w, FormFileErrorResp)
			return
		}

		session, err := auth.Store.Get(r, auth.SessionNameUser)
		if err != nil {
			JSONResponse(w, AuthErrorResp)
			return
		}

		myUserId, err := auth.GetSessionUserId(r)
		if err != nil {
			JSONResponse(w, AuthErrorResp)
			return
		}

		imageUid, err := uuid.NewRandom()
		if err != nil {
			log.Printf("failed to generate random uuid: %v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}

		fileType := header.Header.Get("Content-Type")
		// upload file to cloud
		buf, err := s.ProcessImageFile(file, fileType)
		if err != nil {
			log.Printf("failed to process image file: %v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}
		filename := imageUid.String()

		req, err := s.NewBucketRequest("PUT", filename, buf)
		if err != nil {
			log.Printf("failed to create request to upload image: %v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}
		resp, err := s.client.Do(req)
		if err != nil {
			log.Printf("request to upload image to cloud failed: %v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}
		defer resp.Body.Close()

		// add image to db
		params := db.UploadProfileImageParams{
			ImageUid: imageUid,
			MyUserID: myUserId,
		}

		imageUid, err = s.UploadProfileImage(r.Context(), params)
		if err != nil {
			log.Printf("failed to add image to db: %v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}

		profileImageUrl := s.GetImageUrl(imageUid.String())
		// update image in session data
		session.Values["profileImageUrl"] = profileImageUrl
		err = session.Save(r, w)
		if err != nil {
			log.Printf("failed to update image in session data: %v", err.Error())
			JSONResponse(w, GenericErrorResp)
			return
		}

		apiResp := ApiResponse{
			Data: ProfileImageDTO{
				ProfileImageUrl: profileImageUrl,
			},
			Code: http.StatusOK,
		}
		JSONResponse(w, apiResp)
	}
}
