import { array, number, string, z } from "zod";

export const ProfileSchema = z.object({
  userUid: z.string(),
  username: z.string(),
  name: z.string(),
  profileImageUrl: z.string().nullable(),
  followerCount: number(),
  followeeCount: number(),
  postCount: number(),
  isFollowing: z.boolean(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const ProfileImageSchema = z.object({
  profileImageUrl: z.string().nullable(),
});

export type ProfileImage = z.infer<typeof ProfileImageSchema>;

export const OwnerProfileSchema = z.object({
  userUid: z.string(),
  username: z.string(),
  name: z.string(),
  profileImageUrl: z.string().nullable(),
  isFollowing: z.boolean(),
});
export type OwnerProfile = z.infer<typeof OwnerProfileSchema>;

export const PostSchema = z.object({
  postUid: z.string(),
  createdAt: z.string().datetime(),
  content: z.string().nullable(),
  commentCount: z.number().nullable(),
  likeCount: z.number(),
  imageUrls: array(z.string()),
  owner: OwnerProfileSchema,
  hasLiked: z.boolean(),
  isOwner: z.boolean(),
});
export type Post = z.infer<typeof PostSchema>;

export const PostArraySchema = z.array(PostSchema);

export const authProfileSchema = z.object({
  username: z.string(),
  userUid: z.string(),
  name: z.string(),
  profileImageUrl: z.string().nullable(),
});
export type AuthProfile = z.infer<typeof authProfileSchema>;

export const commentSchema = z.object({
  commentUid: z.string(),
  createdAt: string().datetime(),
  content: z.string(),
  hasLiked: z.boolean(),
  likeCount: z.number(),
  owner: authProfileSchema,
});
export type PostComment = z.infer<typeof commentSchema>;

export const commentPageSchema = z.object({
  data: array(commentSchema),
  nextCursor: number().nullable(),
});
export type CommentPage = z.infer<typeof commentPageSchema>;

export const postPageSchema = z.object({
  data: array(PostSchema),
  nextCursor: number().nullable(),
});
export type PostPage = z.infer<typeof postPageSchema>;

export type PostRow = z.infer<typeof postDbSchema>;

export const postDbSchema = z.object({
  uid: string(),
  created_at: string().datetime().optional(),
  description: string(),
  from_uid: string(),
});

export const friendSchema = z.object({
  uid: z.string(),
  username: z.string(),
  name: z.string(),
  imageURL: z.string(),
  hasFollowed: z.boolean(),
});

export const friendPageSchema = z.object({
  friends: array(friendSchema),
  nextCursor: number().optional(),
});

export const userSearchItemSchema = z.object({
  uid: z.string(),
  username: z.string(),
  name: z.string(),
  imageURL: z.string().nullable(),
  follower_count: z.number(),
});

export type UserSearchItem = z.infer<typeof userSearchItemSchema>;

export type FriendPage = z.infer<typeof friendPageSchema>;

export type Friend = z.infer<typeof friendSchema>;

export type Friendship = "followers" | "followees";

export type DropdownPosition = {
  left: number;
  top: number;
};

export type PaginatedPosts = {
  nextCursor: number | null;
  posts: Post[];
};

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Passwords must contain least 1 character"),
  name: z.string().min(1, "Passwords must contain least 1 character"),
  username: z.string().min(1, "Passwords must contain least 1 character"),
});

export const signInSchema = signUpSchema.pick({ email: true, password: true });

export const verifySchema = signUpSchema
  .pick({ email: true })
  .extend({ token: z.string().length(6) });

export const ImageRowSchema = z.object({
  id: number().optional(),
  filename: string(),
  created_at: string().datetime().optional(),
  post_uid: string(),
});

export type ImageRow = z.infer<typeof ImageRowSchema>;
