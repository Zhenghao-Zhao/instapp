"use client";
import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import Alert from "@/app/_contexts/providers/AlertContextProvider";
import useDeletePost from "@/app/_libs/hooks/api/mutations/useDeletePost";
import { formatDate, getAbsoluteURL } from "@/app/_libs/utils";
import { Post } from "@/app/_libs/vars/types";
import Link from "next/link";
import AlertContent from "../ui/alert/AlertContent";
import AlertTrigger from "../ui/alert/AlertTrigger";
import DeleteAlert from "../ui/alert/DeleteAlert";
import FloatCarousel from "../ui/carousel/FloatCarousel";
import Separator from "../ui/divider/Separator";
import Throbber from "../ui/loaders/Throbber";
import PostComments from "./PostComments";
import PostOptions from "./PostOptions";

export default function PostView({ post }: { post?: Post }) {
  const { mutate, isPending } = useDeletePost();

  const handleDelete = () => {
    if (!post) {
      return;
    }
    mutate(post.postId);
  };

  if (!post) return null;
  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center h-view-image-width">
        <div className="w-view-image-width aspect-1 max-h-view-maxHeight">
          <FloatCarousel dataURLs={post.imageUrls} />
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
                <Link href={getAbsoluteURL(post.owner.username)}>
                  <p className="whitespace-nowrap text-ellipsis">
                    {post.owner.name}
                  </p>
                </Link>
                {!post.isOwner && !post.owner.isFollowing && (
                  <button className="p-2 bg-blue-500 rounded-md ml-auto text-sm">
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
                        <button className="p-2 bg-red-500 text-white rounded-md text-sm">
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
              <PostComments postId={post.postId} />
            </div>
            <Separator />
            <PostOptions post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}
