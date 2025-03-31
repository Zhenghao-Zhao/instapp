import { useDataContext } from "@/app/_libs/contexts/providers/ServerContextProvider";
import { Post, Profile } from "@/app/_libs/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { clientApi } from "../axios";
import { toast } from "react-toastify";

export default function useDeletePost() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { authProfile } = useDataContext();
  const mutation = useMutation({
    mutationFn: deletePost,
    onMutate: async (postUid) => {
      await queryClient.cancelQueries({
        queryKey: ["userProfile", authProfile.userUid],
      });
      await queryClient.cancelQueries({
        queryKey: ["posts"],
      });
      // update user post count
      const prevProfile = queryClient.getQueryData<Profile>([
        "userProfile",
        authProfile.userUid,
      ]);
      const prevPosts = queryClient.getQueriesData({ queryKey: ["posts"] });

      queryClient.setQueryData(
        ["userProfile", authProfile.userUid],
        (old: Profile) => ({
          ...old,
          post_count: old.postCount - 1,
        }),
      );

      queryClient.setQueriesData(
        { queryKey: ["posts"], type: "active" },
        (data: any) => {
          // check if query cache is pointing to paginated data
          if ("pages" in data) {
            const newPages = data.pages.map((page: any) => {
              const newPosts = page.posts.filter(
                (post: Post) => post.postUid !== postUid,
              );
              return { ...page, posts: newPosts };
            });
            return { ...data, pages: newPages };
          } else if (data.uid === postUid) {
            return data.filter((post: Post) => post.postUid !== postUid);
          }
        },
      );
      // close modal after delete
      router.back();

      return { prevProfile, prevPosts };
    },
    onError: (_err, _postUid, context) => {
      toast.error("Request failed, please try again later");
      if (!context) return;
      queryClient.setQueryData(
        ["userProfile", authProfile.userUid],
        context.prevProfile,
      );
      queryClient.setQueriesData(
        { queryKey: ["posts"], type: "active" },
        context.prevPosts,
      );
    },
  });

  return mutation;
}

const deletePost = async (postUid: string) => {
  return clientApi.delete(`post/${postUid}`);
};
