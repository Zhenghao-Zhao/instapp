import { Post } from "@/app/_libs/vars/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function useFetchExplorePosts(initialData: any) {
  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["posts", "explore"],
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
function getExplorePosts(pageParam: number): any {
  throw new Error("Function not implemented.");
}
