"use client";
import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import { AlertContent, AlertTrigger } from "@/app/_components/ui/alert";
import {
  handleAddComment,
  handleDeletePost,
  handleToggleLike,
} from "@/app/_libs/api/mutations";
import Alert from "@/app/_libs/contexts/providers/AlertContextProvider";
import { Post, Profile, UserComment } from "@/app/_libs/types";
import { withCountability, formatDate } from "@/app/_libs/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
import DeleteAlert from "../ui/alert/templates";
import { IconButton } from "../ui/buttons";
import { Carousel } from "../ui/carousel";
import { IconType } from "../ui/icons";
import Throbber, { ThrobberSize } from "../ui/loaders";
import Separator from "../ui/separator";
import Comments from "./components/Comments";
import { batchUpdatePosts, optAddComment, optDeletePost } from "./utils";
import Link from "next/link";

export default function PostView({ post }: { post?: Post }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: handleDeletePost,
    onSuccess: () => {
      // update user post count
      const prevData = queryClient.getQueryData<Profile>([
        "userProfile",
        post!.owner.uid,
      ]);

      if (!prevData) {
        window.location.reload();
        return;
      }

      queryClient.setQueryData(["userProfile", post!.owner.uid], {
        ...prevData,
        post_count: prevData.post_count - 1,
      });
      // update posts
      optDeletePost(queryClient, post!.uid);
      router.back();
    },
  });

  const handleDelete = () => {
    deletePost(post!.uid);
  };

  if (!post) return null;
  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center h-view-image-width">
        <div className="w-view-image-width aspect-1 max-h-view-maxHeight">
          <Carousel dataURLs={post.imageURLs} />
        </div>
        <div className="relative w-view-comment-width h-view-image-width bg-modal-primary">
          <div className="w-full h-full flex flex-col">
            <div className="flex flex-col h-comment-header-height px-4 justify-center shrink-0">
              <div className="flex items-center">
                <Link href={post.owner.bioURL}>
                  <div className="mr-4">
                    <ProfileImage
                      imageURL={post.owner.imageURL}
                      className="size-12"
                    />
                  </div>
                </Link>
                <Link href={post.owner.bioURL}>
                  <p className="whitespace-nowrap text-ellipsis">
                    {post.owner.name}
                  </p>
                </Link>
                {!post.is_owner && !post.owner.has_followed && (
                  <button className="p-2 bg-blue-500 rounded-md text-white ml-auto text-sm">
                    Follow
                  </button>
                )}
                {post.is_owner &&
                  (isDeleting ? (
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
                {post.description && <div>{post.description}</div>}
                <p
                  className={`text-xs text-text-secondary ${
                    post.description && "mt-1"
                  }`}
                >
                  {formatDate(post.created_at)}
                </p>
              </div>
              <Comments post_uid={post.uid} />
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
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const { mutate: toggleLike } = useMutation({
    mutationFn: handleToggleLike,
    onMutate: async (data) => {
      const prevPost = post;
      const update: Partial<UserComment> = {
        has_liked: data.has_liked,
        like_count: data.has_liked
          ? prevPost.like_count + 1
          : prevPost.like_count - 1,
      };
      return await batchUpdatePosts(queryClient, update, post.uid);
    },
    onError: (error, _variables, context) => {
      console.log(error);
      if (!context) return;
      queryClient.setQueriesData({ queryKey: ["posts"] }, context.prevData);
    },
  });

  const { mutate: addComment, isPending } = useMutation({
    mutationFn: (formData: FormData) => handleAddComment(post.uid, formData),
    onSuccess(data) {
      optAddComment(queryClient, data.data, post.uid);
      setComment("");
      ref.current!.style.height = "auto";
    },
    onError(error) {
      console.log(error.message);
    },
  });

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    setComment(e.currentTarget.value);
  };

  const handlePostComment = () => {
    if (comment.length < 1) return;
    const formData = new FormData();
    formData.append("comment", comment);
    addComment(formData);
  };

  const handleLikeClick = () => {
    toggleLike({ post_uid: post.uid, has_liked: !post.has_liked });
  };

  return (
    <>
      <div className="flex h-comment-info-height items-center px-2 justify-center shrink-0">
        <IconButton
          icon={post.has_liked ? IconType.Heart : IconType.EmptyHeart}
          tip={post.has_liked ? "Unlike" : "Like"}
          onClick={handleLikeClick}
          showHighlight={false}
        />
        <p className="grow ml-2">
          {post.like_count > 0
            ? withCountability(post.like_count, "like", "likes")
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
