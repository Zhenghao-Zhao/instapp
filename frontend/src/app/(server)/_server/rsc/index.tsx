import Auth from "@/app/_components/auth";
import DataContextProvider from "@/app/_libs/contexts/providers/ServerContextProvider";
import { HydraDataSchema } from "@/app/_libs/types";
import { createClient } from "@/app/_libs/utils/supabase/server";
import { ENV } from "@/env";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export async function Data({ children }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return <Auth />;

  const { data: profileData } = await supabase
    .from("profiles")
    .select("uid, username, name, image_filename")
    .eq("uid", user.id)
    .single();

  if (!profileData) throw new Error("User profile not found");

  const imageURL =
    profileData.image_filename &&
    ENV.R2_BUCKET_URL_PUBLIC + "/" + profileData.image_filename;
  const appData = { profile: { ...profileData, imageURL } };
  const result = HydraDataSchema.safeParse(appData);
  if (!result.success) throw new Error("Server error");

  return <DataContextProvider data={appData}>{children}</DataContextProvider>;
}
