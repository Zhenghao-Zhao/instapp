import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getComments } from "../../api/queries";
import { UserComment } from "../../types";

export type CommentWithPos = {
  comment: UserComment;
  page: number;
  index: number;
};

export default function useFetchComments(post_uid: string) {
  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["comments", post_uid],
      queryFn: ({ pageParam }) => getComments(pageParam, post_uid),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 10,
      refetchInterval: 1000 * 60 * 10,
      refetchIntervalInBackground: false,
    });
  const comments: CommentWithPos[] = useMemo(() => {
    if (!data) return [];
    const allComments: CommentWithPos[] = data.pages.flatMap((page, i: number) =>
      page.comments.map((comment: UserComment, j: number) => ({
        comment,
        page: i,
        index: j
      }))
    );
    return allComments;
  }, [data]);
  return {
    isFetching,
    comments,
    error,
    hasNextPage,
    fetchNextPage,
  };
}
