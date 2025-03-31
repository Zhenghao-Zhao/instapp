import { serverApi } from "@/app/_api/axios";
import { postPageSchema } from "@/app/_libs/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import Body from "./Body";

export default async function Posts({
  params: { username },
}: {
  params: { username: string };
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "infinite", "home", username],
    queryFn: ({ pageParam }) => getUserPosts(pageParam, username),
    staleTime: 60 * 1000,
    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Body username={username} />
    </HydrationBoundary>
  );
}

const getUserPosts = async (pageParam: number, username: string) => {
  const result = await serverApi.get(`${username}/posts?page=${pageParam}`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return postPageSchema.parse(result.data.payload);
};
