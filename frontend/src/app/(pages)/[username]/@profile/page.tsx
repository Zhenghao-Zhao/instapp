import { serverApi } from "@/app/_api/axios";
import { ProfileSchema } from "@/app/_libs/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import Header from "./Header";

export default async function Profile({
  params: { username },
}: {
  params: { username: string };
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryFn: ({ queryKey }) => {
      const [_, username] = queryKey;
      return getUserProfile(username);
    },
    queryKey: ["userProfile", username],
    staleTime: 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Header username={username} />
    </HydrationBoundary>
  );
}

const getUserProfile = async (username: string) => {
  const response = await serverApi.get(`${username}/profile`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return ProfileSchema.parse(response.data.payload);
};
