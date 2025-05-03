import { z } from "zod";
import {
  AuthProfileSchema,
  CommentPageSchema,
  CommentSchema,
  FriendshipPayloadSchema,
  FriendshipSchema,
  ImageRowSchema,
  OwnerProfileSchema,
  PostPageSchema,
  PostSchema,
  ProfileImageSchema,
  ProfileSchema,
  UserPageSchema,
  UserSchema,
} from "./schemas";

export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileImage = z.infer<typeof ProfileImageSchema>;
export type OwnerProfile = z.infer<typeof OwnerProfileSchema>;
export type Post = z.infer<typeof PostSchema>;
export type AuthProfile = z.infer<typeof AuthProfileSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type CommentPage = z.infer<typeof CommentPageSchema>;
export type PostPage = z.infer<typeof PostPageSchema>;
export type UserPage = z.infer<typeof UserPageSchema>;

export type User = z.infer<typeof UserSchema>;

export type Followship = "follower" | "followee";

export type FriendshipPayload = z.infer<typeof FriendshipPayloadSchema>;

export type Friendship = z.infer<typeof FriendshipSchema>;

export type DropdownPosition = {
  left: number;
  top: number;
};

export type PaginatedPosts = {
  nextCursor: number | null;
  posts: Post[];
};
export type ImageRow = z.infer<typeof ImageRowSchema>;

export type Transform = {
  scale: number;
  translateX: number;
  translateY: number;
};

export const initFilterValues = {
  brightness: 1, // 0 - 2, 1 neutral
  contrast: 1, // 0 - 2, 1 neutral
  saturation: 1, // 0 - 2, 0 unsaturated, 1 unchanged
  sepia: 0, // 0 - 1, 1 completely sepia, 0 no change
  grayscale: 0, // 0 - 1, 1 completely grayscaled, 0 no change
};

export type CropParams = {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
  displaySize: number;
  src?: string;
  image?: HTMLImageElement;
};

export type FilterParams = {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  grayscale: number;
};

export type ImageInfo = {
  imageURL: string;
  width: number;
  height: number;
  natWidth: number;
  natHeight: number;
  image: HTMLImageElement;
};

export enum UploadSteps {
  Create,
  Crop,
  Edit,
  AddInfo,
  Submit,
}

export enum UploadState {
  Preparing,
  Uploading,
  Uploaded,
}

export type CanvasData = {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
  cWidth: number;
  cHeight: number;
  filter: FilterParams;
};

export enum GuideTypes {
  Mini,
  Regular,
}

export type ApiError = {
  message: string;
  status?: number;
};
