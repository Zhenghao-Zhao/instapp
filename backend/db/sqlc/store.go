package sqlc

import (
	"context"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Store interface {
	Querier
	CreateAccountTx(ctx context.Context, arg CreateAccountTxParams) (*UserInfo, error)
}

type StoreImp struct {
	*Queries
	dbpool *pgxpool.Pool
}

func NewStore(dbpool *pgxpool.Pool) Store {
	return &StoreImp{New(dbpool), dbpool}
}

type CreateAccountTxParams struct {
	CreateUserParams
	Name string `json:"name"`
}

type UserInfo struct {
	Username        string
	UserUid         uuid.UUID
	UserId          int32
	Name            string
	ProfileImageUrl *string
}

func (store *StoreImp) CreateAccountTx(ctx context.Context, arg CreateAccountTxParams) (*UserInfo, error) {
	fmt.Println("--creating account...--")
	conn, err := store.dbpool.Acquire(ctx)
	if err != nil {
		log.Fatalf("Unable to acquire connection: %v", err)
	}
	defer conn.Release()
	tx, err := conn.Begin(ctx)
	if err != nil {
		log.Printf("failed to open transaction: %v", err.Error())
		return nil, err
	}
	defer tx.Rollback(ctx)
	qtx := store.WithTx(tx)
	userParams := CreateUserParams{
		Username: arg.Username,
		Email:    arg.Email,
		Password: arg.Password,
	}
	user, err := qtx.CreateUser(ctx, userParams)
	if err != nil {
		log.Printf("failed to create user in db: %v", err.Error())
		return nil, err
	}
	profileParams := CreateProfileParams{
		UserID: user.ID,
		Name:   arg.Name,
	}
	profile, err := qtx.CreateProfile(ctx, profileParams)
	if err != nil {
		log.Printf("failed to create profile in db: %v", err.Error())
		return nil, err
	}

	if err = tx.Commit(ctx); err != nil {
		log.Printf("failed to commit transaction: %v", err.Error())
		return nil, err
	}
	fmt.Println("--commit successfully--")

	userInfo := UserInfo{
		Username:        user.Username,
		UserUid:         user.Uid,
		UserId:          user.ID,
		Name:            profile.Name,
		ProfileImageUrl: nil,
	}

	return &userInfo, nil
}
