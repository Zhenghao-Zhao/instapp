import useCreateComment from "@/app/_libs/hooks/api/mutations/useCreateComment";
import useTogglePostLike from "@/app/_libs/hooks/api/mutations/useTogglePostLike";
import { withCountability } from "@/app/_libs/utils";
import { Post } from "@/app/_libs/vars/types";
import { ChangeEvent, useRef, useState } from "react";
import IconButton from "../ui/buttons/IconButton";
import Separator from "../ui/divider/Separator";
import { IconType } from "../ui/icon/Icons";
import Throbber, { ThrobberSize } from "../ui/loaders/Throbber";

export default function PostOptions({ post }: { post: Post }) {
  const [comment, setComment] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const { mutate: toggleLike } = useTogglePostLike();
  const { mutate: addComment, isPending } = useCreateComment(post.postId);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    setComment(e.currentTarget.value);
  };

  const handlePostComment = () => {
    if (comment.length < 1) return;
    addComment({
      content: comment,
      postId: post.postId,
    });
  };

  const handleLikeClick = () => {
    toggleLike({ liked: !post.hasLiked, postId: post.postId });
  };

  return (
    <>
      <div className="flex h-comment-info-height items-center px-2 justify-center shrink-0">
        <IconButton
          icon={post.hasLiked ? IconType.Heart : IconType.EmptyHeart}
          tip={post.hasLiked ? "Unlike" : "Like"}
          onClick={handleLikeClick}
          showHighlight={false}
        />
        <p className="grow ml-2">
          {post.likeCount > 0
            ? withCountability(post.likeCount, "like", "likes")
            : "Be the first to like this"}
        </p>
      </div>
      <Separator />
      <div className="flex items-center w-full shrink-0 py-2">
        <textarea
          className="resize-none grow px-2 max-h-comment-input-maxHeight bg-transparent"
          placeholder="Add a comment..."
          onChange={handleChange}
          value={comment}
          rows={1}
          ref={ref}
        />
        <button
          className="h-[30px] mx-2"
          onClick={handlePostComment}
          disabled={isPending}
        >
          {isPending ? <Throbber size={ThrobberSize.SMALL} /> : "Post"}
        </button>
      </div>
    </>
  );
}
