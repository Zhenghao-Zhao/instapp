"use client";
import { InfiniteScrollLoader } from "@/app/_components/common";
import PostEntry from "@/app/_components/posts/PostEntry";
import { STATIC_PATHS } from "@/app/_libs/constants";
import useFetchPosts from "@/app/_libs/hooks/infiniteQueries/useFetchPosts";
import { Post, Profile } from "@/app/_libs/types";
import { getAbsoluteURL } from "@/app/_libs/utils";
import Image from "next/image";
import Link from "next/link";

export default function Body({
  initialData,
  profile,
}: {
  initialData: any;
  profile: Profile;
}) {
  const { posts, isFetching, hasNextPage, fetchNextPage } = useFetchPosts(
    profile.uid,
    initialData,
  );
  return (
    <>
      {!isFetching && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center m-[100px]">
          <div className="size-[150px] relative">
            <Image
              src={STATIC_PATHS.EMPTY_FOLDER}
              alt="image"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-xl">Looks like there are no posts here</p>
        </div>
      )}
      <div className="grid gap-2 grid-cols-3 w-full">
        {posts.map((post: Post, j: number) => {
          return (
            <Link
              href={getAbsoluteURL(`p/${post.uid}`)}
              key={j}
              scroll={false}
              data-disable-nprogress={true}
            >
              <PostEntry post={post} />
            </Link>
          );
        })}
      </div>
      <div className="h-16 flex justify-center items-center">
        <InfiniteScrollLoader
          hasNextPage={hasNextPage}
          isFetching={isFetching}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </>
  );
}
