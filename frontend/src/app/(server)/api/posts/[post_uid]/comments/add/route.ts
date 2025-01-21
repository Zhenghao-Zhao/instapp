import { UserComment } from "@/app/_libs/types";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { ENV } from "@/env";
import { NextRequest, NextResponse } from "next/server";
import { STATUS_CODES } from "@/app/(server)/api/_utils/constants";
import { supaAddComment } from "@/app/(server)/api/_utils/queries";

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

  const formData = await request.formData();
  const comment = formData.get("comment") as string;

  const { data, error } = await supaAddComment(
    supabase,
    post_uid,
    user.id,
    comment,
  );

  if (error) {
    console.log(error);
    return NextResponse.json(
      { message: error.message },
      { status: STATUS_CODES.SERVER_ERROR },
    );
  }

  if (!data.profiles) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: STATUS_CODES.UNAUTHORIZED },
    );
  }

  const rst: UserComment = {
    uid: data.uid,
    created_at: data.created_at,
    comment,
    has_liked: false,
    like_count: 0,
    from_user: {
      uid: data.profiles.uid,
      username: data.profiles.username,
      name: data.profiles.name,
      imageURL:
        data.profiles.image_filename &&
        ENV.R2_BUCKET_URL_PUBLIC + "/" + data.profiles.image_filename,
    },
  };

  return NextResponse.json(rst, { status: STATUS_CODES.OK });
}
