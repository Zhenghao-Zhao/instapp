"use client";
import InfiniteScrollLoader from "@/app/_components/common/InfiniteScrollLoader";
import PostEntry from "@/app/_components/post/PostEntry";
import useFetchPosts from "@/app/_libs/hooks/api/queries/useFetchPosts";
import { getAbsoluteURL } from "@/app/_libs/utils";
import { Post } from "@/app/_libs/vars/types";
import Link from "next/link";

export default function Posts({ username }: { username: string }) {
  const {
    query: { isFetching, hasNextPage, fetchNextPage },
    posts,
  } = useFetchPosts(username);

  return (
    <>
      {!isFetching && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center m-[100px]">
          <p className="text-xl">Looks like there are no posts here</p>
        </div>
      )}
      <div className="grid gap-2 grid-cols-3 w-full">
        {posts.map((post: Post, j: number) => {
          return (
            <Link
              href={getAbsoluteURL(`p/${post.postId}`)}
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
