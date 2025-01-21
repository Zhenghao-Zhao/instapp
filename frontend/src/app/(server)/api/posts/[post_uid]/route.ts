import { getPost } from "@/app/(server)/_server/utils/queries";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { STATUS_CODES } from "../../_utils/constants";
import { supaDeletePost } from "../../_utils/queries";

export async function DELETE(
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

  const { error } = await supaDeletePost(supabase, post_uid);
  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: STATUS_CODES.SERVER_ERROR },
    );
  }
  return NextResponse.json(
    { message: "Successful" },
    { status: STATUS_CODES.OK },
  );
}

export async function GET(
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

  const { data, error } = await getPost(supabase, post_uid, user.id);
  if (error)
    return NextResponse.json(
      { message: error.message },
      { status: STATUS_CODES.SERVER_ERROR },
    );
  return NextResponse.json(data, { status: STATUS_CODES.OK });
}
