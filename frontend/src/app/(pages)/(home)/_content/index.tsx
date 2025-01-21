"use client";

import { InfiniteScrollLoader } from "@/app/_components/common";
import useFetchFeedPosts from "@/app/_libs/hooks/infiniteQueries/useFetchFeedPosts";
import usePageOnLoad from "@/app/_libs/hooks/usePageOnLoad";
import { Post } from "@/app/_libs/types";
import { FeedCard } from "../_components/FeedCard";

export default function Content({ initData }: { initData: any }) {
  usePageOnLoad();
  const { posts, hasNextPage, isFetching, fetchNextPage } =
    useFetchFeedPosts(initData);
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

