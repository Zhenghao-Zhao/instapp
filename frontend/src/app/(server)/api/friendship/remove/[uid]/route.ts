import { createClient } from "@/app/_libs/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { STATUS_CODES } from "../../../_utils/constants";
import { supaRemoveFollow } from "../../../_utils/queries";

export async function POST(
  request: NextRequest,
  { params: { uid } }: { params: { uid: string } },
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

  const { error } = await supaRemoveFollow(supabase, uid, user.id);
  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: STATUS_CODES.SERVER_ERROR },
    );
  }
  return NextResponse.json(
    { has_followed: false },
    { status: STATUS_CODES.OK },
  );
}

