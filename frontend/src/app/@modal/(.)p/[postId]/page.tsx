"use client";
import PostView from "@/app/_components/post/PostView";
import ModalContent from "@/app/_components/ui/modal/ModalContent";
import Modal from "@/app/_contexts/providers/ModalContextProivder";
import { Post } from "@/app/_libs/vars/types";
import { useQueries, useQueryClient } from "@tanstack/react-query";

export default function Page({
  params: { postId },
}: {
  params: { postId: string };
}) {
  const queryClient = useQueryClient();
  const cache = queryClient.getQueryCache();
  const queryKeys = cache
    .getAll()
    .map((c) => c.queryKey)
    .filter((key) => key[0] === "posts");

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

  const post = findPost(postId, results);
  return (
    <Modal isRouted>
      <ModalContent>
        <PostView post={post} />
      </ModalContent>
    </Modal>
  );
}

function findPost(postId: string, posts: Post[]): Post {
  const post = posts.find((post) => post.postId === postId);
  return post!;
}
