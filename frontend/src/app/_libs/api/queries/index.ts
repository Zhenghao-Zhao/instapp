import { clientApi } from "@/app/_api/axios";
import { FriendPage, Friendship, Post, PostPage } from "../../types";

export const getFolloweeQueryResult = async (uid: string, query: string) => {
  if (query.length < 1) return null;
  const result = await clientApi.get(`${uid}/followees?query=${query}`);
  return result.data;
};

export const getFriends = async (
  pageParam: number,
  uid: string,
  friendship: Friendship,
) => {
  const url = `${uid}/${friendship}?page=${pageParam}`;
  const result = await clientApi.get(url);
  return result.data;
};

export const getFriendsSearchResult = async (
  pageParam: number,
  uid: string,
  friendship: Friendship,
  query: string,
) => {
  const url =
    query.length > 0
      ? `${uid}/${friendship}?page=${pageParam}&query=${query}`
      : `${uid}/${friendship}?page=${pageParam}`;
  const result = await clientApi.get<FriendPage>(url);
  return result.data;
};

export const getFeedPosts = async (pageParam: number) => {
  const result = await clientApi.get<PostPage>(`feed?page=${pageParam}`);
  return result.data;
};

export const getPost = async (post_uid: string) => {
  const result = await clientApi.get<Post>(`posts/${post_uid}`);
  return result.data;
};

export const getExplorePosts = async (pageParam: number) => {
  const result = await clientApi.get<PostPage>(`explore?page=${pageParam}`);
  return result.data;
};

export const getPostsSearchResult = async (
  pageParam: number,
  query: string,
) => {
  const result = await clientApi.get(
    `search?key=posts&page=${pageParam}&query=${query}`,
  );
  return result.data;
};

export const getUsersSearchResult = async (
  pageParam: number,
  query: string,
) => {
  if (query.length === 0) return { result: [] };
  const result = await clientApi.get(
    `search?key=users&page=${pageParam}&query=${query}`,
  );
  return result.data;
};
