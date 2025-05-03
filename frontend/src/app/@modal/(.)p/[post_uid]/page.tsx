"use client";
import PostView from "@/app/_components/post/PostView";
import { ModalWrapper } from "@/app/_components/ui/modal";
import Modal from "@/app/_libs/contexts/providers/ModalContextProivder";
import { Post } from "@/app/_libs/types/zod";
import { useQueries, useQueryClient } from "@tanstack/react-query";

export default function Page({
  params: { post_uid },
}: {
  params: { post_uid: string };
}) {
  const queryClient = useQueryClient();
  const cache = queryClient.getQueryCache();
  const queryKeys = cache
    .getAll()
    .map((c) => c.queryKey)
    .filter((key) => key[0] === "posts" && key[1] === "infinite");

  const results = useQueries({
    queries: queryKeys.map((key) => ({
      queryKey: key,
      enabled: false,
    })),
    combine: (results) =>
      results.flatMap((result) => {
        return (result.data as any).pages.flatMap((page: any) => page.data);
      }),
  });

  const post = findPost(post_uid, results);
  return (
    <Modal isRouted>
      <ModalWrapper>
        <PostView post={post} />
      </ModalWrapper>
    </Modal>
  );
}

function findPost(postId: string, posts: Post[]): Post {
  const post = posts.find((post) => post.postId === postId);
  return post!;
}
