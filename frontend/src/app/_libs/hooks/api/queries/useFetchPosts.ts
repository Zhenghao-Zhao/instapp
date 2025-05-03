import { PostPageSchema } from "@/app/_libs/vars/schemas";
import { Post } from "@/app/_libs/vars/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { clientApi } from "../axios";

export default function useFetchPosts(username: string) {
  const query = useInfiniteQuery({
    queryKey: ["posts", "infinite", "home", username],
    queryFn: ({ pageParam }) => getUserPosts(pageParam, username),
    initialPageParam: "0",
    getNextPageParam: (lastPage, _pages) => lastPage.nextCursor,
    staleTime: 1000 * 6 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
  const posts = useMemo(() => {
    if (!query.data) return [];
    const allPosts: Post[] = query.data.pages.flatMap((page) => page.data);
    return allPosts;
  }, [query.data]);

  if (query.error) {
    toast("Something went wrong");
    throw new Error("Failed to retrieve posts, please try again later");
  }

  return {
    query,
    posts,
  };
}

const getUserPosts = async (pageParam: string, username: string) => {
  const result = await clientApi.get(`${username}/posts?cursor=${pageParam}`);
  return PostPageSchema.parse(result.data.data);
};
