import { Database } from "@/app/_libs/schema/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function supaSearchPosts(supabase: SupabaseClient<Database>, query: string, from_uid: string, offset: number, limit: number) {
	return supabase.rpc('search_posts', { arg_query: query, arg_from_uid: from_uid, arg_from: offset, arg_limit: limit })
}

export async function supaSearchUsers(supabase: SupabaseClient<Database>, query: string, offset: number, limit: number) {
	return supabase.rpc('search_users', { arg_query: query, arg_offset: offset, arg_limit: limit })
}

export type SearchPostsData = NonNullable<Awaited<ReturnType<typeof supaSearchPosts>>['data']>
export type SearchUsersData = NonNullable<Awaited<ReturnType<typeof supaSearchUsers>>['data']>
