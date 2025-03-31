import { clientApi } from "@/app/_api/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { PostComment, commentPageSchema } from "../../types";

export type CommentWithPos = {
  comment: PostComment;
  page: number;
  index: number;
};

export default function useFetchComments(postUid: string) {
  const { data, error, fetchNextPage, hasNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["comments", postUid],
      queryFn: ({ pageParam }) => getComments(pageParam, postUid),
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
    comments,
    error,
    hasNextPage,
    fetchNextPage,
  };
}

const getComments = async (pageParam: number, postUid: string) => {
  const result = await clientApi.get(
    `post/${postUid}/comment?page=${pageParam}`,
  );
  return commentPageSchema.parse(result.data.payload);
};
