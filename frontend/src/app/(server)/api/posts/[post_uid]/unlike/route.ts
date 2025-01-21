import { createClient } from "@/app/_libs/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { STATUS_CODES } from "../../../_utils/constants";
import { supaRemoveLikeToPost } from "../../../_utils/queries";

export async function POST(
  request: NextRequest,
  { params: { post_uid } }: { params: { post_uid: string } },
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: STATUS_CODES.UNAUTHORIZED },
    );
  const uid = user.id;
  const { error } = await supaRemoveLikeToPost(supabase, post_uid, uid);
  if (error)
    return NextResponse.json(
      { message: error.message },
      { status: STATUS_CODES.SERVER_ERROR },
    );

  return NextResponse.json(
    { message: "Successful" },
    { status: STATUS_CODES.OK },
  );
}
