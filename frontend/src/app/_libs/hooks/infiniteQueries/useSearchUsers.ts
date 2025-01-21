import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getUsersSearchResult } from "../../api/queries";
import { UserSearchItem } from "../../types";

export default function useSearchUsers(query: string) {
  const {
    data,
    isFetching,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["users", "search", query],
    queryFn: ({ pageParam }) => getUsersSearchResult(pageParam, query),
    initialPageParam: 0,
    staleTime: 0,
    getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });

  const list: UserSearchItem[] = useMemo(() => {
    if (!data) return [];
    const searchResult: UserSearchItem[] = data.pages.flatMap((page) =>
      page.result.map((friend: UserSearchItem) => friend),
    );
    return searchResult;
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
