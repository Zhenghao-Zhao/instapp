package controllers

type PageDTO[T any] struct {
	Data       []T  `json:"data"`
	NextCursor *int `json:"nextCursor"`
}

type NewPageDTO[T any] struct {
	Data       []T     `json:"data"`
	NextCursor *string `json:"nextCursor"`
}

type PostDTO struct {
	CreatedAt    string          `json:"createdAt"`
	PostId       string          `json:"postId"`
	Content      string          `json:"content"`
	ImageUrls    []string        `json:"imageUrls"`
	LikeCount    int64           `json:"likeCount"`
	CommentCount int64           `json:"commentCount"`
	HasLiked     bool            `json:"hasLiked"`
	Owner        OwnerProfileDTO `json:"owner"`
	IsOwner      bool            `json:"isOwner"`
}

type OwnerProfileDTO struct {
	UserId          string  `json:"userId"`
	Username        string  `json:"username"`
	Name            string  `json:"name"`
	ProfileImageUrl *string `json:"profileImageUrl"`
	IsFollowing     bool    `json:"isFollowing"`
}

type ProfileImageDTO struct {
	ProfileImageUrl *string `json:"profileImageUrl"`
}

type ProfileDTO struct {
	UserId          string  `json:"userId"`
	Username        string  `json:"username"`
	Name            string  `json:"name"`
	ProfileImageUrl *string `json:"profileImageUrl"`
	FollowerCount   int64   `json:"followerCount"`
	FolloweeCount   int64   `json:"followeeCount"`
	PostCount       int64   `json:"postCount"`
	IsFollowing     bool    `json:"isFollowing"`
}

type CommentDTO struct {
	CreatedAt string         `json:"createdAt"`
	CommentId string         `json:"commentId"`
	Content   string         `json:"content"`
	LikeCount int64          `json:"likeCount"`
	HasLiked  bool           `json:"hasLiked"`
	Owner     UserProfileDTO `json:"owner"`
	IsOwner   bool           `json:"isOwner"`
}

type UserProfileDTO struct {
	Username        string  `json:"username"`
	UserId          string  `json:"userId"`
	Name            string  `json:"name"`
	ProfileImageUrl *string `json:"profileImageUrl"`
}

type RelationDTO struct {
	IsFollowing bool `json:"isFollowing"`
}
