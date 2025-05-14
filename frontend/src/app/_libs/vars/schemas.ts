import { array, number, string, z } from "zod";

export const ProfileSchema = z.object({
  userId: z.string(),
  username: z.string(),
  name: z.string(),
  profileImageUrl: z.string().nullable(),
  followerCount: number(),
  followeeCount: number(),
  postCount: number(),
  isFollowing: z.boolean(),
});

export const ProfileImageSchema = z.object({
  profileImageUrl: z.string().nullable(),
});

export const OwnerProfileSchema = z.object({
  userId: z.string(),
  username: z.string(),
  name: z.string(),
  profileImageUrl: z.string().nullable(),
  isFollowing: z.boolean(),
});

export const PostSchema = z.object({
  postId: z.string(),
  createdAt: z.string().datetime(),
  content: z.string().nullable(),
  commentCount: z.number().nullable(),
  likeCount: z.number(),
  imageUrls: array(z.string()),
  owner: OwnerProfileSchema,
  hasLiked: z.boolean(),
  isOwner: z.boolean(),
});

export const AuthProfileSchema = z.object({
  username: z.string(),
  userId: z.string(),
  name: z.string(),
  profileImageUrl: z.string().nullable(),
});

export const CommentSchema = z.object({
  commentId: z.string(),
  createdAt: string().datetime(),
  content: z.string(),
  hasLiked: z.boolean(),
  likeCount: z.number(),
  owner: AuthProfileSchema,
});

export const CommentPageSchema = z.object({
  data: array(CommentSchema),
  nextCursor: number().nullable(),
});

export const PostPageSchema = z.object({
  data: array(PostSchema),
  nextCursor: string().nullable(),
});

export const FeedPageSchema = z.object({
  data: array(PostSchema),
  nextCursor: string().nullable(),
});

export const UserSchema = z.object({
  username: z.string(),
  userId: z.string(),
  name: z.string(),
  profileImageUrl: z.string().nullable(),
});

export const UserPageSchema = z.object({
  data: array(UserSchema),
  nextCursor: string().nullable(),
});

export const UserSearchItemSchema = z.object({
  userId: z.string(),
  username: z.string(),
  name: z.string(),
  imageURL: z.string().nullable(),
  follower_count: z.number(),
});

export const FriendshipSchema = z.object({
  isFollowing: z.boolean(),
});
export const FriendshipPayloadSchema = z.record(z.string(), FriendshipSchema);

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Passwords must contain least 1 character"),
  name: z.string().min(1, "Name must contain least 1 character"),
  username: z.string().min(1, "Username must contain least 1 character"),
});

export const SignInSchema = SignUpSchema.pick({ email: true, password: true });

export const VerifySchema = SignUpSchema.pick({ email: true }).extend({
  token: z.string().length(6),
});
