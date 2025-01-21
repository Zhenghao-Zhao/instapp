import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import { IconType } from "@/app/_components/ui/icons";
import { handleToggleLikeComment } from "@/app/_libs/api/mutations";
import useFetchComments, {
  CommentWithPos,
} from "@/app/_libs/hooks/infiniteQueries/useFetchComments";
import { type UserComment } from "@/app/_libs/types";
import { withCountability, formatDate } from "@/app/_libs/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import { InfiniteScrollLoader } from "../../common";
import { IconButton } from "../../ui/buttons";
import { ListLoader, ThrobberSize } from "../../ui/loaders";
import { optUpdatePaginatedList } from "../utils";

export default function Comments({
  post_uid,
  className,
}: {
  post_uid: string;
  className?: string;
}) {
  const { comments, fetchNextPage, isFetching, hasNextPage } =
    useFetchComments(post_uid);

  if (!isFetching && comments.length < 1)
    return (
      <div className="grow flex items-center justify-center font-bold text-2xl">
        No comments
      </div>
    );
  return (
    <div className={twMerge(`grow flex flex-col py-2 px-3`, className)}>
      {comments.map((comment, i) => (
        <Comment key={i} commentData={comment} queryKey={post_uid} />
      ))}
      {comments.length > 0 ? (
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

function Comment({
  commentData,
  queryKey,
}: {
  commentData: CommentWithPos;
  queryKey: string;
}) {
  const comment = commentData.comment;
  const queryClient = useQueryClient();
  const { mutate: toggleLike } = useMutation({
    mutationFn: handleToggleLikeComment,
    onMutate: async (data) => {
      const update: Partial<UserComment> = {
        has_liked: data.to_like,
        like_count: data.to_like
          ? comment.like_count + 1
          : comment.like_count - 1,
      };
      return await optUpdatePaginatedList<UserComment>(
        "comments",
        queryClient,
        update,
        queryKey,
        commentData.page,
        commentData.index,
      );
    },
    onError: (error, _variables, context) => {
      console.log(error);
      if (!context) return;
      queryClient.setQueryData(["comments", queryKey], context.prevData);
    },
  });

  const handleLikeClick = (comment_uid: string, to_like: boolean) => {
    toggleLike({ comment_uid, to_like });
  };

  return (
    <div className="flex py-2 rounded-md hover:bg-btn-hover-primary px-2">
      <ProfileImage
        imageURL={comment.from_user.imageURL}
        className="size-comment-profile-image-size shrink-0"
      />
      <div className="flex flex-col justify-center pl-4 grow">
        <p className="font-bold w-full">{comment.from_user.name}</p>
        <p className="text-sm text-wrap leading-4 break-words max-w-comment-maxWidth w-full">
          {comment.comment}
        </p>
        <div className="text-xs text-text-secondary mt-1 flex font-bold">
          <p>{formatDate(comment.created_at)}</p>
          <button className="ml-2">
            {comment.like_count > 0 &&
              withCountability(comment.like_count, "like", "likes")}
          </button>
        </div>
      </div>
      <IconButton
        icon={comment.has_liked ? IconType.Heart : IconType.EmptyHeart}
        tip={comment.has_liked ? "Unlike" : "Like"}
        onClick={() => handleLikeClick(comment.uid, !comment.has_liked)}
        showHighlight={false}
        iconClassName="size-5"
      />
    </div>
  );
}
