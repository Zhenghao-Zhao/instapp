package api

import (
	"encoding/json"
	"net/http"
)

type ApiResponse struct {
	Data    any    `json:"data,omitempty"`
	Message string `json:"message,omitempty"`
	Code    int    `json:"-"`
}

var GenericErrorResp ApiResponse = ApiResponse{
	Message: "An unexpected error occurred",
	Code:    http.StatusInternalServerError,
}

var AuthErrorResp ApiResponse = ApiResponse{
	Message: "Unauthorized",
	Code:    http.StatusUnauthorized,
}

var InvalidRequestPayloadResp ApiResponse = ApiResponse{
	Message: "Incorrect payload",
	Code:    http.StatusBadRequest,
}

var InvalidQueryParamsResp ApiResponse = ApiResponse{
	Message: "Invalid query param(s)",
	Code:    http.StatusBadRequest,
}

var InvalidRouteResp ApiResponse = ApiResponse{
	Message: "Invalid url",
	Code:    http.StatusBadRequest,
}

var FormFileErrorResp ApiResponse = ApiResponse{
	Message: "Failed to process files from request",
	Code:    http.StatusBadRequest,
}

var FileSizeExceeded ApiResponse = ApiResponse{
	Message: "File size exceeded",
	Code:    http.StatusRequestEntityTooLarge,
}

var NotFoundErrorResp ApiResponse = ApiResponse{
	Message: "Not found",
	Code:    http.StatusNotFound,
}

func JSONResponse(w http.ResponseWriter, response ApiResponse) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(response.Code)
	json.NewEncoder(w).Encode(response)
}

func OKResponse(w http.ResponseWriter) {
	resp := ApiResponse{
		Message: "Success",
		Code:    http.StatusOK,
	}
	JSONResponse(w, resp)
}
