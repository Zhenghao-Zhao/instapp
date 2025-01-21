import { Database } from "@/app/_libs/schema/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export function supaGetFollowers(
  supabase: SupabaseClient<Database>,
  from_uid: string,
  uid: string,
  from: number,
  limit: number
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
  limit: number
) {
  return supabase.rpc("search_followers", {
    arg_uid: uid,
    arg_query: query,
    arg_offset: from,
    arg_limit: limit,
  });
}
