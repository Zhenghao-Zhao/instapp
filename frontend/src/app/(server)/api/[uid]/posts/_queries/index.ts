import { Database } from "@/app/_libs/schema/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function supaGetUserProfileByUsername(
  supabase: SupabaseClient<Database>,
  uid: string
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
  from_uid: string
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
  limit: number
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
  from_uid: string
) {
  return supabase
    .rpc("get_post", { arg_from_uid: from_uid, arg_post_uid: post_uid })
    .single();
}

export async function supaGetExplorePosts(
  supabase: SupabaseClient<Database>,
  from_uid: string,
  from: number,
  limit: number
) {
  return supabase.rpc("get_paginated_explore_posts", {
    arg_from_uid: from_uid,
    arg_from: from,
    arg_limit: limit,
  });
}
