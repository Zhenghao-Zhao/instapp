import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Friend, Friendship } from "../../types";

export default function useSearchFriends(
  uid: string,
  friendship: Friendship,
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
    queryKey: ["friends", uid, "search", friendship, query],
    queryFn: ({ pageParam }) =>
      getFriendsSearchResult(pageParam, uid, friendship, query),
    initialPageParam: 0,
    staleTime: 0,
    getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
    refetchOnMount: "always",
    placeholderData: keepPreviousData,
  });

  const list: Friend[] = useMemo(() => {
    if (!data) return [];
    const allFriends: Friend[] = data.pages.flatMap((page) =>
      page.friends.map((friend: Friend) => friend),
    );
    return allFriends;
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

const getFriendsSearchResult = async (
  pageParam: number,
  uid: string,
  friendship: Friendship,
  query: string,
) => {
  const url =
    query.length > 0
      ? `${uid}/${friendship}?page=${pageParam}&query=${query}`
      : `${uid}/${friendship}?page=${pageParam}`;
  const result = await clientApi.get<FriendPage>(url);
  return result.data;
};
