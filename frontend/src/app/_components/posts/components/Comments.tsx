import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import useToggleCommentLike from "@/app/_api/hooks/useToggleCommentLike";
import { IconType } from "@/app/_components/ui/icons";
import useFetchComments from "@/app/_libs/hooks/infiniteQueries/useFetchComments";
import { PostComment } from "@/app/_libs/types";
import { formatDate, withCountability } from "@/app/_libs/utils";
import { twMerge } from "tailwind-merge";
import { InfiniteScrollLoader } from "../../common";
import { IconButton } from "../../ui/buttons";
import { ListLoader, ThrobberSize } from "../../ui/loaders";

export default function Comments({
  post_uid,
  className,
}: {
  post_uid: string;
  className?: string;
}) {
  const { comments, fetchNextPage, isFetching, hasNextPage, error } =
    useFetchComments(post_uid);

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
        <Comment key={i} comment={comment} postUid={post_uid} />
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
  comment,
  postUid,
}: {
  comment: PostComment;
  postUid: string;
}) {
  const { mutate: toggleLike } = useToggleCommentLike(postUid);

  const handleLikeClick = (commentUid: string, liked: boolean) => {
    toggleLike({ liked, commentUid });
  };

  return (
    <div className="flex py-2 rounded-md hover:bg-btn-hover-primary px-2">
      <ProfileImage
        imageURL={comment.owner.profileImageUrl}
        className="size-comment-profile-image-size shrink-0"
      />
      <div className="flex flex-col justify-center pl-4 grow">
        <p className="font-bold w-full">{comment.owner.name}</p>
        <p className="text-sm text-wrap leading-4 break-words max-w-comment-maxWidth w-full">
          {comment.content}
        </p>
        <div className="text-xs text-text-secondary mt-1 flex font-bold">
          <p>{formatDate(comment.createdAt)}</p>
          <button className="ml-2">
            {comment.likeCount > 0 &&
              withCountability(comment.likeCount, "like", "likes")}
          </button>
        </div>
      </div>
      <IconButton
        icon={comment.hasLiked ? IconType.Heart : IconType.EmptyHeart}
        tip={comment.hasLiked ? "Unlike" : "Like"}
        onClick={() => handleLikeClick(comment.commentUid, !comment.hasLiked)}
        showHighlight={false}
        iconClassName="size-5"
      />
    </div>
  );
}
