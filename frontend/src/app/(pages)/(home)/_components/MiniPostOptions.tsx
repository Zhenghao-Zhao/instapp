import IconButton from "@/app/_components/ui/buttons/IconButton";
import { IconType } from "@/app/_components/ui/icon/Icons";
import useTogglePostLike from "@/app/_libs/hooks/api/mutations/useTogglePostLike";
import { getAbsoluteURL } from "@/app/_libs/utils";
import { Post } from "@/app/_libs/vars/types";
import Link from "next/link";

export function MiniPostOptions({ post }: { post: Post }) {
  const { mutate: toggleLike } = useTogglePostLike();

  const handleLikeClick = () => {
    toggleLike({ liked: !post.hasLiked, postId: post.postId });
  };

  return (
    <div className="flex h-comment-info-height items-center px-2 shrink-0">
      <IconButton
        icon={post.hasLiked ? IconType.Heart : IconType.EmptyHeart}
        tip={post.hasLiked ? "Unlike" : "Like"}
        onClick={handleLikeClick}
        title={`${post.likeCount} likes`}
        className="gap-2 p-1 px-2 rounded-lg"
      />
      <Link
        href={getAbsoluteURL(`p/${post.postId}`)}
        scroll={false}
        data-disable-nprogress={true}
        className="ml-[20px]"
      >
        <IconButton
          icon={IconType.Comments}
          title={`${post.commentCount} comments`}
          tip="Show comments"
          className="gap-2 p-1 px-2 rounded-lg"
        />
      </Link>
    </div>
  );
}
