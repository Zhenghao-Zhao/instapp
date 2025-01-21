import { getPost } from "@/app/(server)/_server/utils/queries";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { notFound } from "next/navigation";
import Content from "./_content";

export default async function Page({
  params: { post_uid },
}: {
  params: { post_uid: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const from_uid = user.id;
  const { data, error } = await getPost(supabase, post_uid, from_uid);
  if (error) return notFound();

  return <Content initData={data} />;
}
