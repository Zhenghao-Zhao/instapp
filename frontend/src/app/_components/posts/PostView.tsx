"use client";
import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import useCreateComment from "@/app/_api/hooks/useCreateComment";
import useDeletePost from "@/app/_api/hooks/useDeletePost";
import useTogglePostLike from "@/app/_api/hooks/useTogglePostLike";
import { AlertContent, AlertTrigger } from "@/app/_components/ui/alert";
import Alert from "@/app/_libs/contexts/providers/AlertContextProvider";
import { Post } from "@/app/_libs/types";
import { formatDate, withCountability } from "@/app/_libs/utils";
import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";
import DeleteAlert from "../ui/alert/templates";
import { IconButton } from "../ui/buttons";
import { Carousel } from "../ui/carousel";
import { IconType } from "../ui/icons";
import Throbber, { ThrobberSize } from "../ui/loaders";
import Separator from "../ui/separator";
import Comments from "./components/Comments";

export default function PostView({ post }: { post?: Post }) {
  const { mutate, isPending } = useDeletePost();

  const handleDelete = () => {
    if (!post) {
      return;
    }
    mutate(post.postUid);
  };

  if (!post) return null;
  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center h-view-image-width">
        <div className="w-view-image-width aspect-1 max-h-view-maxHeight">
          <Carousel dataURLs={post.imageUrls} />
        </div>
        <div className="relative w-view-comment-width h-view-image-width bg-modal-primary">
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-col h-comment-header-height px-4 justify-center shrink-0">
              <div className="flex items-center">
                <Link href={post.owner.username}>
                  <div className="mr-4">
                    <ProfileImage
                      imageURL={post.owner.profileImageUrl}
                      className="size-12"
                    />
                  </div>
                </Link>
                <Link href={post.owner.username}>
                  <p className="whitespace-nowrap text-ellipsis">
                    {post.owner.name}
                  </p>
                </Link>
                {!post.isOwner && !post.owner.isFollowing && (
                  <button className="p-2 bg-blue-500 rounded-md text-white ml-auto text-sm">
                    Follow
                  </button>
                )}
                {post.isOwner &&
                  (isPending ? (
                    <div className="relative ml-auto">
                      <Throbber />
                    </div>
                  ) : (
                    <Alert>
                      <AlertTrigger className="ml-auto">
                        <button className="p-2 bg-red-500 rounded-md text-white text-sm">
                          Delete
                        </button>
                      </AlertTrigger>
                      <AlertContent animation="fade-in">
                        <DeleteAlert onConfirm={handleDelete} />
                      </AlertContent>
                    </Alert>
                  ))}
              </div>
            </div>
            <div className="flex flex-col grow overflow-x-hidden scrollbar-none">
              <div className="border-b px-4 pb-2">
                {post.content && <div>{post.content}</div>}
                <p
                  className={`text-xs text-text-secondary ${
                    post.content && "mt-1"
                  }`}
                >
                  {formatDate(post.createdAt)}
                </p>
              </div>
              <Comments post_uid={post.postUid} />
            </div>
            <Separator />
            <PostOptions post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PostOptions({ post }: { post: Post }) {
  const [comment, setComment] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const { mutate: toggleLike } = useTogglePostLike();
  const { mutate: addComment, isPending } = useCreateComment(post.postUid);

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
      postUid: post.postUid,
    });
  };

  const handleLikeClick = () => {
    toggleLike({ liked: !post.hasLiked, postUid: post.postUid });
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
