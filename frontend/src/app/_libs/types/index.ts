import { array, number, string, z } from "zod";

export const HydraDataSchema = z.object({
  profile: z.object({
    uid: z.string(),
    username: z.string(),
    name: z.string(),
    imageURL: z.string().nullable(),
  }),
});

export type HydraData = z.infer<typeof HydraDataSchema>;

export const ImageRowSchema = z.object({
  id: number().optional(),
  filename: string(),
  created_at: string().datetime().optional(),
  post_uid: string(),
});

export type ImageRow = z.infer<typeof ImageRowSchema>;

export const ProfileSchema = z.object({
  uid: z.string(),
  username: z.string(),
  name: z.string(),
  imageURL: z.string().nullable(),
  post_count: number(),
  follower_count: number(),
  followee_count: number(),
  has_followed: z.boolean(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const PostSchema = z.object({
  uid: z.string(),
  created_at: z.string().datetime(),
  description: z.string().nullable(),
  comment_count: z.number().nullable(),
  like_count: z.number(),
  imageURLs: array(z.string()),
  owner: z.object({
    username: z.string(),
    name: z.string(),
    uid: z.string(),
    has_followed: z.boolean(),
    imageURL: z.string().nullable(),
    bioURL: z.string(),
  }),
  has_liked: z.boolean(),
  is_owner: z.boolean(),
});

export type Post = z.infer<typeof PostSchema>;

export const postDbSchema = z.object({
  uid: string(),
  created_at: string().datetime().optional(),
  description: string(),
  from_uid: string(),
});

export type PostRow = z.infer<typeof postDbSchema>;

export const postPageSchema = z.object({
  posts: array(PostSchema),
  nextCursor: number().optional(),
});

export type PostPage = z.infer<typeof postPageSchema>;

export const commentSchema = z.object({
  uid: z.string(),
  created_at: string().datetime(),
  comment: z.string(),
  has_liked: z.boolean(),
  like_count: z.number(),
  from_user: z.object({
    uid: z.string(),
    username: z.string(),
    name: z.string(),
    imageURL: z.string().nullable(),
  }),
});

export type UserComment = z.infer<typeof commentSchema>;

export const friendSchema = z.object({
  uid: z.string(),
  username: z.string(),
  name: z.string(),
  imageURL: z.string(),
  has_followed: z.boolean(),
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
