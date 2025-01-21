import { ImageRow, PostRow } from "@/app/_libs/types";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { uploadCloudImage } from "../_utils";
import { STATUS_CODES } from "../_utils/constants";
import { supaInsertImages, supaInsertPost } from "../_utils/queries";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: STATUS_CODES.UNAUTHORIZED },
    );

  const from_uid = user.id;
  const formData = await request.formData();
  const files = formData.getAll("file") as File[];
  const description = formData.get("text") as string;

  if (files.length < 1) {
    return NextResponse.json(
      { message: "No upload images" },
      { status: STATUS_CODES.SERVER_ERROR },
    );
  }

  const post_uid = randomUUID();
  const postCol: PostRow = {
    uid: post_uid,
    from_uid,
    description,
  };

  const { error } = await supaInsertPost(supabase, postCol);
  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: STATUS_CODES.SERVER_ERROR },
    );
  }

  const requests = new Array(files.length);
  const images: ImageRow[] = [];
  for (let file of files) {
    const filename = randomUUID();
    requests.push(uploadCloudImage(filename, file));
    images.push({ filename, post_uid });
  }
  requests.push(supaInsertImages(supabase, images));

  try {
    await Promise.all(requests);
  } catch (error) {
    return NextResponse.json(
      { message: error },
      { status: STATUS_CODES.SERVER_ERROR },
    );
  }

  return NextResponse.json(
    { message: "Successful" },
    { status: STATUS_CODES.OK },
  );
}

