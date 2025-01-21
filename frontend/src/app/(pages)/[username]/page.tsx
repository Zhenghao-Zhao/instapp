import {
  getPagePosts,
  getUserProfile,
} from "@/app/(server)/_server/utils/queries";
import Auth from "@/app/_components/auth";
import { Profile } from "@/app/_libs/types";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { notFound } from "next/navigation";
import Content from "./_content";

export type InitData = {
  profile: Profile;
  isOwner: boolean;
  postData: any;
};

export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const from_uid = user.id;

  const { data: profileData, error: profileError } = await getUserProfile(
    supabase,
    username,
    from_uid,
  );
  if (profileError) {
    console.log(profileError.message);
    return notFound();
  }

  const isOwner = profileData.uid === user.id;
  const { data: postData, error: postError } = await getPagePosts(
    supabase,
    profileData.uid,
    from_uid,
    0,
    9,
  );

  if (postError) {
    console.log(postError.message);
    return notFound();
  }

  const postInitData = {
    pageParams: [0],
    pages: [postData],
  };

  return (
    <Content
      initData={{ profile: profileData, isOwner, postData: postInitData }}
    />
  );
}
