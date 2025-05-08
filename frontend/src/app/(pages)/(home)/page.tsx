import { serverApi } from "@/app/_libs/hooks/api/axios";
import { FeedPageSchema } from "@/app/_libs/vars/schemas";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import Content from "./Content";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "feed"],
    queryFn: ({ pageParam }) => getFeedPosts(pageParam),
    staleTime: 60 * 1000,
    initialPageParam: "0",
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content />
    </HydrationBoundary>
  );
}

const getFeedPosts = async (pageParam: string) => {
  const result = await serverApi.get(`feed?cursor=${pageParam}`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  return FeedPageSchema.parse(result.data.data);
};
