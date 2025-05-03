import { serverApi } from "@/app/_libs/hooks/api/axios";
import { fromError } from "@/app/_libs/utils";
import { PostPageSchema, ProfileSchema } from "@/app/_libs/vars/schemas";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Posts from "./_components/Posts";
import Profile from "./_components/Profile";

export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery({
      queryKey: ["userProfile", username],
      queryFn: ({ queryKey }) => {
        const [_, username] = queryKey;
        return getUserProfile(username);
      },
      staleTime: 60 * 1000,
    });
  } catch (error) {
    const apiError = fromError(error);
    if (apiError.status === 404) {
      notFound();
    }
  }

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "infinite", "home", username],
    queryFn: ({ pageParam }) => getUserPosts(pageParam, username),
    staleTime: 60 * 1000,
    initialPageParam: "0",
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="max-w-grid-maxWidth flex flex-col grow w-full">
        <Profile username={username} />
        <Posts username={username} />
      </main>
    </HydrationBoundary>
  );
}

const getUserProfile = async (username: string) => {
  const response = await serverApi.get(`${username}/profile`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return ProfileSchema.parse(response.data.data);
};

const getUserPosts = async (pageParam: string, username: string) => {
  const result = await serverApi.get(`${username}/posts?cursor=${pageParam}`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return PostPageSchema.parse(result.data.data);
};
