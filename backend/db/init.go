package db

import (
	"context"
	"fmt"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5"
	"github.com/zhenghao-zhao/instapp/config"
)

// connect to db
func Connect(config config.Config) *pgx.Conn {
	conn, err := pgx.Connect(context.Background(), config.DBUrl)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	err = conn.Ping(context.Background())
	if err != nil {
		log.Fatalf("--Connection is closed: %v--", err)
	}
	fmt.Println("---db connected---")
	return conn
}

// close connection to db
func Close(conn *pgx.Conn) {
	fmt.Println("---closing db connection---")
	if err := conn.Close(context.Background()); err != nil {
		log.Fatalf("Error closing connection to database: %v", err)
	}
}

// apply migrations to db
func AutoMigrate(config config.Config) {
	path := fmt.Sprintf("file://%v", config.MigrationPath)
	m, err := migrate.New(path, config.DBUrl)
	if err != nil {
		log.Fatalf("Error applying migration files: %v", err)
	}

	if config.DBReset {
		if err = m.Down(); err != nil && err != migrate.ErrNoChange {
			log.Fatalf("Error uping migration files: %v", err)
		}
	}

	if err = m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Error uping migration files: %v", err)
	}
}
