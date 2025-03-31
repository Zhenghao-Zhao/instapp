import {
  getImageURLFromFilename,
  getOwnerURL,
} from "@/app/(server)/api/_utils";
import { Friend, Post, Profile, UserSearchItem } from "@/app/_libs/types";
import { FriendData, PostData, ProfileData } from "../../types";
import {
  SearchPostsData,
  SearchUsersData,
} from "@/app/(server)/api/search/_queries";

export function mapPostData(data: PostData, from_uid: string): Post {
  const imageURLs = data.ret_post_images?.map((filename: string) => {
    return getImageURLFromFilename(filename);
  });
  const post: Post = {
    createdAt: data.ret_created_at,
    postUid: data.ret_post_uid,
    description: data.ret_description,
    commentCount: data.ret_comment_count,
    likeCount: data.ret_like_count,
    owner: {
      uid: data.ret_owner_uid,
      name: data.ret_owner_name,
      username: data.ret_owner_username,
      has_followed: data.ret_follows_owner,
      imageURL: getImageURLFromFilename(data.ret_owner_profile_image),
      bioURL: getOwnerURL(data.ret_owner_username),
    },
    hasLiked: data.ret_has_liked,
    isOwner: from_uid === data.ret_owner_uid,
    imageUrls: imageURLs,
  };
  return post;
}

export function mapProfileData(data: ProfileData): Profile {
  const imageURL = getImageURLFromFilename(data.ret_profile_image);
  const profile: Profile = {
    uid: data.ret_uid,
    username: data.ret_username,
    name: data.ret_name,
    profileImageURL: imageURL,
    postCount: data.ret_post_count,
    followerCount: data.ret_follower_count,
    followeeCount: data.ret_followee_count,
    isFollowing: data.ret_has_followed,
  };
  return profile;
}

export function mapFriendData(data: FriendData): Friend {
  return {
    uid: data.ret_uid,
    username: data.ret_username,
    name: data.ret_name,
    imageURL: getImageURLFromFilename(data.ret_profile_image),
    hasFollowed: data.ret_has_followed,
  };
}

export function mapSearchUsersResult(data: SearchUsersData[0]): UserSearchItem {
  return {
    uid: data.ret_uid,
    username: data.ret_username,
    name: data.ret_name,
    imageURL: getImageURLFromFilename(data.ret_profile_image),
    follower_count: data.ret_follower_count,
  };
}
