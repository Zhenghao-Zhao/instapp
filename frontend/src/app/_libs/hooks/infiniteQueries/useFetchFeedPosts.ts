import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getFeedPosts } from "../../api/queries";
import { Post } from "../../types";

export default function useFetchFeedPosts(initialData: any, page = 0) {
  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["posts", "infinite", "feed"],
      queryFn: ({ pageParam }) => getFeedPosts(pageParam),
      initialPageParam: page,
      getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5,
      refetchInterval: 1000 * 60 * 5,
      initialData,
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
