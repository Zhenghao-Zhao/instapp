package api

import (
	"context"
	"encoding/gob"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/zhenghao-zhao/instapp/app/auth"
	"github.com/zhenghao-zhao/instapp/app/utils/imageutil"
	"github.com/zhenghao-zhao/instapp/config"
	"github.com/zhenghao-zhao/instapp/db"
	"github.com/zhenghao-zhao/instapp/db/sqlc"
)

type Server struct {
	*mux.Router
	*config.Config
	sqlc.Store
	*Service
	*imageutil.ImageHandler
}

func (s *Server) Run() {
	gob.Register(uuid.UUID{})
	config := config.LoadConfig(".")
	s.Config = &config
	s.ImageHandler = imageutil.NewImageHandler(s.Config, 80)

	service := NewService(&http.Client{
		Timeout: time.Second * 10,
	})
	s.Service = service

	dbpool, err := pgxpool.New(context.Background(), config.DBUrl)
	if err != nil {
		log.Fatal("failed to create connection pool")
	}

	s.Store = sqlc.NewStore(dbpool)

	defer dbpool.Close()

	secretKey := config.SessionKey
	if secretKey == "" {
		log.Fatal("session key not found")
	}

	sessionStore, err := auth.InitSession(config)
	if err != nil {
		log.Fatalf("failed to create redis store: %v", err.Error())
	}
	defer sessionStore.Close()

	db.AutoMigrate(config)
	s.InitRoutes()

	// Configure CORS
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	originsOk := handlers.AllowedOrigins([]string{"http://localhost:3000"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})
	credentialsOk := handlers.AllowCredentials()
	handler := handlers.CORS(headersOk, originsOk, methodsOk, credentialsOk)(s.Router)

	server := http.Server{Addr: ":" + s.ServerPort, Handler: handler}

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Printf("Server is running on: %v", s.ServerPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("ListenAndServe: %v", err)
		}
	}()

	<-sigChan
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server Shutdown Failed: %v", err)
	}

	log.Println("Server exited gracefully")
}
