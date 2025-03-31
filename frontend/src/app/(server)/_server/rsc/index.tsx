import Error from "@/app/(templates)/error";
import InternalError from "@/app/(templates)/internalError";
import { serverApi } from "@/app/_api/axios";
import { fromError, HttpStatusCodes } from "@/app/_api/utils";
import Auth from "@/app/_components/auth";
import DataContextProvider from "@/app/_libs/contexts/providers/ServerContextProvider";
import { authProfileSchema } from "@/app/_libs/types";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export async function Data({ children }: Props) {
  try {
    const response = await serverApi.get("account/auth-profile", {
      headers: {
        Cookie: cookies().toString(),
      },
    });
    const authProfile = authProfileSchema.parse(response.data.payload);
    return (
      <DataContextProvider authProfileData={authProfile}>
        {children}
      </DataContextProvider>
    );
  } catch (error) {
    const apiError = fromError(error);
    console.log(apiError.message);
    if (apiError.status == HttpStatusCodes.UNAUTHORIZED) {
      return <Auth />;
    } else {
      return <InternalError />;
    }
  }
}
