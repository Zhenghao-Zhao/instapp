import { getExplorePosts } from "@/app/(server)/_server/utils/queries";
import { createClient } from "@/app/_libs/utils/supabase/server";
import Content from "./_content";

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: postData, error: postError } = await getExplorePosts(
    supabase,
    user.id,
    0,
    9,
  );
  if (postError) throw new Error(postError.message);

  const postInitData = {
    pageParams: [0],
    pages: [postData],
  };

  return <Content uid={user.id} initData={postInitData} />;
}
