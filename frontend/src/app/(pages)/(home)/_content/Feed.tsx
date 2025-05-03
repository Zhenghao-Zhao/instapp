"use client";

import InfiniteScrollLoader from "@/app/_components/common/InfiniteScrollLoader";
import useFetchFeedPosts from "@/app/_libs/hooks/api/queries/useFetchFeedPosts";
import { Post } from "@/app/_libs/vars/types";
import { FeedCard } from "../_components/FeedCard";

export default function Feed() {
  const { posts, hasNextPage, isFetching, fetchNextPage } = useFetchFeedPosts();

  return (
    <main className="flex flex-col space-y-10 py-4 w-scroll-view-width">
      {posts.map((data: Post, i: number) => (
        <FeedCard key={i} post={data} />
      ))}
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
