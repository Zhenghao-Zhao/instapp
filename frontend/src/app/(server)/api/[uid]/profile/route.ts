import { Profile } from "@/app/_libs/types";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { getImageURLFromFilename } from "../../_utils";
import { STATUS_CODES } from "../../_utils/constants";
import { supaGetUserProfile } from "../../_utils/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } },
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

  const username = params.uid;
  const { data, error } = await supaGetUserProfile(supabase, username, user.id);
  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: STATUS_CODES.SERVER_ERROR },
    );
  }
  const imageURL = getImageURLFromFilename(data.ret_profile_image);
  const profile: Profile = {
    uid: data.ret_uid,
    username: data.ret_username,
    name: data.ret_name,
    profileImageURL: imageURL,
    postCount: data.ret_post_count,
    followerCount: data.ret_follower_count,
    followeeCount: data.ret_followee_count,
    isFollowing: data.ret_has_followed,
  };

  return NextResponse.json(profile, { status: STATUS_CODES.OK });
}
