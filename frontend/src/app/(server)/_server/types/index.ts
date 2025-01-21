import { supaGetFollowees } from "@/app/(server)/api/[uid]/followees/_queries";
import { supaGetPost, supaGetUserProfile } from "@/app/(server)/api/[uid]/posts/_queries";

export type FriendData = NonNullable<Awaited<ReturnType<typeof supaGetFollowees>>['data']>[0]
export type ProfileData = NonNullable<Awaited<ReturnType<typeof supaGetUserProfile>>['data']> 
export type PostData= NonNullable<Awaited<ReturnType<typeof supaGetPost>>['data']>