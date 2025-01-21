import {
  getSearchFollowees,
  getUserFollowees,
} from "@/app/(server)/_server/utils/queries";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Pagination, STATUS_CODES } from "../../_utils/constants";

export async function GET(
  request: NextRequest,
  { params: { uid } }: { params: { uid: string } },
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: STATUS_CODES.UNAUTHORIZED },
    );
  }
  const page = request.nextUrl.searchParams.get("page");
  if (!page) {
    return NextResponse.json(
      { message: "Bad request, missing page number" },
      { status: STATUS_CODES.BAD_REQUEST },
    );
  }
  const query = request.nextUrl.searchParams.get("query");
  if (query === null) {
    const { data, error } = await getUserFollowees(
      supabase,
      user.id,
      uid,
      parseInt(page),
      Pagination.LIMIT_FOLLOWEES,
    );
    if (error)
      return NextResponse.json(error, { status: STATUS_CODES.SERVER_ERROR });
    return NextResponse.json(data, { status: STATUS_CODES.OK });
  } else if (query.length > 0) {
    const { data, error } = await getSearchFollowees(
      supabase,
      uid,
      query,
      parseInt(page),
      Pagination.LIMIT_FOLLOWEES,
    );
    if (error)
      return NextResponse.json(error, { status: STATUS_CODES.SERVER_ERROR });
    return NextResponse.json(data, { status: STATUS_CODES.OK });
  } else {
    return NextResponse.json(
      { message: "Query length cannot be zero" },
      { status: STATUS_CODES.BAD_REQUEST },
    );
  }
}
