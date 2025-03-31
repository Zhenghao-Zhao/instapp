package controllers

import (
	"errors"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgtype"
)

const (
	PostPageLimit     = 9
	FollowerPageLimit = 20
	CommentPageLimit  = 10
)

var NilUid string = uuid.Nil.String()

func GetQueryParam(r *http.Request, name string) string {
	queryParams := r.URL.Query()
	// Access specific query parameters
	result := queryParams.Get(name)
	return result
}

func GetPageNumParam(r *http.Request) (int, error) {
	result := GetQueryParam(r, "page")
	return strconv.Atoi(result)
}

func ParseUidString(uid string) (result uuid.UUID, err error) {
	err = result.Scan(uid)
	return
}

func GetRouteSegment(r *http.Request, name string) (string, error) {
	vars := mux.Vars(r)
	value, exists := vars[name]
	if !exists {
		return value, errors.New("Route segment not found")
	}
	return value, nil
}

func GetUidFromRoute(r *http.Request, name string) (uuid.UUID, error) {
	vars := mux.Vars(r)
	val := vars[name]
	var uid uuid.UUID
	err := uid.Scan(val)
	if err != nil {
		log.Printf("failed to scan uid from route:%v", err.Error())
	}

	return uid, err
}

func ConvertTime(t pgtype.Timestamptz) string {
	return t.Time.Format(time.RFC3339)
}
