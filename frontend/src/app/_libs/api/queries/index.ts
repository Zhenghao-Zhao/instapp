import api from "@/config";
import { FriendPage, Friendship, Post, PostPage, Profile } from "../../types";

export const getUserPosts = async (pageParam: number, uid: string) => {
  const result = await api.get<PostPage>(`${uid}/posts?page=${pageParam}`);
  return result.data;
};

export const getUserProfile = async (uid: string) => {
  const result = await api.get<Profile>(`${uid}/profile`);
  return result.data;
};

export const getComments = async (pageParam: number, post_uid: string) => {
  const result = await api.get(`posts/${post_uid}/comments?page=${pageParam}`);
  return result.data;
};

export const getFolloweeQueryResult = async (uid: string, query: string) => {
  if (query.length < 1) return null;
  const result = await api.get(`${uid}/followees?query=${query}`);
  return result.data;
};

export const getFriends = async (
  pageParam: number,
  uid: string,
  friendship: Friendship
) => {
  const url = `${uid}/${friendship}?page=${pageParam}`;
  const result = await api.get(url);
  return result.data;
};

export const getFriendsSearchResult = async (
  pageParam: number,
  uid: string,
  friendship: Friendship,
  query: string
) => {
  const url =
    query.length > 0
      ? `${uid}/${friendship}?page=${pageParam}&query=${query}`
      : `${uid}/${friendship}?page=${pageParam}`;
  const result = await api.get<FriendPage>(url);
  return result.data;
};

export const getFeedPosts = async (pageParam: number) => {
  const result = await api.get<PostPage>(`feed?page=${pageParam}`);
  return result.data;
};

export const getPost = async (post_uid: string) => {
  const result = await api.get<Post>(`posts/${post_uid}`);
  return result.data;
};

export const getExplorePosts = async (pageParam: number) => {
  const result = await api.get<PostPage>(`explore?page=${pageParam}`);
  return result.data;
};

export const getPostsSearchResult = async (
  pageParam: number,
  query: string,
) => {
  const result = await api.get(`search?key=posts&page=${pageParam}&query=${query}`)
  return result.data;
}

export const getUsersSearchResult = async (
  pageParam: number,
  query: string,
) => {
  if (query.length === 0) return { result: [] };
  const result = await api.get(`search?key=users&page=${pageParam}&query=${query}`)
  return result.data;
}
