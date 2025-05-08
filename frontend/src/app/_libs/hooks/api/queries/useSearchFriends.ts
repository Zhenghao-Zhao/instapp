import { UserPageSchema } from "@/app/_libs/vars/schemas";
import { User } from "@/app/_libs/vars/types";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { clientApi } from "../axios";
import useFetchFriendships from "./useFetchFriendships";

export default function useSearchFriends(
  userId: string,
  followship: string,
  query: string,
) {
  const {
    data,
    isFetching,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["friends", userId, "search", followship, query],
    queryFn: ({ pageParam }) =>
      getFriendsSearchResult(pageParam, userId, followship, query),
    initialPageParam: "0",
    staleTime: 30 * 60 * 60,
    getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });

  const friendList: User[] = useMemo(() => {
    if (!data) return [];
    const allFriends: User[] = data.pages.flatMap((page) => page.data);
    return allFriends;
  }, [data]);

  const idList: string[] = useMemo(() => {
    if (!data) return [];
    const list = data.pages
      .flatMap((page) => page.data)
      .map((friend) => friend.userId);
    return list;
  }, [data]);

  const { data: friendshipList, isPending } = useFetchFriendships(idList);

  return {
    isFetching: isFetching || isPending,
    friendList,
    friendshipList,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}

const getFriendsSearchResult = async (
  pageParam: string,
  userId: string,
  followship: string,
  query: string,
) => {
  const result = await clientApi.get(
    `/${followship}/${userId}/search?cursor=${pageParam}${query && "&query=" + query}`,
  );
  return UserPageSchema.parse(result.data.data);
};
