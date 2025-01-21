import { Database } from "@/app/_libs/schema/supabase";
import { ImageRow, PostRow } from "@/app/_libs/types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function supaInsertPost(
  supabase: SupabaseClient<Database>,
  post: PostRow,
) {
  return supabase.from("posts").insert(post);
}

export async function supaInsertImages(
  supabase: SupabaseClient<Database>,
  images: ImageRow[],
) {
  return supabase.from("images").insert(images);
}

export async function supaUpdateProfileImage(
  supabase: SupabaseClient<Database>,
  uid: string,
  filename: string,
) {
  return supabase
    .from("profiles")
    .update({ image_filename: filename })
    .eq("uid", uid);
}

export async function supaAddImage(
  supabase: SupabaseClient<Database>,
  filename: string,
) {
  return supabase.from("images").insert({ filename }).select("id").single();
}

export async function supaGetUserProfileById(
  supabase: SupabaseClient<Database>,
  uid: string,
) {
  return supabase
    .from("profiles")
    .select("username, name, image_filename")
    .eq("uid", uid)
    .single();
}

export async function supaAddLikeToPost(
  supabase: SupabaseClient<Database>,
  post_uid: string,
  from_uid: string,
) {
  return supabase.from("likes").insert({ post_uid, from_uid });
}

export async function supaRemoveLikeToPost(
  supabase: SupabaseClient<Database>,
  post_uid: string,
  from_uid: string,
) {
  return supabase.from("likes").delete().match({ post_uid, from_uid });
}

export async function supaDeletePost(
  supabase: SupabaseClient<Database>,
  uid: string,
) {
  return supabase.from("posts").delete().eq("uid", uid);
}

export async function supaGetComments(
  supabase: SupabaseClient<Database>,
  post_uid: string,
  from_uid: string,
  arg_from: number,
  arg_limit: number,
) {
  return supabase.rpc("get_paginated_comments", {
    arg_post_uid: post_uid,
    arg_from_uid: from_uid,
    arg_from,
    arg_limit,
  });
}

export async function supaAddComment(
  supabase: SupabaseClient<Database>,
  post_uid: string,
  from_uid: string,
  comment: string,
) {
  return supabase
    .from("comments")
    .insert({ comment, from_uid, post_uid })
    .select("created_at, uid, profiles (uid, username, name, image_filename)")
    .single();
}

export async function supaSearchPosts(
  supabase: SupabaseClient<Database>,
  query: string,
  from_uid: string,
  offset: number,
  limit: number,
) {
  return supabase.rpc("search_posts", {
    arg_query: query,
    arg_from_uid: from_uid,
    arg_from: offset,
    arg_limit: limit,
  });
}

export async function supaSearchUsers(
  supabase: SupabaseClient<Database>,
  query: string,
  offset: number,
  limit: number,
) {
  return supabase.rpc("search_users", {
    arg_query: query,
    arg_offset: offset,
    arg_limit: limit,
  });
}

export type SearchPostsData = NonNullable<
  Awaited<ReturnType<typeof supaSearchPosts>>["data"]
>;
export type SearchUsersData = NonNullable<
  Awaited<ReturnType<typeof supaSearchUsers>>["data"]
>;

export async function supaAddLikeToComment(
  supabase: SupabaseClient,
  comment_uid: string,
  liked_by: string,
) {
  return supabase
    .from("comment_likes")
    .insert({ comment_uid, liked_by })
    .select();
}

export async function supaRemoveLikeToComment(
  supabase: SupabaseClient,
  comment_uid: string,
  liked_by: string,
) {
  return supabase
    .from("comment_likes")
    .delete()
    .match({ comment_uid, liked_by })
    .select();
}

export async function supaAddFollow(
  supabase: SupabaseClient<Database>,
  followee_uid: string,
  follower_uid: string,
) {
  return supabase.from("friends").insert({ followee_uid, follower_uid });
}

export async function supaRemoveFollow(
  supabase: SupabaseClient<Database>,
  followee_uid: string,
  follower_uid: string,
) {
  return supabase
    .from("friends")
    .delete()
    .match({ followee_uid, follower_uid });
}

export async function supaGetUserProfileByUsername(
  supabase: SupabaseClient<Database>,
  uid: string,
) {
  return supabase
    .from("profiles")
    .select("username, name, image_filename, posts (id)")
    .eq("username", uid)
    .single();
}

export async function supaGetUserProfile(
  supabase: SupabaseClient<Database>,
  username: string,
  from_uid: string,
) {
  return supabase
    .rpc("get_user_profile", { arg_username: username, arg_from_uid: from_uid })
    .single();
}

export async function supaGetPaginatedPosts(
  supabase: SupabaseClient<Database>,
  uid: string,
  from_uid: string,
  from: number,
  limit: number,
) {
  return supabase.rpc("get_paginated_user_posts", {
    arg_uid: uid,
    arg_from_uid: from_uid,
    arg_from: from,
    arg_limit: limit,
  });
}

export async function supaGetPost(
  supabase: SupabaseClient<Database>,
  post_uid: string,
  from_uid: string,
) {
  return supabase
    .rpc("get_post", { arg_from_uid: from_uid, arg_post_uid: post_uid })
    .single();
}

export async function supaGetExplorePosts(
  supabase: SupabaseClient<Database>,
  from_uid: string,
  from: number,
  limit: number,
) {
  return supabase.rpc("get_paginated_explore_posts", {
    arg_from_uid: from_uid,
    arg_from: from,
    arg_limit: limit,
  });
}

export function supaGetFollowees(
  supabase: SupabaseClient<Database>,
  from_uid: string,
  uid: string,
  from: number,
  limit: number,
) {
  return supabase.rpc("get_paginated_user_followees", {
    arg_from_uid: from_uid,
    arg_uid: uid,
    arg_from: from,
    arg_limit: limit,
  });
}

export function supaQueryFollowees(
  supabase: SupabaseClient<Database>,
  uid: string,
  query: string,
  from: number,
  limit: number,
) {
  return supabase.rpc("search_followees", {
    arg_uid: uid,
    arg_query: query,
    arg_offset: from,
    arg_limit: limit,
  });
}

export function supaGetFolloweePosts(
  supabase: SupabaseClient<Database>,
  uid: string,
  from: number,
  limit: number,
) {
  return supabase.rpc("get_paginated_followee_posts", {
    arg_from_uid: uid,
    arg_from: from,
    arg_limit: limit,
  });
}

export function supaGetFollowers(
  supabase: SupabaseClient<Database>,
  from_uid: string,
  uid: string,
  from: number,
  limit: number,
) {
  return supabase.rpc("get_paginated_user_followers", {
    arg_from_uid: from_uid,
    arg_uid: uid,
    arg_from: from,
    arg_limit: limit,
  });
}

export function supaQueryFollowers(
  supabase: SupabaseClient<Database>,
  uid: string,
  query: string,
  from: number,
  limit: number,
) {
  return supabase.rpc("search_followers", {
    arg_uid: uid,
    arg_query: query,
    arg_offset: from,
    arg_limit: limit,
  });
}
