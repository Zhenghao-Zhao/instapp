import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getPostsSearchResult } from "../../api/queries";
import { Post } from "../../types";

export default function useSearchPosts(query: string) {
  const {
    data,
    isFetching,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", "search", query],
    queryFn: ({ pageParam }) => getPostsSearchResult(pageParam, query),
    initialPageParam: 0,
    staleTime: 0,
    getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
    enabled: query.length > 0,
  });

  const list: Post[] = useMemo(() => {
    if (!data) return [];
    const allPosts: Post[] = data.pages.flatMap((page) =>
      page.posts.map((post: Post) => post),
    );
    return allPosts;
  }, [data]);

  return {
    isFetching,
    list,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}
