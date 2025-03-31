package controllers

import "net/http"

type Service struct {
	client *http.Client
}

func NewService(client *http.Client) *Service {
	return &Service{
		client,
	}
}
