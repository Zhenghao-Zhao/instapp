import { UserPageSchema } from "@/app/_libs/vars/schemas";
import { User } from "@/app/_libs/vars/types";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { clientApi } from "../axios";

export default function useSearchUsers(query: string, showResult: boolean) {
  const {
    data,
    isFetching,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["users", "search", query],
    queryFn: ({ pageParam }) => getUserSearchResult(pageParam, query),
    initialPageParam: "0",
    staleTime: 0,
    getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
    enabled: showResult,
  });

  const list: User[] = useMemo(() => {
    if (!data) return [];
    const list = data.pages.flatMap((page) => page.data);
    return list;
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

const getUserSearchResult = async (pageParam: string, query: string) => {
  const result = await clientApi.get(
    `search?cursor=${pageParam}&query=${query}`,
  );
  return UserPageSchema.parse(result.data.data);
};
