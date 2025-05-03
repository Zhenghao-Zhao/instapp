package auth

import (
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/boj/redistore"
	"github.com/gorilla/sessions"
	"github.com/zhenghao-zhao/instapp/config"
	"golang.org/x/crypto/bcrypt"
)

func CreateRedisStore(config config.Config) (*redistore.RediStore, error) {
	store, err := redistore.NewRediStore(10, "tcp", config.RedisAddr, "", "", []byte(config.SessionKey))
	if err != nil {
		return nil, err
	}
	store.SetMaxAge(86400 * 7) // Session expiration time in seconds (e.g., 7 days)
	store.SetKeyPrefix("session:")
	return store, nil
}

type UserSessionInfo struct {
	UserId          int64
	Username        string
	Name            string
	ProfileImageUrl *string
}

func GeneratePassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hashedPassword), err
}

func ComparePassword(plainPassword string, hashedPassword string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(plainPassword)) == nil
}

var (
	Store           *redistore.RediStore
	SessionNameUser = "user-session"
)

func InitSession(config config.Config) (*redistore.RediStore, error) {
	// Store = sessions.NewCookieStore([]byte(config.SessionKey))
	sessionStore, err := CreateRedisStore(config)
	if err != nil {
		return nil, err
	}
	Store = sessionStore
	return sessionStore, nil
}

func CreateUserSession(w http.ResponseWriter, r *http.Request, u UserSessionInfo) error {
	fmt.Println("creating session...")
	session, err := Store.Get(r, SessionNameUser)
	if err != nil {
		return err
	}
	session.Values["userId"] = u.UserId
	session.Values["username"] = u.Username
	session.Values["name"] = u.Name
	if u.ProfileImageUrl != nil {
		session.Values["profileImageUrl"] = *u.ProfileImageUrl
	}
	session.Values["loggedIn"] = true
	fmt.Println("session created")
	return session.Save(r, w)
}

func GetSessionUserId(r *http.Request) (int64, error) {
	myUserId, err := GetSessionData[int64](r, "userId")
	if err != nil {
		log.Printf("failed to retrieve user id from session data: %v", err.Error())
	}
	return myUserId, err
}

func GetUserSessionInfo(r *http.Request) (UserSessionInfo, error) {
	var sessionInfo UserSessionInfo
	session, err := GetCurrentUserSession(r)
	if err != nil {
		log.Printf("failed to retrieve session data: %v", err.Error())
		return sessionInfo, err
	}
	var profileImageUrl *string
	val, ok := session.Values["profileImageUrl"].(string)
	if !ok || val == "" {
		profileImageUrl = nil
	} else {
		profileImageUrl = &val
	}

	sessionInfo = UserSessionInfo{
		Username:        session.Values["username"].(string),
		UserId:          session.Values["userId"].(int64),
		Name:            session.Values["name"].(string),
		ProfileImageUrl: profileImageUrl,
	}
	return sessionInfo, nil
}

func RemoveUserSession(w http.ResponseWriter, r *http.Request) error {
	session, err := GetCurrentUserSession(r)
	if err != nil {
		return err
	}
	session.Values = make(map[interface{}]interface{})
	session.Options.MaxAge = -1
	err = session.Save(r, w)
	return err
}

func GetCurrentUserSession(r *http.Request) (*sessions.Session, error) {
	session, err := Store.Get(r, SessionNameUser)
	if err != nil {
		return nil, err
	}
	if session.IsNew {
		return session, errors.New("session not found")
	}
	return session, nil
}

func IsLoggedIn(r *http.Request) bool {
	loggedIn, err := GetSessionData[bool](r, "loggedIn")
	if loggedIn && err == nil {
		return true
	}
	return false
}

func GetSessionData[T any](r *http.Request, key string) (T, error) {
	session, err := GetCurrentUserSession(r)
	var defaultVal T
	if err != nil {
		return defaultVal, err
	}
	val, exists := session.Values[key]
	if !exists {
		return defaultVal, err
	}

	typedVal, ok := val.(T)
	if !ok {
		return defaultVal, fmt.Errorf("value for key %v is not of type %T", key, defaultVal)
	}
	return typedVal, nil
}
