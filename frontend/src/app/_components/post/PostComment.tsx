import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import useToggleCommentLike from "@/app/_libs/hooks/api/mutations/useToggleCommentLike";
import { formatDate, withCountability } from "@/app/_libs/utils";
import { Comment } from "@/app/_libs/vars/types";
import IconButton from "../ui/buttons/IconButton";
import { IconType } from "../ui/icon/Icons";

export function PostComment({
  comment,
  postUid,
}: {
  comment: Comment;
  postUid: string;
}) {
  const { mutate: toggleLike } = useToggleCommentLike(postUid);

  const handleLikeClick = (commentUid: string, liked: boolean) => {
    toggleLike({ liked, commentId: commentUid });
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
        onClick={() => handleLikeClick(comment.commentId, !comment.hasLiked)}
        showHighlight={false}
        iconClassName="size-5"
      />
    </div>
  );
}
