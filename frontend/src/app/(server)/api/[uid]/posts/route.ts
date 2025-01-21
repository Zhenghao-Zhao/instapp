import { getPagePosts } from "@/app/(server)/_server/utils/queries";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Pagination, STATUS_CODES } from "../../_utils/constants";

export async function GET(
  request: NextRequest,
  { params: {uid} }: { params: { uid: string } }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: STATUS_CODES.UNAUTHORIZED });

  const page = request.nextUrl.searchParams.get("page");
  const from_uid = user.id;
  if (!page) {
    return NextResponse.json(
      { message: "Missing page number" },
      { status: STATUS_CODES.BAD_REQUEST }
    );
  }

  const { data, error } = await getPagePosts(
    supabase,
    uid,
    from_uid,
    parseInt(page),
    Pagination.LIMIT_POSTS
  );
  if (error) return NextResponse.json(error, { status: STATUS_CODES.SERVER_ERROR });
  return NextResponse.json(data, { status: STATUS_CODES.OK });
}
