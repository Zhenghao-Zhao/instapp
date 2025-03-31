package controllers

type PageDTO[T any] struct {
	Data       []T  `json:"data"`
	NextCursor *int `json:"nextCursor"`
}

type PostDTO struct {
	CreatedAt    string          `json:"createdAt"`
	PostUid      string          `json:"postUid"`
	Content      string          `json:"content"`
	ImageUrls    []string        `json:"imageUrls"`
	LikeCount    int64           `json:"likeCount"`
	CommentCount int64           `json:"commentCount"`
	HasLiked     bool            `json:"hasLiked"`
	Owner        OwnerProfileDTO `json:"owner"`
	IsOwner      bool            `json:"isOwner"`
}

type OwnerProfileDTO struct {
	UserUid         string  `json:"userUid"`
	Username        string  `json:"username"`
	Name            string  `json:"name"`
	ProfileImageUrl *string `json:"profileImageUrl"`
	IsFollowing     bool    `json:"isFollowing"`
}

type ProfileImageDTO struct {
	ProfileImageUrl *string `json:"profileImageUrl"`
}

type ProfileDTO struct {
	UserUid         string  `json:"userUid"`
	Username        string  `json:"username"`
	Name            string  `json:"name"`
	ProfileImageUrl *string `json:"profileImageUrl"`
	FollowerCount   int64   `json:"followerCount"`
	FolloweeCount   int64   `json:"followeeCount"`
	PostCount       int64   `json:"postCount"`
	IsFollowing     bool    `json:"isFollowing"`
}

type CommentDTO struct {
	CreatedAt  string         `json:"createdAt"`
	CommentUid string         `json:"commentUid"`
	Content    string         `json:"content"`
	LikeCount  int64          `json:"likeCount"`
	HasLiked   bool           `json:"hasLiked"`
	Owner      AuthProfileDTO `json:"owner"`
	IsOwner    bool           `json:"isOwner"`
}

type AuthProfileDTO struct {
	Username        string  `json:"username"`
	UserUid         string  `json:"userUid"`
	Name            string  `json:"name"`
	ProfileImageUrl *string `json:"profileImageUrl"`
}
