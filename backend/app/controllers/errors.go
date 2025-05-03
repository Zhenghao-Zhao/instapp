package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/jackc/pgerrcode"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/zhenghao-zhao/instapp/app/api"
)

func GenDBResponse(err error) api.ApiResponse {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		switch pgErr.Code {
		case pgerrcode.UniqueViolation:
			colName := extractColumnName(pgErr.ConstraintName)
			errMessage := fmt.Sprintf("The %v already exists", colName)
			return api.ApiResponse{Message: errMessage, Code: http.StatusBadRequest}
		case pgerrcode.NotNullViolation:
			colName := extractColumnName(pgErr.ConstraintName)
			errMessage := fmt.Sprintf("The %v is required", colName)
			return api.ApiResponse{Message: errMessage, Code: http.StatusBadRequest}
		}
	}
	return api.GenericErrorResp
}

func extractColumnName(constraint string) string {
	parts := strings.Split(constraint, "_")
	if len(parts) < 1 {
		return "column"
	}
	return parts[1]
}
