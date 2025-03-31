import { getImageURLFromFilename } from "@/app/(server)/api/_utils";
import { Pagination, STATUS_CODES } from "@/app/(server)/api/_utils/constants";
import { PostComment } from "@/app/_libs/types";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { supaGetComments } from "../../../_utils/queries";

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

  const page = request.nextUrl.searchParams.get("page");
  if (!page)
    return NextResponse.json(
      { message: "Missing page number" },
      { status: STATUS_CODES.BAD_REQUEST },
    );

  // index of start row in db
  const from = parseInt(page) * Pagination.LIMIT_COMMENTS;
  const { data, error } = await supaGetComments(
    supabase,
    post_uid,
    user.id,
    from,
    Pagination.LIMIT_COMMENTS,
  );

  if (error)
    return NextResponse.json(
      { message: error.message },
      { status: STATUS_CODES.SERVER_ERROR },
    );

  const comments: PostComment[] = data.map((comment) => ({
    uid: comment.ret_comment_uid,
    created_at: comment.ret_created_at,
    comment: comment.ret_comment,
    like_count: comment.ret_like_count,
    has_liked: comment.ret_has_liked,
    from_user: {
      uid: comment.ret_profile_uid,
      username: comment.ret_username,
      name: comment.ret_name,
      imageURL: getImageURLFromFilename(comment.ret_profile_image),
    },
  }));

  const nextCursor =
    data.length < Pagination.LIMIT_COMMENTS ? null : parseInt(page) + 1;
  return NextResponse.json(
    { comments, nextCursor },
    { status: STATUS_CODES.OK },
  );
}
