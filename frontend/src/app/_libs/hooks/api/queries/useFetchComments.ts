import { delay } from "@/app/_libs/utils";
import { CommentPageSchema } from "@/app/_libs/vars/schemas";
import { Comment } from "@/app/_libs/vars/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { clientApi } from "../axios";

export type CommentWithPos = {
  comment: Comment;
  page: number;
  index: number;
};

export default function useFetchComments(postId: string) {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isRefetching } =
    useInfiniteQuery({
      queryKey: ["comments", postId],
      queryFn: ({ pageParam }) => getComments(pageParam, postId),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 10,
      refetchInterval: 1000 * 60 * 10,
      refetchIntervalInBackground: false,
    });
  const comments = useMemo(() => {
    if (!data) return [];
    const allComments = data.pages.flatMap((page) => page.data);
    return allComments;
  }, [data]);
  return {
    isFetching,
    isRefetching,
    comments,
    error,
    hasNextPage,
    fetchNextPage,
  };
}

const getComments = async (pageParam: number, postId: string) => {
  const result = await clientApi.get(
    `post/${postId}/comment?page=${pageParam}`,
  );
  await delay(2000);
  return CommentPageSchema.parse(result.data.data);
};
