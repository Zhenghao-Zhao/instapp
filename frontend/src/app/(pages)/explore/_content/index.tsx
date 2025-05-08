"use client";
import InfiniteScrollLoader from "@/app/_components/common/InfiniteScrollLoader";
import PostEntry from "@/app/_components/post/PostEntry";
import useFetchExplorePosts from "@/app/_libs/hooks/api/queries/useFetchExplorePosts";
import { getAbsoluteURL } from "@/app/_libs/utils";
import { Post } from "@/app/_libs/vars/types";
import Link from "next/link";
import React from "react";

export default function Content({
  uid,
  initData,
}: {
  uid: string;
  initData: any;
}) {
  const { posts, isFetching, hasNextPage, fetchNextPage } =
    useFetchExplorePosts(initData);
  return (
    <main className="w-full h-full max-w-grid-maxWidth">
      <div className="grid gap-2 grid-cols-3 w-full">
        {posts.map((post: Post, j: number) => {
          return (
            <Link
              href={getAbsoluteURL(`p/${post.postId}`)}
              key={j}
              scroll={false}
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
    </main>
  );
}
