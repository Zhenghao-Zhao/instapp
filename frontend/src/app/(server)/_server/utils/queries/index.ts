import { Database } from "@/app/_libs/schema/supabase";
import { Friend, Post, Profile, UserSearchItem } from "@/app/_libs/types";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  mapFriendData,
  mapPostData,
  mapProfileData,
  mapSearchUsersResult,
} from "../mappings";
import {
  supaSearchPosts,
  supaSearchUsers,
} from "@/app/(server)/api/search/_queries";
import {
  supaGetExplorePosts,
  supaGetFolloweePosts,
  supaGetFollowees,
  supaGetFollowers,
  supaGetPaginatedPosts,
  supaGetPost,
  supaGetUserProfile,
  supaQueryFollowees,
  supaQueryFollowers,
} from "@/app/(server)/api/_utils/queries";

export async function getUserFollowees(
  supabase: SupabaseClient<Database>,
  from_uid: string,
  uid: string,
  page = 0,
  limit = 10,
) {
  const from = page * limit;
  const { data, error } = await supaGetFollowees(
    supabase,
    from_uid,
    uid,
    from,
    limit,
  );
  if (error) {
    return { data, error };
  }
  const followees: Friend[] = data.map((userInfo) => {
    return mapFriendData(userInfo);
  });

  const nextCursor = data.length < limit ? null : page + 1;
  return { data: { friends: followees, nextCursor }, error };
}

export async function getUserFollowers(
  supabase: SupabaseClient<Database>,
  from_uid: string,
  uid: string,
  page = 0,
  limit = 10,
) {
  const from = page * limit;
  const { data, error } = await supaGetFollowers(
    supabase,
    from_uid,
    uid,
    from,
    limit,
  );
  if (error) {
    return { data, error };
  }
  const followers: Friend[] = data.map((userInfo) => {
    return mapFriendData(userInfo);
  });

  const nextCursor = data.length < limit ? null : page + 1;
  return { data: { friends: followers, nextCursor }, error };
}

export async function getUserProfile(
  supabase: SupabaseClient<Database>,
  username: string,
  from_uid: string,
) {
  const { data, error } = await supaGetUserProfile(
    supabase,
    username,
    from_uid,
  );
  if (error) {
    console.log(error);
    return { data, error };
  }
  const profile: Profile = mapProfileData(data);
  return { data: profile, error };
}

export async function getPagePosts(
  supabase: SupabaseClient<Database>,
  uid: string,
  from_uid: string,
  page = 0,
  limit = 9,
) {
  const from = page * limit;
  const { data, error } = await supaGetPaginatedPosts(
    supabase,
    uid,
    from_uid,
    from,
    limit,
  );
  if (error) {
    console.log(error);
    return { data, error };
  }

  const posts: Post[] = data.map((post) => {
    return mapPostData(post, from_uid);
  });

  const nextCursor = data.length < limit ? null : page + 1;
  return { data: { posts, nextCursor }, error };
}

export async function getSearchPosts(
  supabase: SupabaseClient<Database>,
  query: string,
  from_uid: string,
  page: number,
  limit: number,
) {
  const from = page * limit;
  const { data, error } = await supaSearchPosts(
    supabase,
    query,
    from_uid,
    from,
    limit,
  );

  if (error) {
    console.log(error);
    return { data, error };
  }

  const posts: Post[] = data.map((post) => {
    return mapPostData(post, from_uid);
  });

  const nextCursor = data.length < limit ? null : page + 1;
  return { data: { posts, nextCursor }, error };
}

export async function getSearchUsers(
  supabase: SupabaseClient<Database>,
  query: string,
  page: number,
  limit: number,
) {
  const from = page * limit;
  const { data, error } = await supaSearchUsers(supabase, query, from, limit);

  if (error) {
    console.log(error);
    return { data, error };
  }

  const result: UserSearchItem[] = data.map((d) => {
    return mapSearchUsersResult(d);
  });

  const nextCursor = data.length < limit ? null : page + 1;
  return { data: { result, nextCursor }, error };
}

export async function getFolloweePosts(
  supabase: SupabaseClient<Database>,
  from_uid: string,
  page = 0,
  limit = 9,
) {
  const from = page * limit;
  const { data, error } = await supaGetFolloweePosts(
    supabase,
    from_uid,
    from,
    limit,
  );
  if (error) {
    return { data, error };
  }

  const posts: Post[] = data.map((post) => {
    return mapPostData(post, from_uid);
  });

  const nextCursor = data.length < limit ? null : page + 1;
  return { data: { posts, nextCursor }, error };
}

export async function getPost(
  supabase: SupabaseClient<Database>,
  post_uid: string,
  from_uid: string,
) {
  const { data, error } = await supaGetPost(supabase, post_uid, from_uid);
  if (error) {
    console.log(error);
    return { data, error };
  }
  const post: Post = mapPostData(data, from_uid);
  return { data: post, error };
}

export async function getExplorePosts(
  supabase: SupabaseClient<Database>,
  from_uid: string,
  page = 0,
  limit = 9,
) {
  const from = page * limit;
  const { data, error } = await supaGetExplorePosts(
    supabase,
    from_uid,
    from,
    limit,
  );
  if (error) {
    console.log(error);
    return { data, error };
  }

  const posts: Post[] = data.map((post: Post) => {
    return mapPostData(post, from_uid);
  });

  const nextCursor = data.length < limit ? null : page + 1;
  return { data: { posts, nextCursor }, error };
}

export async function getSearchFollowers(
  supabase: SupabaseClient<Database>,
  from_uid: string,
  query: string,
  page = 0,
  limit = 9,
) {
  const { data, error } = await supaQueryFollowers(
    supabase,
    from_uid,
    query,
    page,
    limit,
  );
  if (error) {
    console.log(error.message);
    return { data, error };
  }
  const friends: Friend[] = data.map((friend) => mapFriendData(friend));
  const nextCursor = data.length < limit ? null : page + 1;
  return { data: { friends, nextCursor }, error };
}

export async function getSearchFollowees(
  supabase: SupabaseClient<Database>,
  from_uid: string,
  query: string,
  page = 0,
  limit = 20,
) {
  const { data, error } = await supaQueryFollowees(
    supabase,
    from_uid,
    query,
    page,
    limit,
  );
  if (error) {
    console.log(error.message);
    return { data, error };
  }
  const friends: Friend[] = data.map((friend) => mapFriendData(friend));
  const nextCursor = data.length < limit ? null : page + 1;
  return { data: { friends, nextCursor }, error };
}
