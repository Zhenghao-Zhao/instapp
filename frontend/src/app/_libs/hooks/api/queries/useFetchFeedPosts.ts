import { FeedPageSchema } from "@/app/_libs/vars/schemas";
import { Post } from "@/app/_libs/vars/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { clientApi } from "../axios";

export default function useFetchFeedPosts() {
  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["posts", "feed"],
      queryFn: ({ pageParam }) => getFeedPosts(pageParam),
      initialPageParam: "0",
      getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 5,
    });

  const posts = useMemo(() => {
    if (!data) return [];
    const allPosts: Post[] = data.pages.flatMap((page) => page.data);
    return allPosts;
  }, [data]);

  return {
    isFetching,
    posts,
    error,
    hasNextPage,
    fetchNextPage,
  };
}

const getFeedPosts = async (pageParam: string) => {
  const result = await clientApi.get(`feed?cursor=${pageParam}`);
  return FeedPageSchema.parse(result.data.data);
};
