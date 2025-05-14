import InternalError from "@/app/(templates)/internalError";
import DataContextProvider from "@/app/_contexts/providers/DataContextProvider";
import { serverApi } from "@/app/_libs/hooks/api/axios";
import { fromError } from "@/app/_libs/utils";
import { AuthProfileSchema } from "@/app/_libs/vars/schemas";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";
import AuthPage from "./AuthPage";

export default async function AuthDataWrapper({ children }: PropsWithChildren) {
  try {
    const authProfile = await fetchAuthProfile();
    return (
      <DataContextProvider authProfileData={authProfile}>
        {children}
      </DataContextProvider>
    );
  } catch (error) {
    const apiError = fromError(error);
    if (apiError.status == 401) {
      return <AuthPage />;
    } else {
      return <InternalError />;
    }
  }
}

const fetchAuthProfile = async () => {
  try {
    const response = await serverApi.get("account/auth-profile", {
      headers: { Cookie: cookies().toString() },
    });
    return AuthProfileSchema.parse(response.data.data);
  } catch (error) {
    throw error; // Let the error boundary handle it
  }
};
