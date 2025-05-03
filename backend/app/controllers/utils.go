package controllers

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgtype"
)

var NilUid string = uuid.Nil.String()

func GetPaginationParams(pageNum int, itemsPerPage int32) (offset, limit int32) {
	if pageNum < 0 {
		pageNum = 0
	}
	offset = int32(pageNum) * itemsPerPage
	return offset, itemsPerPage
}

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

func GetCursorParam(r *http.Request) (int64, error) {
	result := GetQueryParam(r, "cursor")
	num, err := strconv.ParseInt(result, 10, 64)
	return num, err
}

func ParseUidString(uid string) (result uuid.UUID, err error) {
	err = result.Scan(uid)
	return
}

func GetRouteSegment(r *http.Request, name string) (string, error) {
	vars := mux.Vars(r)
	value, exists := vars[name]
	if !exists {
		return value, errors.New("route segment not found")
	}
	return value, nil
}

func GetIdFromRoute(r *http.Request, name string) (int64, error) {
	vars := mux.Vars(r)
	val := vars[name]
	id, err := strconv.ParseInt(val, 10, 64)
	return id, err
}

func ConvertTime(t pgtype.Timestamptz) string {
	return t.Time.Format(time.RFC3339)
}

func ConvertIds(ids []string) ([]int64, error) {
	rst := make([]int64, len(ids))
	for i, id := range ids {
		val, err := strconv.ParseInt(id, 10, 64)
		if err != nil {
			return rst, err
		}
		rst[i] = val
	}

	return rst, nil
}
