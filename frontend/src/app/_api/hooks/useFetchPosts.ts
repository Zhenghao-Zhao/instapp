import { Post, postPageSchema } from "@/app/_libs/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { clientApi } from "../axios";

export default function useFetchPosts(username: string) {
  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["posts", "infinite", "home", username],
      queryFn: ({ pageParam }) => fetchPosts(pageParam, username),
      initialPageParam: 0,
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

export const fetchPosts = async (pageParam: number, uid: string) => {
  const result = await clientApi.get(`${uid}/posts?page=${pageParam}`);
  return postPageSchema.parse(result.data.payload);
};
