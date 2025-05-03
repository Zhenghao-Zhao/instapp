import useFetchComments from "@/app/_libs/hooks/api/queries/useFetchComments";
import { twMerge } from "tailwind-merge";
import InfiniteScrollLoader from "../common/InfiniteScrollLoader";
import ListLoader from "../ui/loaders/ListLoader";
import { ThrobberSize } from "../ui/loaders/Throbber";
import { PostComment } from "./PostComment";

export default function PostComments({
  postId,
  className,
}: {
  postId: string;
  className?: string;
}) {
  const {
    comments,
    fetchNextPage,
    isFetching,
    hasNextPage,
    error,
    isRefetching,
  } = useFetchComments(postId);

  if (error) {
    return (
      <div className="grow flex items-center justify-center font-bold text-2xl">
        An unexpected error occured
      </div>
    );
  }

  if (!isFetching && comments.length < 1)
    return (
      <div className="grow flex items-center justify-center font-bold text-2xl">
        No comments
      </div>
    );
  return (
    <div className={twMerge(`grow flex flex-col py-2 px-3`, className)}>
      {comments.map((comment, i) => (
        <PostComment key={i} comment={comment} postUid={postId} />
      ))}
      {comments.length > 0 || isRefetching ? (
        <InfiniteScrollLoader
          hasNextPage={hasNextPage}
          isFetching={isFetching}
          fetchNextPage={fetchNextPage}
          loaderSize={ThrobberSize.SMALL}
        />
      ) : (
        <ListLoader />
      )}
    </div>
  );
}
