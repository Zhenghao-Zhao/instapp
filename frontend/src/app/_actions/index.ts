"use server";
import {
  getImageURLFromFilename,
  uploadCloudImageBuffer,
} from "@/app/(server)/api/_utils";
import { supaUpdateProfileImage } from "@/app/(server)/api/_utils/queries";
import { Image } from "@/app/_libs/constants";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { signInSchema, signUpSchema, verifySchema } from "../_libs/types";

export async function addProfileImage(formData: FormData) {
  const file = formData.get("profileImage") as File;
  if (!file) throw Error("Upload file not found");

  const { buffer } = await processImage(file);
  const filename = randomUUID() as string;
  await uploadCloudImageBuffer(filename, buffer);

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw Error("Unauthorized");

  const { error } = await supaUpdateProfileImage(supabase, user.id, filename);
  if (error) throw Error(error.message);

  return getImageURLFromFilename(filename);
}

export async function processImage(file: File) {
  if (!file.type.startsWith("image/"))
    throw new Error("File type not accepted.");

  const imageBuffer = await file.arrayBuffer();
  const width = Image.PROFILE_IMAGE_SIZE;
  const height = Image.PROFILE_IMAGE_SIZE;
  const COMPRESSION_QUALITY = 80;

  if (file.type === "image/gif" || file.type === "image/webp") {
    return {
      type: "webp",
      buffer: await sharp(imageBuffer, { animated: true })
        .resize(width, height)
        .webp({ quality: COMPRESSION_QUALITY })
        .toBuffer(),
    };
  }

  if (file.type === "image/png") {
    return {
      type: "png",
      buffer: await sharp(imageBuffer)
        .resize(width, height)
        .png({ quality: COMPRESSION_QUALITY })
        .toBuffer(),
    };
  }

  return {
    type: "jpeg",
    buffer: await sharp(imageBuffer)
      .resize(width, height)
      .jpeg({ quality: COMPRESSION_QUALITY })
      .toBuffer(),
  };
}

export async function signUp(_prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const username = formData.get("username") as string;

  const result = signUpSchema.safeParse({ email, password, name, username });

  if (!result.success) {
    return {
      error: result.error.issues[0].message,
      message: "",
    };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        name,
      },
    },
  });
  if (error)
    return {
      error: error.message,
      message: "",
    };
  return { error: null, message: "Success" };
}

export async function signIn(_prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = signInSchema.safeParse({ email, password });
  if (!result.success) {
    return {
      error: result.error.issues[0].message,
      message: "",
    };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error)
    return {
      error: error.message,
      message: "",
    };
  return { error: null, message: "Success" };
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      error: error.message,
      message: "",
    };
  }
  return { error: null, message: "Success" };
}

export async function verifyEmail(_prevState: any, formData: FormData) {
  const token = (formData.getAll("code") as string[]).join("");
  const email = formData.get("email") as string;
  const result = verifySchema.safeParse({ email, token });
  if (!result.success) {
    return {
      error: result.error.issues[0].message,
      message: "",
    };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error)
    return {
      error: error.message,
      message: "",
    };
  return { error: null, message: "Success" };
}
