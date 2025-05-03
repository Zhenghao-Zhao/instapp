"use client";
import FloatCarousel from "@/app/_components/ui/carousel/FloatCarousel";
import Separator from "@/app/_components/ui/divider/Separator";
import { formatDate } from "@/app/_libs/utils";
import { Post } from "@/app/_libs/vars/types";
import ProfileImage from "../../[username]/_components/ProfileImage";
import { MiniPostOptions } from "./MiniPostOptions";
export function FeedCard({ post }: { post: Post }) {
  return (
    <div className="flex flex-col justify-center">
      <div className="pl-2">
        <div className="flex items-center pb-4">
          <div className="mr-4">
            <ProfileImage
              imageURL={post.owner.profileImageUrl}
              className="size-12"
            />
          </div>
          <p className="whitespace-nowrap text-ellipsis">{post.owner.name}</p>
        </div>
        {post.content && (
          <p className="flex items-center pb-2">{post.content}</p>
        )}
        <div className="text-xs text-text-secondary pb-2">
          {formatDate(post.createdAt)}
        </div>
      </div>
      <div className="aspect-1 max-h-view-maxHeight shrink-0 rounded-lg overflow-hidden">
        <FloatCarousel dataURLs={post.imageUrls} />
      </div>
      <MiniPostOptions post={post} />
      <Separator className="h-4" />
    </div>
  );
}
