import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getExplorePosts } from "../../api/queries";
import { Post } from "../../types";

export default function useFetchExplorePosts(initialData: any) {
  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["posts", "infinite", "explore"],
      queryFn: ({ pageParam }) => getExplorePosts(pageParam),
      initialPageParam: 0,
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
