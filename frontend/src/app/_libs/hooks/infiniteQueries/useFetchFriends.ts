import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getFriends } from "../../api/queries";
import { Friend, Friendship } from "../../types";

export default function useFetchFriends(uid: string, friendship: Friendship) {
  const {data, isFetching, error, hasNextPage, isFetchingNextPage, fetchNextPage} = useInfiniteQuery({
    queryKey: [friendship, uid],
    queryFn: ({ pageParam }) => getFriends(pageParam, uid, friendship),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
    staleTime: 10 * 60 * 1000,
    refetchOnMount: "always",
  });

  const list: Friend[] = useMemo(() => {
    if (!data) return [];
    const allFriends: Friend[] = data.pages.flatMap((page) =>
      page.friends.map((friend: Friend) => friend)
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
